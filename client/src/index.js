import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import store from "./redux/store";
import {NextUIProvider} from "@nextui-org/react";

const container = document.getElementById("root");
const root = createRoot(container); // create a root

root.render(

    <Provider store={store}>
      
      <App />
      
    </Provider>
  

);

reportWebVitals();
