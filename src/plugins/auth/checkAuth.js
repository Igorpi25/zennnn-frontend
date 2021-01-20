import { auth } from './index'
import { apolloClient } from '../apollo'
import { GET_PROFILE, GET_IS_LOGGED_IN } from '../../graphql/queries'
import { wait } from '../../utils/wait'

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
    await wait(50)
    // set isLoggedIn to cache
    apolloClient.writeQuery({
      query: GET_IS_LOGGED_IN,
      data: { isLoggedIn: loggedIn },
    })
    return true
  } catch (error) {
    return false
  }
}
