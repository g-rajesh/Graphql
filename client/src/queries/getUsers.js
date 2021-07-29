import { gql } from "@apollo/client";

export default gql`
     query getUsers {
          getUsers {
               id
               username
               latestMessage {
                    uuid
                    from
                    to
                    content
                    createdAt
               }
               createdAt
          }
     }
`;
