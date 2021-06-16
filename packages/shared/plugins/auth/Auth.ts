import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUserSession,
} from 'amazon-cognito-identity-js'
import StorageHelper from './StorageHelper'
import Logger from '../logger'

import type {
  ICookieStorageData,
  ICognitoStorage,
  ICognitoUserPoolData,
  ICognitoUserData,
} from 'amazon-cognito-identity-js'

/**
 * Auth instance options
 */
export interface AuthOptions {
  userPoolId?: string
  userPoolWebClientId?: string
  identityPoolId?: string
  region?: string
  mandatorySignIn?: boolean
  cookieStorage?: ICookieStorageData
  oauth?: OAuthOpts
  refreshHandlers?: object
  storage?: ICognitoStorage
  authenticationFlowType?: string
  identityPoolRegion?: string
  clientMetadata?: any
  endpoint?: string
}

export type OAuthOpts = AwsCognitoOAuthOpts | Auth0OAuthOpts

export interface AwsCognitoOAuthOpts {
  domain: string
  scope: Array<string>
  redirectSignIn: string
  redirectSignOut: string
  responseType: string
  options?: object
  urlOpener?: (url: string, redirectUrl: string) => Promise<any>
}

export interface Auth0OAuthOpts {
  domain: string
  clientID: string
  scope: string
  redirectUri: string
  audience: string
  responseType: string
  returnTo: string
  urlOpener?: (url: string, redirectUrl: string) => Promise<any>
}

const USER_ADMIN_SCOPE = 'aws.cognito.signin.user.admin'
const logger = new Logger('Auth')

export default class Auth {
  private _config: AuthOptions
  private userPool: CognitoUserPool
  private user: any = null
  private _storage
  _memoryStorage: any

  constructor(config = {} as AuthOptions) {
    const region = config.region
    const userPoolId = config.userPoolId
    const userPoolWebClientId = config.userPoolWebClientId
    this._config = {
      region,
      userPoolId,
      userPoolWebClientId,
    }
    this._memoryStorage = new StorageHelper(true).getStorage()
    this._storage = new StorageHelper().getStorage()
    const userPoolData: ICognitoUserPoolData = {
      UserPoolId: userPoolId!,
      ClientId: userPoolWebClientId!,
      endpoint: config.endpoint,
    }
    this.userPool = new CognitoUserPool(userPoolData)
    this.user = null
  }

  public signIn(username: string, password?: string) {
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
    const authenticationDetails = new AuthenticationDetails(authenticationData)
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
          // @ts-ignore
          cognitoUser['challengeName'] = 'NEW_PASSWORD_REQUIRED'
          // @ts-ignore
          cognitoUser['challengeParam'] = {
            userAttributes,
            requiredAttributes,
          }
          this.user = cognitoUser
          resolve(cognitoUser)
        },
      })
    })
  }

  public completeNewPassword(
    user: CognitoUser | any,
    password: string,
    requiredAttributes: any = {}
  ) {
    if (!password) {
      return Promise.reject(new Error('Password cannot be empty'))
    }

    const that = this // eslint-disable-line @typescript-eslint/no-this-alias
    return new Promise((resolve, reject) => {
      user.completeNewPasswordChallenge(password, requiredAttributes, {
        onSuccess: () => {
          logger.debug('completeNewPassword success')
          that.user = user
          resolve(user)
        },
        onFailure: (err: any) => {
          logger.debug('completeNewPassword failure', err)
          reject(err)
        },
      })
    })
  }

  public resendSignUp(username: string) {
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

  public forgotPassword(username: string) {
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

  public forgotPasswordSubmit(
    username: string,
    code: string,
    password: string
  ) {
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
          resolve(true)
        },
        onFailure: (err) => {
          reject(err)
        },
      })
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async signOut(opts: { global?: boolean }) {
    // eslint-disable-line
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
  public currentUserPoolUser(params?: { bypassCache: boolean }) {
    if (!this.userPool) {
      return Promise.reject(new Error('No user pool.'))
    }
    const that = this // eslint-disable-line @typescript-eslint/no-this-alias
    return new Promise((resolve, reject) => {
      const user = that.userPool.getCurrentUser()
      if (!user) {
        logger.debug('Failed to get user from user pool')
        return reject(new Error('No current user'))
      }

      // refresh the session if the session expired.
      user.getSession((err: any, session: CognitoUserSession) => {
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
              const preferredMFA = data?.PreferredMfaSetting || 'NOMFA'
              const attributeList = []

              if (data && data.UserAttributes) {
                for (let i = 0; i < data.UserAttributes.length; i++) {
                  const attribute = {
                    Name: data.UserAttributes[i].Name,
                    Value: data.UserAttributes[i].Value,
                  }
                  const userAttribute = new CognitoUserAttribute(attribute)
                  attributeList.push(userAttribute)
                }
              }

              const attributes = that.attributesToObject(attributeList)
              Object.assign(user, { attributes, preferredMFA })
              return resolve(user)
            },
            { bypassCache }
          )
        } else {
          logger.debug(
            `Unable to get the user data because the ${USER_ADMIN_SCOPE} ` +
              'is not in the scopes of the access token'
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
  public currentSession(): Promise<CognitoUserSession> {
    const that = this // eslint-disable-line @typescript-eslint/no-this-alias
    logger.debug('Getting current session')
    // Purposely not calling the reject method here because we don't need a console error
    if (!this.userPool) {
      return Promise.reject() // eslint-disable-line
    }

    return new Promise((resolve, reject) => {
      that
        .currentUserPoolUser()
        .then((user) => {
          that
            .userSession(user as CognitoUser)
            .then((session) => {
              return resolve(session as CognitoUserSession)
            })
            .catch((e) => {
              logger.debug('Failed to get the current session', e)
              return reject(e)
            })
        })
        .catch((e) => {
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
  public userSession(user: CognitoUser) {
    if (!user) {
      logger.debug('the user is null')
      return Promise.reject(new Error('no user session.'))
    }
    return new Promise((resolve, reject) => {
      logger.debug('Getting the session from this user:', user)
      user.getSession((err: any, session: CognitoUserSession) => {
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

  attributesToObject(attributes: CognitoUserAttribute[]) {
    const obj = {} as Record<string, any>
    if (attributes) {
      attributes.forEach((attribute) => {
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

  _cleanCachedItems() {
    this._memoryStorage.clear()
    this._storage.clear()
  }

  private _createCognitoUser(username: string, forceMemoryStorage = false) {
    const userData: ICognitoUserData = {
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
