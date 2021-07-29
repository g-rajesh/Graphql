import React from "react";
import { BsChatDots } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

import { useAuthState, useAuthDispatch } from "../../context/auth";
import { useMessageState, useMessageDispatch } from "../../context/Message";
import { LOGOUT, REMOVE_SELECTED_USER } from "../../context/actionCreators";

const Header = ({ width }) => {
     const { user } = useAuthState();
     const dispatch = useAuthDispatch();
     const dispatchUserMsg = useMessageDispatch();
     const { users } = useMessageState();

     const selectedUser = users?.find((user) => user.selected === true);

     const logoutHandler = () => {
          dispatch({ type: LOGOUT });
          window.location.href = "/login";
     };

     let header = (
          <header>
               <div className="logo">
                    <BsChatDots className="chatIcon" />
                    <p>Chat box</p>
               </div>
               <div className="details">
                    <p>{user.username}</p>
                    <button title="logout" onClick={logoutHandler}>
                         <FiLogOut className="logoutIcon" />
                    </button>
               </div>
          </header>
     );

     if (selectedUser && width <= 768) {
          header = (
               <header className="user">
                    <FaArrowLeft
                         className="leftIcon"
                         onClick={() =>
                              dispatchUserMsg({
                                   type: REMOVE_SELECTED_USER,
                              })
                         }
                    />
                    <div className="profile-details">
                         <h3>{selectedUser.username}</h3>
                         <span>Active</span>
                    </div>
               </header>
          );
     }

     return header;
};

export default Header;
