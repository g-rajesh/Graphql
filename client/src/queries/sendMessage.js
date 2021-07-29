import { gql } from "@apollo/client";

export default gql`
     mutation sendMessage ($to: String!, $content: String!){
          sendMessage(to: $to, content: $content) {
               content
               uuid
               createdAt
               from
               to
          }
     }
`;
