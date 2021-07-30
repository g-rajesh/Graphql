const {
     UserInputError,
     AuthenticationError,
     ForbiddenError,
} = require("apollo-server-express");

const { PubSub, withFilter } = require("graphql-subscriptions");

const pubsub = new PubSub();

const { Op } = require("sequelize");
const { Message, User, Reaction } = require("../../models");

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
          reactToMessage: async (_, { uuid, content }, { user }) => {
               const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

               try {
                    if (!reactions.includes(content))
                         throw new UserInputError("Invalid Reaction");

                    user = await User.findOne({
                         where: { username: user.username },
                    });
                    if (!user) throw new AuthenticationError("User not found");

                    const message = await Message.findOne({ where: { uuid } });
                    if (!message) throw new UserInputError("Message not found");

                    if (
                         message.from !== user.username &&
                         message.to !== user.username
                    )
                         throw new ForbiddenError("Unauthorized");

                    let reaction = await Reaction.findOne({
                         where: { messageId: message.id, userId: user.id },
                    });

                    if (reaction) {
                         reaction.content = content;
                         reaction.save();
                    } else {
                         reaction = await Reaction.create({
                              content,
                              userId: user.id,
                              messageId: message.id,
                         });
                    }

                    pubsub.publish("New_Reaction", { newReaction: reaction });

                    return reaction;
               } catch (err) {}
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
          newReaction: {
               subscribe: withFilter(
                    (_, __, { user }) => {
                         if (!user)
                              throw new AuthenticationError("Unauthentcated");
                         return pubsub.asyncIterator(["New_Reaction"]);
                    },
                    async ({ newReaction }, _, { user }) => {
                         const message = await newReaction.getMessage();
                         if (
                              user.username === message.from ||
                              user.username === message.to
                         ) {
                              return true;
                         }
                         return false;
                    }
               ),
          },
     },
};
