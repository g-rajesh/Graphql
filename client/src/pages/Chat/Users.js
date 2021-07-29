import moment from "moment";
import { useQuery } from "@apollo/client";

import { useMessageState, useMessageDispatch } from "../../context/Message";
import GET_USERS from "../../queries/getUsers";
import { SET_SELECTED_USER, SET_USERS } from "../../context/actionCreators";

const Users = ({ width }) => {
     const { users } = useMessageState();
     const dispatch = useMessageDispatch();
     const { loading } = useQuery(GET_USERS, {
          onCompleted: (data) => {
               console.log(data);
               dispatch({ type: SET_USERS, payload: data.getUsers });
          },
          onError: (err) => console.log(err),
     });

     const selectedUser = users?.find((user) => user.selected === true);

     if (!users && loading)
          return (
               <div
                    className={
                         width > 768
                              ? "users"
                              : selectedUser
                              ? "users none"
                              : "users display"
                    }
               >
                    <p>Loading...</p>
               </div>
          );
     else if (users && users.length === 0)
          return (
               <div
                    className={
                         width > 768
                              ? "users"
                              : selectedUser
                              ? "users none"
                              : "users display"
                    }
               >
                    <p>Loading...</p>
               </div>
          );
     else if (users && users.length > 0) {
          return (
               <div
                    className={
                         width > 768
                              ? "users"
                              : selectedUser
                              ? "users none"
                              : "users display"
                    }
               >
                    <h2>My Chats</h2>
                    {users.map((user) => {
                         let latestMessage = `${user.username} joined Chat Box!`;
                         if (user.latestMessage) {
                              latestMessage = user.latestMessage.content;
                         }

                         let createdTime = user.createdAt;
                         if (user.latestMessage) {
                              createdTime = user.latestMessage.createdAt;
                         }
                         return (
                              <div
                                   key={user.username}
                                   onClick={() =>
                                        dispatch({
                                             type: SET_SELECTED_USER,
                                             payload: {
                                                  username: user.username,
                                             },
                                        })
                                   }
                                   className={
                                        selectedUser?.username === user.username
                                             ? "user active"
                                             : "user"
                                   }
                              >
                                   <div className="profile">
                                        <span>
                                             {user?.username[0].toUpperCase()}
                                        </span>
                                        <div className="details">
                                             <h3>{user.username}</h3>
                                             <p>{latestMessage}</p>
                                        </div>
                                   </div>
                                   <span className="timing">
                                        {moment(createdTime).format("LT")}
                                   </span>
                              </div>
                         );
                    })}
               </div>
          );
     } else {
          console.log(users, loading);
          return (
               <div
                    className={
                         width > 768
                              ? "users"
                              : selectedUser
                              ? "users none"
                              : "users display"
                    }
               >
                    <p>Loading...</p>
               </div>
          );
     }
};

export default Users;
