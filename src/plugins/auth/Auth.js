import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from 'amazon-cognito-identity-js'
import StorageHelper from './StorageHelper'
import Logger from '../logger/Logger'

const USER_ADMIN_SCOPE = 'aws.cognito.signin.user.admin'
const logger = new Logger('Auth')

export default class Auth {
  constructor (config = {}) {
    const region = config.region || process.env.VUE_APP_AWS_COGNITO_REGION
    const userPoolId = config.userPoolId || process.env.VUE_APP_AWS_COGNITO_USER_POOL_ID
    const userPoolWebClientId = config.userPoolWebClientId || process.env.VUE_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID
    this._config = {
      region,
      userPoolId,
      userPoolWebClientId,
    }
    this._memoryStorage = new StorageHelper(true).getStorage()
    this._storage = new StorageHelper().getStorage()
    const userPoolData = {
      UserPoolId: userPoolId,
      ClientId: userPoolWebClientId,
    }
    this.userPool = new CognitoUserPool(userPoolData)
    this.user = null
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
      authenticationData,
    )
    // use memory storage for login
    const cognitoUser = this._createCognitoUser(username, true)
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          // set keys from memory storage to local storage
          for (const [k, v] of this._memoryStorage.storageItemsMap()) {
            this._storage.setItem(k, v)
          }
          // clear memory storage
          this._memoryStorage.clear()
          // recreate user with local storage
          this._createCognitoUser(username)
          resolve(result)
        },
        onFailure: (err) => {
          reject(err)
        },
        newPasswordRequired: (userAttributes, requiredAttributes) => {
          logger.debug('signIn new password')
          // User was signed up by an admin and must provide new
          // password and required attributes, if any, to complete
          // authentication.

          // store userAttributes on global variable
          cognitoUser.challengeName = 'NEW_PASSWORD_REQUIRED'
          cognitoUser.challengeParam = {
            userAttributes,
            requiredAttributes,
          }
          this.user = cognitoUser
          resolve(cognitoUser)
        },
      })
    })
  }

  completeNewPassword (user, password, requiredAttributes) {
    if (!password) { return Promise.reject(new Error('Password cannot be empty')) }

    const that = this
    return new Promise((resolve, reject) => {
      user.completeNewPasswordChallenge(password, requiredAttributes, {
        onSuccess: () => {
          logger.debug('completeNewPassword success')
          that.user = user
          resolve(user)
        },
        onFailure: (err) => {
          logger.debug('completeNewPassword failure', err)
          reject(err)
        },
      })
    })
  }

  signUp ({ username, password, attributes }) {
    if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
    if (!username || !password) {
      return Promise.reject(new Error('Username or password not defined.'))
    }
    const attrs = []
    Object.keys(attributes).map(key => {
      const attr = { Name: key, Value: attributes[key] }
      attrs.push(attr)
    })
    return new Promise((resolve, reject) => {
      this.userPool.signUp(username, password, attrs, null, (err, data) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })
  }

  resendSignUp (username) {
    if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
    if (!username) {
      return Promise.reject(new Error('Username cannot be empty.'))
    }
    const cognitoUser = this._createCognitoUser(username)
    return new Promise((resolve, reject) => {
      cognitoUser.resendConfirmationCode((err, data) => {
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
      return Promise.reject(new Error('Username cannot be empty.'))
    }
    const cognitoUser = this._createCognitoUser(username)
    return new Promise((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          resolve(data)
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }

  forgotPasswordSubmit (username, code, password) {
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
          resolve()
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }

  async signOut (opts) { // eslint-disable-line
    this._cleanCachedItems()
    if (this.userPool) {
      const user = this.userPool.getCurrentUser()
      if (user) {
        // TODO global signout method
        // await this.cognitoIdentitySignOut(opts, user)
        user.signOut()
      } else {
        logger.debug('no current Cognito user')
      }
    } else {
      logger.debug('no Congito User pool')
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
        logger.debug('Failed to get user from user pool')
        return reject(new Error('No current user'))
      }

      // refresh the session if the session expired.
      user.getSession((err, session) => {
        if (err) {
          logger.debug('Failed to get the user session', err)
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
                logger.debug('getting user data failed', err)
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
            { bypassCache },
          )
        } else {
          logger.debug(
            `Unable to get the user data because the ${USER_ADMIN_SCOPE} ` +
              'is not in the scopes of the access token',
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
    logger.debug('Getting current session')
    // Purposely not calling the reject method here because we don't need a console error
    if (!this.userPool) {
      return Promise.reject() // eslint-disable-line
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
              logger.debug('Failed to get the current session', e)
              return reject(e)
            })
        })
        .catch(e => {
          logger.debug('Failed to get the current user', e)
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
      logger.debug('the user is null')
      return Promise.reject(new Error('no user session.'))
    }
    return new Promise((resolve, reject) => {
      logger.debug('Getting the session from this user:', user)
      user.getSession((err, session) => {
        if (err) {
          logger.debug('Failed to get the session from user', user)
          return reject(err)
        } else {
          logger.log('Succeed to get the user session', session)
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
      Pool: this.userPool,
    }
    if (forceMemoryStorage) {
      userData.Storage = this._memoryStorage
    } else {
      userData.Storage = this._storage
    }

    const user = new CognitoUser(userData)
    return user
  }
}
