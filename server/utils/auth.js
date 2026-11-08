const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// Set token secret and expiration date
// Set JWT_SECRET in server/.env (see .env.example)
const secret = process.env.JWT_SECRET;
if (!secret) throw new Error('JWT_SECRET is not set');
const expiration = '2h';

module.exports = {
  // Authentication middleware
  authMiddleware: function ({ req }) {
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
      return req;
    }

    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }

    return req;
  },

  signToken: function ({ email, username, _id }) {
    const payload = { email, username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // Apollo Server 4 replaced AuthenticationError with GraphQLError + an UNAUTHENTICATED code.
  AuthenticationError: (message = 'You are not authorized to perform this action') =>
    new GraphQLError(message, { extensions: { code: 'UNAUTHENTICATED' } }),
};
