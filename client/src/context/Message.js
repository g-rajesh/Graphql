import React, { createContext, useReducer, useContext } from "react";

import {
     SET_USERS,
     SET_SELECTED_USER,
     SET_USER_MESSAGES,
     SET_SEND_MESSAGES,
     REMOVE_SELECTED_USER,
} from "./actionCreators";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state, action) => {
     let newUsers;
     switch (action.type) {
          case SET_USERS:
               return {
                    ...state,
                    users: action.payload,
               };

          case SET_SELECTED_USER:
               newUsers = state.users.map((user) => {
                    if (user.username === action.payload.username)
                         return { ...user, selected: true };
                    return { ...user, selected: false };
               });

               return {
                    ...state,
                    users: newUsers,
               };

          case REMOVE_SELECTED_USER:
               newUsers = state.users.map((user) => {
                    return { ...user, selected: false };
               });

               return {
                    ...state,
                    users: newUsers,
               };

          case SET_USER_MESSAGES:
               newUsers = state.users.map((user) => {
                    if (user.username === action.payload.username)
                         return { ...user, messages: action.payload.messages };
                    return user;
               });

               return {
                    ...state,
                    users: newUsers,
               };

          case SET_SEND_MESSAGES:
               newUsers = state.users.map((user) => {
                    if (user.username === action.payload.username)
                         return {
                              ...user,
                              messages: [
                                   action.payload.message,
                                   ...user.messages,
                              ],
                         };
                    return user;
               });

               return {
                    ...state,
                    users: newUsers,
               };

          default:
               throw new Error(`Unknown action type: ${action.type}`);
     }
};

export const MessageProvider = ({ children }) => {
     const [state, dispatch] = useReducer(messageReducer, { users: null });

     return (
          <MessageDispatchContext.Provider value={dispatch}>
               <MessageStateContext.Provider value={state}>
                    {children}
               </MessageStateContext.Provider>
          </MessageDispatchContext.Provider>
     );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
