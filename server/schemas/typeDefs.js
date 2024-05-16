const typeDefs = `#graphql

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
  token: ID!
  user: User
}

type Query {
  users: [User]
  user(username: String!): User
  books: [Book]
  book(bookId: ID!): Book
  me: User
}

type Mutation {
  login(email: String!, password: String!): Auth
  addUser(username: String!, email: String!, password: String!): Auth
  saveBook(bookData: BookInput): User
  removeBook(bookId: ID!): User
}

`