import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Container, Card, Button, Row, Col } from 'react-bootstrap';
import { GET_ME } from '../utils/queries';
import { REMOVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

// Define the SavedBooks functional component
const SavedBooks = () => {
  // Use the useQuery hook to fetch the user's saved books data
  const { loading, data } = useQuery(GET_ME);
  // Extract the user data from the query response, with a fallback to an empty object
  const userData = data?.me || {};

  //removeBook mutation using the useMutation and  update function to modify the cache
  const [removeBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { removeBook } }) {
      try {
        // Read the current GET_ME query data from the cache
        const { me } = cache.readQuery({ query: GET_ME });

        // Write the updated data back to the cache, removing the deleted book
        cache.writeQuery({
          query: GET_ME,
          data: { me: { ...me, savedBooks: removeBook.savedBooks } },
        });
      } catch (e) {
        console.error(e);
      }
    }
  });

  // Handler for deleting a book, triggered when the delete button is clicked
  const handleDeleteBook = async (bookId) => {

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      console.error('No token found, login required.');
      return false;
    }

    try {
      // Execute the removeBook mutation with the bookId as a variable
      await removeBook({
        variables: { bookId },
      });

      // Remove the bookId from local storage
      removeBookId(bookId);
    } catch (err) {
      console.error('Error deleting book:', err);
    }
  };

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  return (
    <>
      <div fluid="true" className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userData.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userData.savedBooks.map((book) => (
            <Col md="4" key={book._id}>
              <Card border='dark'>
                {book.image ? (
                  <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                ) : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors.join(', ')}</p>
                  <Card.Text>{book.description}</Card.Text>
                  {Auth.loggedIn() && (
                    <Button
                      className='btn-block btn-danger'
                      onClick={() => handleDeleteBook(book.bookId)}
                    >
                      Delete this Book!
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
