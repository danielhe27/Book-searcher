const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const cors = require('cors');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

// Enable CORS for all origins or specify specific origins
app.use(cors({
  origin: 'http://localhost:3000' // Replace with your frontend URL
}));

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => authMiddleware({ req }),
});

const startApolloServer = async () => {
  try {
    await server.start();
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
    app.use('/graphql', expressMiddleware(server, {
      context: ({ req }) => authMiddleware({ req }),
    }));

    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.join(__dirname, '../client/dist')));
      app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
      });
    } else {
      app.get('/', (req, res) => {
        res.send('API running');
      });
    }

    db.once('open', () => {
      app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
        console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
      });
    });

    db.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('Error starting Apollo Server:', error);
  }
};

startApolloServer();
