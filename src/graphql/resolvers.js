const resolvers = {
  Mutation: {
    setIsLoggedIn: (_, { isLoggedIn }, { cache }) => {
      const data = {
        isLoggedIn,
      }
      cache.writeData({ data })
      return isLoggedIn
    },
    setLoggedInUser: (_, { user }, { cache }) => {
      const isLoggedIn = !!user
      user.__typename = 'LoggedInUser'
      const data = {
        isLoggedIn,
        loggedInUser: user,
      }
      cache.writeData({ data })
      return isLoggedIn
    },
  },
}

export default resolvers
