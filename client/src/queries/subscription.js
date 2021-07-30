import { gql } from "@apollo/client";

export default gql`
     subscription newMessage {
          newMessage {
               uuid
               content
               from
               to
               createdAt
          }
     }
`;
