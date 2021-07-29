import React, { useState, useEffect } from "react";

import "./chat.css";
import Message from "./Message";
import Users from "./Users";
import Header from "./Header";

const Chat = () => {
     const [width, setWidth] = useState(window.innerWidth);

     const windowHandler = () => {
          setWidth(window.innerWidth);
     };

     useEffect(() => {
          window.addEventListener("resize", windowHandler);

          return () => window.removeEventListener("resize", windowHandler);
     }, [width]);

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
