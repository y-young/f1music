import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { TitleContext } from "hooks/useTitle";
import { initSentry } from "utils";
import "../index.less";

initSentry();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <TitleContext>
        <App />
      </TitleContext>
    </Router>
  </React.StrictMode>
);
