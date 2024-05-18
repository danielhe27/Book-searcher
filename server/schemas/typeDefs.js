const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
  _id: ID!
  username: String!
  email: String!
  bookCount: Int
  savedBooks: [Book]
}

type Book {
  _id: ID!
  title: String!
  description: String
  image: String
  authors: [String]
  link: String
  savedBy: User
}

type Auth {
  token: String!
  user: User
}

input BookInput {
  title: String!
  description: String
  image: String
  authors: [String]
  link: String
}

type Query {
  me: User
  books: [Book]
}

type Mutation {
  addUser(username: String!, email: String!, password: String!): Auth
  login(email: String!, password: String!): Auth
  saveBook(bookData: BookInput!): User
  removeBook(bookId: ID!): User
}
`;

module.exports = typeDefs;
