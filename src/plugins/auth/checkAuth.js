import { auth } from './index'
import { apolloClient } from '../apollo'
import { GET_PROFILE } from '../../graphql/queries'
import { delay } from '../../util/helpers'

/**
 * Check auth of current user
 * @return {boolean} - logged in
 */
export const checkAuth = async () => {
  try {
    const session = await auth.currentSession()
    // console.log('CHECK AUTH', session)
    // console.log('CHECK AUTH')
    // const loggedIn = !!session
    const loggedIn = !!session.getIdToken().getJwtToken()
    if (loggedIn) {
      // check profile
      await apolloClient.query({
        query: GET_PROFILE,
        fetchPolicy: 'cache-first',
      })
    }
    // TODO: wihtout delay, in first check data not writen in cache
    await delay(50)
    // set isLoggedIn to cache
    apolloClient.cache.writeData({ data: { isLoggedIn: loggedIn } })
    return true
  } catch (error) {
    return false
  }
}
