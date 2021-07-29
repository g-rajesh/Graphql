import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import ApolloProvider from "./ApolloProvider";
import { AuthProvider } from "./context/auth";
import { MessageProvider } from "./context/Message";

ReactDOM.render(
     <React.StrictMode>
          <ApolloProvider>
               <AuthProvider>
                    <MessageProvider>
                         <App />
                    </MessageProvider>
               </AuthProvider>
          </ApolloProvider>
     </React.StrictMode>,
     document.getElementById("root")
);
