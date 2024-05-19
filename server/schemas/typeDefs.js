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
    bookId: String!
    title: String!
    description: String
    image: String
    authors: [String]
    link: String
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    authors: [String]
        description: String
        bookId: String
        image: String
        forSale: String
        link: String
        title: String
  }

  type Query {
    me: User
    books: [Book]
  }

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: String!): User
  }
`;

module.exports = typeDefs;
