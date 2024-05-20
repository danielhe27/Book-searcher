const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

// Define the resolvers for handling GraphQL queries and mutations
const resolvers = {
  Query: {
    // Resolver for the 'me' query to fetch the current user's data
    me: async (parent, args, context) => {
      if (context.user) {
        // Find the user by their ID, excluding version and password fields
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }

      throw new AuthenticationError('Not logged in');
    }
  },
  Mutation: {
    // Resolver for the 'addUser' mutation to register a new user
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    // Resolver for the 'login' mutation to authenticate a user
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);
      return { token, user };
    },
    // Resolver for the 'saveBook' mutation to save a book to the user's list
    saveBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: bookData } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
    // Resolver for the 'removeBook' mutation to remove a book from the user's list
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  },
};


module.exports = resolvers;