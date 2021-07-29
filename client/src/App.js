import { BrowserRouter as Router, Switch } from "react-router-dom";

import "./App.css";
import Chat from "./pages/Chat/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DynamicRoute from "./Util/DynamicRoute";

const App = () => {
     return (
          <div className="App">
               <Router>
                    <Switch>
                         <DynamicRoute path="/register" guest>
                              <Register />
                         </DynamicRoute>
                         <DynamicRoute path="/login" guest>
                              <Login />
                         </DynamicRoute>
                         <DynamicRoute exact path="/" authenticated>
                              <Chat />
                         </DynamicRoute>
                    </Switch>
               </Router>
          </div>
     );
};

export default App;
