// Importa gql desde @apollo/client
import { gql } from '@apollo/client';

//  GET_ME query to fetch the current user's data
export const GET_ME = gql`
  {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
