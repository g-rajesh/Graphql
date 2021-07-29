import { gql } from "@apollo/client";

export default gql`
     query Query($loginUsername: String!, $loginPassword: String!) {
          login(username: $loginUsername, password: $loginPassword) {
               username
               email
               createdAt
               token
          }
     }
`;
