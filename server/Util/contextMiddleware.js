const jwt = require("jsonwebtoken");

module.exports = (context) => {
     let token;

     if (context.req && context.req.headers.authorization) {
          token = context.req.headers.authorization.split("Bearer ")[1];
     } else if (
          context.connection &&
          context.connection.context.authorization
     ) {
          token = context.connection.context.authorization.split("Bearer ")[1];
     }
     jwt.verify(token, process.env.JWT_TOKEN, (err, decodedToken) => {
          context.user = decodedToken;
     });

     return context;
};
