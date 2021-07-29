import { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { BsChatDots } from "react-icons/bs";
import { useLazyQuery } from "@apollo/client";

import { useAuthDispatch } from "../context/auth";
import useForm from "../Util/useForm";
import LoginQuery from "../queries/login";
import "./register-login.css";
import { LOGIN } from "../context/actionCreators";

const initialValue = {
     username: "",
     password: "",
};

const Login = () => {
     const [errors, setErrors] = useState({
          username: "",
          password: "",
     });
     const history = useHistory();
     const dispatch = useAuthDispatch();

     const [loginUser, { loading }] = useLazyQuery(LoginQuery, {
          onCompleted: (res) => {
               clearData();
               setErrors({
                    username: "",
                    password: "",
               });
               console.log(res);

               dispatch({ type: LOGIN, payload: res.login });
               history.push("/");
          },
          onError: (err) => setErrors(err.graphQLErrors[0].extensions.errors),
     });

     const handleSubmit = () => {
          console.log("Submitted");
          loginUser({
               variables: {
                    loginUsername: formData.username,
                    loginPassword: formData.password,
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

                    <Link to="/register">
                         <button title="Already having an account">
                              Sign up
                         </button>
                    </Link>
               </header>
               <form className="form" onSubmit={submitHandler}>
                    <h2 style={{ marginBottom: "2rem" }}>Sign in</h2>
                    <div className="form-group">
                         <label htmlFor="username">Username</label>
                         <input
                              type="text"
                              name="username"
                              id="username"
                              value={formData.username}
                              onChange={changeHandler}
                              className={errors && errors.username && "error"}
                              autoFocus
                              autoComplete="off"
                         />
                         <span className={errors && errors.username && "error"}>
                              {errors && errors.username}
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
                              className={errors && errors.password && "error"}
                              autoComplete="off"
                         />
                         <span className={errors && errors.password && "error"}>
                              {errors && errors.password}
                         </span>
                    </div>

                    <button
                         className={loading ? "formBtn disable" : "formBtn"}
                         disabled={loading}
                    >
                         {loading ? "Signing in..." : "Sign in"}
                    </button>
               </form>
          </div>
     );
};

export default Login;
