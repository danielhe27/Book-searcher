// route to get logged in user's info (needs the token)
export const getMe = (token) => {
  return fetch('/api/users/me', {
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
  });
};

// route to create a new user
export const createUser = (userData) => {
  return fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// route to login a user
export const loginUser = (userData) => {
  return fetch('/api/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
};

// save book data for a logged in user
export const saveBook = (bookData, token) => {
  return fetch('/api/users', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(bookData),
  });
};

// remove saved book data for a logged in user
export const deleteBook = (bookId, token) => {
  return fetch(`/api/users/books/${bookId}`, {
    method: 'DELETE',
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
};

// make a search to google books api
// https://www.googleapis.com/books/v1/volumes?q=harry+potter
export const searchGoogleBooks = (query) => {
  const encodedQuery = encodeURIComponent(query.trim());
  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;

  console.log('API KEY PRESENT?', !!apiKey);
  console.log('API KEY VALUE:', apiKey);

  const baseUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodedQuery}&maxResults=12`;
  const url = apiKey ? `${baseUrl}&key=${apiKey}` : baseUrl;

  console.log('REQUEST URL:', url);

  return fetch(url);
};
