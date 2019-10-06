const {gql} = require('apollo-server-express');
const {savePhotoToDisk, savePhotoToDatabase} = require('../utils');

const typeDefs = gql`

  type Photo {
    _id: String!
    userId: String!
    url: String!
    uploadedAt: String!
  }
  
  input UserInfo {
    email: String!
    name: String!
    nickname: String!
    picture: String!
  }
  
  type User {
    _id: String!
    email: String!
    name: String!
    nickname: String!
    picture: String!
  }
  
  type Query {
    photosByUser(userId: String!, offset: Int, limit: Int): [Photo!]!
    users(offset: Int, limit: Int): [User!]!
  }
  
  type Mutation {
    uploadPhoto(photo: Upload!): Photo!
    ensureUser(userInfo: UserInfo!): User!
  }
`;

const resolvers = {
  Query: {
    photosByUser: async (parent, {userId, offset = 0, limit = 20}, {db}) => {
      return db.collection('photos').find({userId}, {skip: offset, limit, sort: {uploadedAt: -1}}).toArray();
    },
    users: async (parent, {offset = 0, limit = 20}, {db, user: {sub}}) => {
      return db.collection('users').find({_id: {$ne: sub}}, {skip: offset, limit}).toArray();
    },
  },
  Mutation: {
    uploadPhoto: async (parent, {photo}, {db, user}) => {
      photo = await photo;
      const existingUser = await db.collection('users').findOne({_id: user.sub});
      if (!existingUser) throw Error('User does not exist.');
      const savedToDisk = await savePhotoToDisk(photo);
      return savePhotoToDatabase(db, user, savedToDisk);
    },
    ensureUser: async (parent, {userInfo: {email, name, nickname, picture}}, {db, user: {sub}}) => {
      const users = db.collection('users');
      const existingUser = await users.findOne({_id: sub});
      if (existingUser) return existingUser;
      const user = {_id: sub, email, name, nickname, picture};
      const {insertedCount} = await users.insertOne(user);
      if (insertedCount !== 1) throw Error('Could not insert user');
      return user;
    }
  }
};

module.exports = {typeDefs, resolvers};
