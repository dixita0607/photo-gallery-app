const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const {ApolloServer} = require('apollo-server-express');
const {typeDefs, resolvers} = require('./schema');
const {MongoClient} = require('mongodb');
const path = require('path');
const cors = require('cors');

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH_AUDIENCE,
  issuer: `https://${process.env.AUTH_DOMAIN}/`,
  algorithm: ["RS256"]
});

const configureApp = db => {
  const app = express();
  app.use(cors({origin: process.env.FRONTEND}));
  app.use('/graphql', checkJwt);
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req: {user}}) => ({db, user}),
  });
  server.applyMiddleware({app});
  app.use('/photos', express.static('photos'));
  return app;
};

const connectMongoDB = (connectionString) =>
  MongoClient.connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

connectMongoDB(process.env.MONGO_CONNECTION_STRING)
  .then(client => configureApp(client.db(process.env.MONGO_DB_NAME)))
  .then(app => app.listen(process.env.PORT || 4000, () => console.log('Server is listening')))
  .catch(error => console.error(error));
