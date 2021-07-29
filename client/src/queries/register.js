import { gql } from "@apollo/client";

export default gql`
     mutation RegisterMutation($registerRegisterDetails: registerDetails!) {
          register(RegisterDetails: $registerRegisterDetails) {
               username
               email
               createdAt
          }
     }
`;
