const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  AuthenticationError: new GraphQLError('You are not authorized to perform this action', {
    extensions: { code: 'UNAUTHENTICATED' ,
  },
}),

authMiddleware: function ({ req }) {
  let token = req.body.token || req.query.token || req.headers. authorization;

  if (req.headers.authorization) {
    token = token.split(' ').pop().trim();
  }

  if (!token) {
    return req;
  }

  try {
    const { data } = jwt.verify(token, secret, {
      maxAge: expiration,
    });
  } catch {
    console.log('Invalid token');
  }
  return req;
},
signToken: function ({ email, username, _id }) {
  const payload = { email, username, _id };
  return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
},
};
