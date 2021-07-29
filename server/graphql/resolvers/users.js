const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const {
     UserInputError,
     AuthenticationError,
} = require("apollo-server-express");

const { Message, User } = require("../../models");
const { JWT_TOKEN } = require("../../config/env.json");

module.exports = {
     Query: {
          getUsers: async (_, __, { user }) => {
               try {
                    if (!user)
                         throw new AuthenticationError("User unathenticated");

                    let users = await User.findAll({
                         attributes: ["id", "username", "createdAt"],
                         where: { username: { [Op.ne]: user.username } },
                    });

                    const messages = await Message.findAll({
                         where: {
                              [Op.or]: [
                                   { from: user.username },
                                   { to: user.username },
                              ],
                         },
                         order: [["createdAt", "DESC"]],
                    });

                    users = users.map((otherUser) => {
                         const latestMessage = messages.find(
                              (msg) =>
                                   msg.from === otherUser.username ||
                                   msg.to === otherUser.username
                         );
                         otherUser.latestMessage = latestMessage;
                         return otherUser;
                    });

                    return users;
               } catch (err) {
                    throw err;
               }
          },

          login: async (_, args) => {
               let { username, password } = args;
               let errors = {};

               try {
                    // validate input
                    if (username.trim() === "")
                         errors.username = "username must not be empty";
                    if (password.trim() === "")
                         errors.password = "password must not be empty";

                    if (Object.keys(errors).length > 0)
                         throw new UserInputError("Bad Input", { errors });

                    // check username exist
                    const user = await User.findOne({ where: { username } });

                    if (!user) {
                         errors.username = "username not found";
                         throw new UserInputError("user not available", {
                              errors,
                         });
                    }

                    const correctPassword = await bcrypt.compare(
                         password,
                         user.password
                    );
                    if (!correctPassword) {
                         errors.password = "Invalid password";
                         throw new UserInputError("invalid password", {
                              errors,
                         });
                    }

                    const token = jwt.sign(
                         {
                              username,
                         },
                         JWT_TOKEN,
                         { expiresIn: "1h" }
                    );

                    return {
                         ...user.toJSON(),
                         token,
                    };
               } catch (err) {
                    console.log(err);
                    throw err;
               }
          },
     },
     Mutation: {
          register: async (_, args) => {
               console.log(args);
               let { username, email, password, confirmPassword } =
                    args.RegisterDetails;
               let errors = {};
               try {
                    // validate input
                    if (username.trim() == "")
                         errors.username = "username must not be empty";
                    if (email.trim() == "")
                         errors.email = "email must not be empty";
                    if (password.trim() == "")
                         errors.password = "password must not be empty";
                    if (confirmPassword.trim() == "")
                         errors.confirmPassword =
                              "confirm password must not be empty";
                    if (password !== confirmPassword)
                         errors.confirmPassword = "passwords must match";

                    if (Object.keys(errors).length > 0) {
                         throw errors;
                    }

                    // hash password
                    password = await bcrypt.hash(password, 12);

                    // create user{
                    const user = await User.create({
                         username,
                         email,
                         password,
                    });

                    // return user
                    return user;
               } catch (err) {
                    console.log(err);
                    if (err.name === "SequelizeUniqueConstraintError") {
                         err.errors.forEach((e) => {
                              let path = e.path.split(".")[1];
                              errors[path] = `${path} is already taken`;
                         });
                    }
                    if (err.name === "SequelizeValidationError") {
                         err.errors.forEach((e) => {
                              errors[e.path] = e.message;
                         });
                    }
                    throw new UserInputError("Bad input", { errors });
               }
          },
     },
};
