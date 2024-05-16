// Importa gql desde @apollo/client
import { gql } from '@apollo/client';

// Usa la función gql para definir la consulta me y expórtala
export const GET_ME = gql`
  query me {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        _id
        title
        author
      }
    }
  }
`;
