import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { TitleContext } from "hooks/useTitle";

import "../index.less";

import App from "./App";

import { initSentry } from "utils";

initSentry();

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <Router>
      <TitleContext>
        <App />
      </TitleContext>
    </Router>
  </React.StrictMode>
);
