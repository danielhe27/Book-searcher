import { gql } from '@apollo/client';

//  LOGIN_USER mutation to authenticate a user with email and password
export const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          _id
          title
          description
          image
          authors
          link
        }
      }
    }
  }
`;

// ADD_USER mutation to create a new user with username, email, and password
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
        email
        bookCount
        savedBooks {
          _id
          title
          description
          image
          authors
          link
        }
      }
    }
  }
`;

// SAVE_BOOK mutation to save a book to a user's account
export const SAVE_BOOK = gql`
  mutation saveBook($bookData: BookInput!) {
    saveBook(bookData: $bookData) {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        title
        description
        image
        authors
        link
      }
    }
  }
`;

// REMOVE_BOOK mutation to remove a book from a user's account
export const REMOVE_BOOK = gql`
  mutation removeBook($bookId: String!) {
    removeBook(bookId: $bookId) {
      username
      email
      bookCount
      savedBooks {
        authors
        description
        bookId
        image
        link
        title
      }
    }
  }
`;
