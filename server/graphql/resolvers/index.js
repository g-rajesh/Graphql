const { Message, User } = require("../../models");

const userReducers = require("./users");
const messageReducers = require("./messages");

module.exports = {
     User: {
          createdAt: (parent) => parent.createdAt.toISOString(),
     },
     Message: {
          createdAt: (parent) => parent.createdAt.toISOString(),
     },
     Reaction: {
          createdAt: (parent) => parent.createdAt.toISOString(),
          message: async (parent) => await Message.findByPk(parent.messageId),
          user: async (parent) =>
               await User.findByPk(parent.userId, {
                    attributes: ["username", "createdAt"],
               }),
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
