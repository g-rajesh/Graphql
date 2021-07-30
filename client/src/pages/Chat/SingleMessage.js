import { BiSmile } from "react-icons/bi";

const SingleMessage = ({ message, user }) => {
     const reactions = ["❤️", "😆", "😯", "😢", "😡", "👍", "👎"];

     return (
          <div
               key={message.uuid}
               className={
                    message.from === user.username ? "user right" : "user left"
               }
          >
               <p>{message.content}</p>
          </div>
     );
};

export default SingleMessage;
