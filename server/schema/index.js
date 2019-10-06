const {gql} = require('apollo-server-express');
const {ensureUser, savePhotoToDisk, savePhotoToDatabase} = require('../utils');

const typeDefs = gql`

  type Photo {
    _id: String!
    userId: String!
    url: String!
    uploadedAt: String!
  }
  
  type User {
    _id: String!
  }
  
  type Query {
    photosByUser(userId: String!, offset: Int, limit: Int): [Photo]!
    users(offset: Int, limit: Int): [User]!
  }
  
  type Mutation {
    uploadPhoto(photo: Upload!): Photo
  }
`;

const resolvers = {
  Query: {
    photosByUser: async (parent, {userId, offset = 0, limit = 20}, {db}) => {
      return db.collection('photos').find({userId}, {skip: offset, limit, sort: {uploadedAt: -1}}).toArray();
    },
    users: async (parent, {offset = 0, limit = 20}, {db}) => {
      return db.collection('users').find({}, {skip: offset, limit}).toArray();
    },
  },
  Mutation: {
    uploadPhoto: async (parent, {photo}, {db, user}) => {
      photo = await photo;
      await ensureUser(db, user);
      const savedToDisk = await savePhotoToDisk(photo);
      return savePhotoToDatabase(db, user, savedToDisk);
    }
  }
};

module.exports = {typeDefs, resolvers};
