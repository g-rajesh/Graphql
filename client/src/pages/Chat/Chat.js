import React, { useState, useEffect } from "react";
import { useSubscription } from "@apollo/client";

import "./chat.css";
import Message from "./Message";
import Users from "./Users";
import Header from "./Header";
import SUBSCRIPTION from "../../queries/subscription";
import { useAuthState } from "../../context/auth";
import { useMessageDispatch } from "../../context/Message";
import { SET_SEND_MESSAGES } from "../../context/actionCreators";

const Chat = () => {
     const { user } = useAuthState();

     const [width, setWidth] = useState(window.innerWidth);
     const windowHandler = () => {
          setWidth(window.innerWidth);
     };

     useEffect(() => {
          window.addEventListener("resize", windowHandler);

          return () => window.removeEventListener("resize", windowHandler);
     }, [width]);

     const { data: subscriptionData, error: subscriptionError } =
          useSubscription(SUBSCRIPTION);
     const dispatch = useMessageDispatch();

     useEffect(() => {
          if (subscriptionError) console.log(subscriptionError);

          if (subscriptionData) {
               const message = subscriptionData.newMessage;
               const otherUser =
                    user.username === message.to ? message.from : message.to;

               dispatch({
                    type: SET_SEND_MESSAGES,
                    payload: {
                         username: otherUser,
                         message,
                    },
               });
          }
     }, [subscriptionData, subscriptionError]);

     return (
          <div className="chat">
               <Header width={width} />
               <div className="chat-box">
                    <Users width={width} />
                    <Message width={width} />
               </div>
          </div>
     );
};

export default Chat;
