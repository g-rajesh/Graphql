const {
     UserInputError,
     AuthenticationError,
} = require("apollo-server-express");

const { PubSub, withFilter } = require("graphql-subscriptions");

const pubsub = new PubSub();

const { Op } = require("sequelize");
const { Message, User } = require("../../models");

module.exports = {
     Query: {
          getMessages: async (_, { from }, { user }) => {
               try {
                    if (!user)
                         throw new AuthenticationError("User unathenticated");

                    const recipient = await User.findOne({
                         where: { username: from },
                    });
                    if (!recipient) throw new UserInputError("User not found");

                    const users = [user.username, from];

                    const messages = await Message.findAll({
                         where: {
                              from: { [Op.in]: users },
                              to: { [Op.in]: users },
                         },
                         order: [["createdAt", "DESC"]],
                    });

                    return messages;
               } catch (err) {
                    console.log(err);
                    throw err;
               }
          },
     },
     Mutation: {
          sendMessage: async (_, args, { user }) => {
               try {
                    const { content, to } = args;
                    if (content.trim() === "")
                         throw new UserInputError("Message is empty");

                    const recipient = await User.findOne({
                         where: { username: to },
                    });

                    if (!recipient) throw new UserInputError("User not found");
                    else if (recipient.username === user.username)
                         throw new UserInputError("Can't message yourself");

                    const message = await Message.create({
                         from: user.username,
                         to,
                         content,
                    });

                    pubsub.publish("New_Message", { newMessage: message });

                    return message;
               } catch (err) {
                    console.log(err);
                    throw err;
               }
          },
     },
     Subscription: {
          newMessage: {
               subscribe: withFilter(
                    (_, __, { user }) => {
                         if (!user)
                              throw new AuthenticationError("Unauthentcated");
                         return pubsub.asyncIterator(["New_Message"]);
                    },
                    ({ newMessage }, _, { user }) => {
                         if (
                              user.username === newMessage.from ||
                              user.username === newMessage.to
                         ) {
                              return true;
                         }
                         return false;
                    }
               ),
          },
     },
};
