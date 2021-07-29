import { gql } from "@apollo/client";

export default gql`
     query getMessages($from: String!) {
          getMessages(from: $from) {
               content
               createdAt
               from
               to
               uuid
          }
     }
`;
