import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { TitleContext } from "hooks/useTitle";

import "../index.less";

import Admin from "./Admin";

import { initSentry } from "utils";

initSentry();

ReactDOM.createRoot(document.querySelector("#root")!).render(
  <React.StrictMode>
    <Router>
      <TitleContext>
        <Admin />
      </TitleContext>
    </Router>
  </React.StrictMode>
);
