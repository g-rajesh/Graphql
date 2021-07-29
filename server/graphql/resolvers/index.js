const userReducers = require("./users");
const messageReducers = require("./messages");

module.exports = {
     User: {
          createdAt: (parent) => parent.createdAt.toISOString(),
     },
     Message: {
          createdAt: (parent) => parent.createdAt.toISOString(),
     },
     Query: {
          ...userReducers.Query,
          ...messageReducers.Query,
     },
     Mutation: {
          ...userReducers.Mutation,
          ...messageReducers.Mutation,
     },
     Subscription: {
          ...messageReducers.Subscription,
     },
};
