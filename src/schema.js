import gql from 'graphql-tag';

export const typeDefs = gql`
  input ProductInput {
    name: String,
    count: Int,
    price: Float
  }
`;
