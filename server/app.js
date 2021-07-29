const { createServer } = require("http");
const { execute, subscribe } = require("graphql");
const { SubscriptionServer } = require("subscriptions-transport-ws");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const jwt = require("jsonwebtoken");

const { sequelize } = require("./models/index");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const contextMiddleware = require("./Util/contextMiddleware");
const { PORT, JWT_TOKEN } = require("./config/env.json");

(async function () {
     const app = express();

     const httpServer = createServer(app);

     const schema = makeExecutableSchema({
          typeDefs,
          resolvers,
     });

     const server = new ApolloServer({
          schema,
          context: (context) => {
               let token;

               if (context.req && context.req.headers.authorization) {
                    token =
                         context.req.headers.authorization.split("Bearer ")[1];
               }

               if (token) {
                    jwt.verify(token, JWT_TOKEN, (err, decodedToken) => {
                         context.user = decodedToken;
                    });
               }

               return context;
          },
     });
     await server.start();
     server.applyMiddleware({ app });

     SubscriptionServer.create(
          {
               schema,
               execute,
               subscribe,

               async onConnect(connectionParams) {
                    let token, user;
                    if (connectionParams.Authorization) {
                         token =
                              connectionParams.Authorization.split(
                                   "Bearer "
                              )[1];
                    }
                    if (token) {
                         jwt.verify(token, JWT_TOKEN, (err, decodedToken) => {
                              user = decodedToken;
                         });
                    }
                    return { user };
               },
          },
          { server: httpServer, path: server.graphqlPath }
     );

     httpServer.listen(PORT, () => {
          console.log(
               `Server is now running on http://localhost:${PORT}/graphql`
          );
          sequelize
               .authenticate()
               .then(() => {
                    console.log("Connected to database");
               })
               .catch((e) => console.log(e));
     });
})();
