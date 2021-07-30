import React, { useState, useEffect } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import { IoMdSend } from "react-icons/io";

import { useAuthState } from "../../context/auth";
import { useMessageState, useMessageDispatch } from "../../context/Message";
import GET_MESSAGES from "../../queries/getMessages";
import SEND_MESSAGE from "../../queries/sendMessage";
import { SET_USER_MESSAGES } from "../../context/actionCreators";
import SingleMessage from "./SingleMessage";

const Message = ({ width }) => {
     const [msg, setMsg] = useState("");
     const { user } = useAuthState();
     const { users } = useMessageState();
     const dispatch = useMessageDispatch();
     const [getUserMessages, { loading: messagesLoading }] = useLazyQuery(
          GET_MESSAGES,
          {
               onCompleted: (data) => {
                    dispatch({
                         type: SET_USER_MESSAGES,
                         payload: {
                              username: selectedUser?.username,
                              messages: data.getMessages,
                         },
                    });
               },
               onError: (err) => console.log(err),
          }
     );
     const [sendMessage] = useMutation(SEND_MESSAGE, {
          onError: (err) => console.log(err),
     });

     const selectedUser = users?.find((u) => u.selected === true);
     const submitHandler = (e) => {
          e.preventDefault();
          if (!msg || !selectedUser) return;
          setMsg("");
          sendMessage({
               variables: {
                    to: selectedUser.username,
                    content: msg,
               },
          });
     };

     useEffect(() => {
          if (selectedUser) {
               getUserMessages({
                    variables: { from: selectedUser.username },
               });
          }
     }, [selectedUser, getUserMessages]);

     let messages;
     if (messagesLoading && !selectedUser) messages = <p>loading...</p>;
     else if (selectedUser && selectedUser?.messages?.length === 0)
          messages = <p className="alert">Send your first message!</p>;
     else if (selectedUser?.messages?.length > 0)
          messages = selectedUser?.messages?.map((message) => {
               return (
                    <SingleMessage
                         key={message.uuid}
                         message={message}
                         user={user}
                    />
               );
          });
     else messages = <p className="alert">Select a friend to start chat</p>;

     return (
          <div
               className={
                    width > 768
                         ? "messages"
                         : selectedUser
                         ? "messages display"
                         : "messages none"
               }
          >
               <div className="message">{messages}</div>
               <form className="sendForm" onSubmit={submitHandler}>
                    <div className="formContent">
                         <input
                              type="text"
                              placeholder="Send a message..."
                              value={msg}
                              onChange={(e) => setMsg(e.target.value)}
                              autoFocus
                         />
                         <button>
                              <IoMdSend className="sendIcon" />
                         </button>
                    </div>
               </form>
          </div>
     );
};

export default Message;
