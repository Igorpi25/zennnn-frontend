import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails
} from 'amazon-cognito-identity-js'
import StorageHelper from './StorageHelper'

import { apolloClient } from '../../main'
import { GET_PROFILE_CLIENT, LOGIN } from '../../schema'

const USER_ADMIN_SCOPE = 'aws.cognito.signin.user.admin'

export default class Auth {
  constructor (config = {}) {
    const region = config.region || process.env.VUE_APP_AWS_COGNITO_REGION
    const userPoolId = config.userPoolId || process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID
    const userPoolWebClientId = config.userPoolWebClientId || process.env.VUE_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID
    this._config = {
      region,
      userPoolId,
      userPoolWebClientId
    }
    this._memoryStorage = new StorageHelper(true).getStorage()
    this._storage = new StorageHelper().getStorage()
    const userPoolData = {
      UserPoolId: userPoolId,
      ClientId: userPoolWebClientId
    }
    this.userPool = new CognitoUserPool(userPoolData)
  }
  signIn (username, password) {
    if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
    if (!username || !password) {
      return Promise.reject(new Error('Username or password not defined.'))
    }
    const authenticationData = {
      Username: username,
      Password: password,
    }
    const authenticationDetails = new AuthenticationDetails(
      authenticationData
    )
    // use memory storage for login
    const cognitoUser = this._createCognitoUser(username, true)
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          this.login()
            .then(() => {
              // set keys from memory storage to local storage
              for (let [k, v] of this._memoryStorage.storageItemsMap()) {
                this._storage.setItem(k, v)
              }
              // clear memory storage
              this._memoryStorage.clear()
              // recreate user with local storage
              this._createCognitoUser(username)
              resolve(result)
            })
            .catch(err => {
              reject(err)
            })
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }
  login () {
    return new Promise((resolve, reject) => {
      apolloClient.mutate({
        mutation: LOGIN
      }).then(loginResult => {
        if (loginResult && loginResult.data && loginResult.data.login) {
          apolloClient.cache.writeQuery({
            query: GET_PROFILE_CLIENT,
            data: {
              getProfile: loginResult.data.login
            }
          })
        }
        apolloClient.cache.writeData({
          data: {
            isLoggedIn: true
          }
        })
        resolve()
      }).catch(error => {
        console.warn('Login Error', error)
        reject(error)
      })
    })
  }
  signUp (username, password, attrs) {
    if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
    if (!username || !password) {
      return Promise.reject(new Error('Username or password not defined.'))
    }
    let attributes = []
    Object.keys(attrs).map(key => {
      const attr = { Name: key, Value: attrs[key] }
      attributes.push(attr)
    })
    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, attributes, null, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }
  forgotPassword (username) {
    if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
    if (!username) {
      return Promise.reject(new Error('Username not defined.'))
    }
    const cognitoUser = this._createCognitoUser(username)
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          console.log('CodeDeliveryData from forgotPassword: ' + data)
          resolve(data)
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }
  forgotPasswordConfirm (username, code, password) {
    if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
    if (!username || !code || !password) {
      return Promise.reject(new Error('Required param not defined.'))
    }
    const cognitoUser = this._createCognitoUser(username)
    return new Promise((resolve, reject) => {
      cognitoUser.confirmPassword(code, password, {
        onSuccess: () => {
          console.log('Password confirmed!')
          resolve()
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }
  signOut (opts) { // eslint-disable-line
		this._cleanCachedItems()
		if (this.userPool) {
			const user = this.userPool.getCurrentUser()
			if (user) {
        // TODO global signout method
        // await this.cognitoIdentitySignOut(opts, user)
        user.signOut()
			} else {
        // for debug
        // eslint-diable-next-line
        console.log('no current Cognito user')
			}
		} else {
      // for debug
      // eslint-diable-next-line
      console.log('no Congito User pool')
    }
  }
  /**
	 * Get current authenticated user
	 * @return - A promise resolves to current authenticated CognitoUser if success
	 */
	currentUserPoolUser (params) {
		if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
		const that = this
		return new Promise((resolve, reject) => {
			const user = that.userPool.getCurrentUser()
      if (!user) {
        // for debug
        // eslint-disable-next-line
        console.log('Failed to get user from user pool')
        reject('No current user')
        return
      }

      // refresh the session if the session expired.
      user.getSession((err, session) => {
        if (err) {
          // for debug
          // eslint-disable-next-line
          console.log('Failed to get the user session', err)
          return reject(err)
        }

        // get user data from Cognito
        const bypassCache = params ? params.bypassCache : false
        // validate the token's scope fisrt before calling this function
        const { scope = '' } = session.getAccessToken().decodePayload()
        if (scope.split(' ').includes(USER_ADMIN_SCOPE)) {
          user.getUserData(
            (err, data) => {
              if (err) {
                // for debug
                // eslint-disable-next-line
                console.log('getting user data failed', err)
                // Make sure the user is still valid
                if (
                  err.message === 'User is disabled' ||
                  err.message === 'User does not exist.'
                ) {
                  reject(err)
                } else {
                  // the error may also be thrown when lack of permissions to get user info etc
                  // in that case we just bypass the error
                  resolve(user)
                }
                return
              }
              const preferredMFA = data.PreferredMfaSetting || 'NOMFA'
              const attributeList = []

              for (let i = 0; i < data.UserAttributes.length; i++) {
                const attribute = {
                  Name: data.UserAttributes[i].Name,
                  Value: data.UserAttributes[i].Value,
                }
                const userAttribute = new CognitoUserAttribute(attribute)
                attributeList.push(userAttribute)
              }

              const attributes = that.attributesToObject(attributeList)
              Object.assign(user, { attributes, preferredMFA })
              return resolve(user)
            },
            { bypassCache }
          )
        } else {
          // for debug
          // eslint-disable-next-line
          console.log(
            `Unable to get the user data because the ${USER_ADMIN_SCOPE} ` +
              `is not in the scopes of the access token`
          )
          return resolve(user)
        }
      })
		})
  }
  /**
	 * Get current user's session
	 * @return - A promise resolves to session object if success
	 */
	currentSession () {
    const that = this
    // for debug
    // eslint-disable-next-line
    console.log('Getting current session')
		// Purposely not calling the reject method here because we don't need a console error
		if (!this.userPool) {
			return Promise.reject()
		}

		return new Promise((resolve, reject) => {
			that
				.currentUserPoolUser()
				.then(user => {
					that
						.userSession(user)
						.then(session => {
							return resolve(session)
						})
						.catch(e => {
              // for debug
              // eslint-disable-next-line
              console.log('Failed to get the current session', e)
							return reject(e)
						})
				})
				.catch(e => {
          // for debug
          // eslint-disable-next-line
          console.log('Failed to get the current user', e)
					return reject(e)
				})
		})
  }
  /**
	 * Get the corresponding user session
	 * @param {Object} user - The CognitoUser object
	 * @return - A promise resolves to the session
	 */
	userSession (user) {
		if (!user) {
			// for debug
      // eslint-disable-next-line
      console.log('the user is null')
			return Promise.reject(new Error('no user session.'))
		}
		return new Promise((resolve, reject) => {
      // for debug
      // eslint-disable-next-line
      console.log('Getting the session from this user:', user)
			user.getSession((err, session) => {
				if (err) {
          // for debug
          // eslint-disable-next-line
          console.log('Failed to get the session from user', user)
					return reject(err)
				} else {
          // for debug
          // eslint-disable-next-line
          console.log('Succeed to get the user session', session)
					return resolve(session)
				}
			})
		})
  }
  attributesToObject (attributes) {
    const obj = {}
    if (attributes) {
      attributes.map(attribute => {
        if (attribute.Value === 'true') {
          obj[attribute.Name] = true
        } else if (attribute.Value === 'false') {
          obj[attribute.Name] = false
        } else {
          obj[attribute.Name] = attribute.Value
        }
      })
    }
    return obj
  }
  _cleanCachedItems () {
    this._memoryStorage.clear()
    this._storage.clear()
  }
  _createCognitoUser (username, forceMemoryStorage) {
		const userData = {
			Username: username,
			Pool: this.userPool
    }
    if (forceMemoryStorage) {
      userData.Storage = this._memoryStorage
    } else {
      userData.Storage = this._storage
    }
    userData.Storage = this._storage

		const user = new CognitoUser(userData)
		return user
	}
}
