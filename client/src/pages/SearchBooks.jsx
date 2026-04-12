import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { Container, Col, Form, Button, Card, Row, Alert } from 'react-bootstrap';
import { SAVE_BOOK } from '../utils/mutations';
import Auth from '../utils/auth';
import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

const SearchBooks = () => {
  const [searchedBooks, setSearchedBooks] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const [saveBook] = useMutation(SAVE_BOOK);

  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  }, [savedBookIds]);

  const fallbackBooks = [
    {
      bookId: 'demo-1',
      authors: ['Marcus Aurelius'],
      title: 'Meditations',
      description: 'Demo fallback result while Google Books API is unavailable.',
      image: '',
      link: 'https://example.com/meditations',
    },
    {
      bookId: 'demo-2',
      authors: ['Frank Herbert'],
      title: 'Dune',
      description: 'Demo fallback result while the external API is rate-limited.',
      image: '',
      link: 'https://example.com/dune',
    },
    {
      bookId: 'demo-3',
      authors: ['James Clear'],
      title: 'Atomic Habits',
      description: 'Demo fallback result for testing the UI and save flow.',
      image: '',
      link: 'https://example.com/atomic-habits',
    },
  ];

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput.trim() || isSearching) {
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const response = await searchGoogleBooks(searchInput);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message ||
            'Google Books API is temporarily unavailable.'
        );
      }

      const items = data.items || [];

      if (!items.length) {
        setSearchedBooks([]);
        setSearchError('No books found for that search.');
        return;
      }

      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title || 'Untitled',
        description: book.volumeInfo.description || 'No description available.',
        image: book.volumeInfo.imageLinks?.thumbnail || '',
        link: book.volumeInfo.infoLink || '',
      }));

      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error('Search error:', err);
      setSearchError('Using demo book results because Google Books is unavailable right now.');
      setSearchedBooks(fallbackBooks);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSaveBook = async (bookId) => {
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      await saveBook({
        variables: { bookData: bookToSave },
      });

      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                <Form.Control
                  name="searchInput"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type="text"
                  size="lg"
                  placeholder="Search for a book"
                />
              </Col>
              <Col xs={12} md={4}>
                <Button type="submit" variant="success" size="lg" disabled={isSearching}>
                  {isSearching ? 'Searching...' : 'Submit Search'}
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      <Container>
        {searchError ? (
          <Alert variant="warning" className="mt-4">
            {searchError}
          </Alert>
        ) : null}

        <h2 className="pt-5">
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>

        <Row>
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId} className="mb-4">
                <Card border="dark" className="h-100">
                  {book.image ? (
                    <Card.Img
                      src={book.image}
                      alt={`The cover for ${book.title}`}
                      variant="top"
                    />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className="small">Authors: {book.authors.join(', ')}</p>
                    <Card.Text>{book.description}</Card.Text>

                    {book.link ? (
                      <Card.Text>
                        <a href={book.link} target="_blank" rel="noreferrer">
                          View Book
                        </a>
                      </Card.Text>
                    ) : null}

                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )}
                        className="btn-block btn-info"
                        onClick={() => handleSaveBook(book.bookId)}
                      >
                        {savedBookIds?.some(
                          (savedBookId) => savedBookId === book.bookId
                        )
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks;