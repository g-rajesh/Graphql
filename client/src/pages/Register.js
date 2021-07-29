import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BsChatDots } from "react-icons/bs";
import { useMutation } from "@apollo/client";

import useForm from "../Util/useForm";
import RegisterMutation from "../queries/register";
import "./register-login.css";

const initialValue = {
     username: "",
     email: "",
     password: "",
     confirmPassword: "",
};

const Register = () => {
     const [errors, setErrors] = useState({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
     });

     const history = useHistory();

     const [registerUser, { loading }] = useMutation(RegisterMutation, {
          update: (_, __) => {
               setErrors({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
               });
               clearData();
               history.push("/login");
          },
          onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
     });

     const handleSubmit = () => {
          registerUser({
               variables: {
                    registerRegisterDetails: formData,
               },
          });
     };

     const { formData, changeHandler, submitHandler, clearData } = useForm(
          initialValue,
          handleSubmit
     );

     return (
          <div className="register">
               <header>
                    <div className="logo">
                         <BsChatDots className="chatIcon" />
                         <p>Chat box</p>
                    </div>

                    <Link to="/login">
                         <button title="Already having an account">
                              Sign in
                         </button>
                    </Link>
               </header>
               <form className="form" onSubmit={submitHandler}>
                    <h2>Sign up</h2>
                    <p>I'm new here</p>
                    <div className="form-group">
                         <label htmlFor="username">Username</label>
                         <input
                              type="text"
                              name="username"
                              id="username"
                              value={formData.username}
                              onChange={changeHandler}
                              className={errors.username && "error"}
                              autoFocus
                              autoComplete="off"
                         />
                         <span className={errors.username && "error"}>
                              {errors.username}
                         </span>
                    </div>
                    <div className="form-group">
                         <label htmlFor="email">Email</label>
                         <input
                              type="email"
                              name="email"
                              id="email"
                              value={formData.email}
                              onChange={changeHandler}
                              className={errors.email && "error"}
                              autoComplete="off"
                         />
                         <span className={errors.email && "error"}>
                              {errors.email}
                         </span>
                    </div>
                    <div className="form-group">
                         <label htmlFor="password">Password</label>
                         <input
                              type="password"
                              name="password"
                              id="password"
                              value={formData.password}
                              onChange={changeHandler}
                              className={errors.password && "error"}
                              autoComplete="off"
                         />
                         <span className={errors.password && "error"}>
                              {errors.password}
                         </span>
                    </div>
                    <div className="form-group">
                         <label htmlFor="confirmPassword">
                              Confirm Password
                         </label>
                         <input
                              type="password"
                              name="confirmPassword"
                              id="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={changeHandler}
                              className={errors.confirmPassword && "error"}
                              autoComplete="off"
                         />
                         <span className={errors.confirmPassword && "error"}>
                              {errors.confirmPassword}
                         </span>
                    </div>
                    <button
                         className={loading ? "formBtn disable" : "formBtn"}
                         disabled={loading}
                    >
                         {loading ? "Signing up..." : "Sign up"}
                    </button>
               </form>
          </div>
     );
};

export default Register;
