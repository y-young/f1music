import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import Admin from "./Admin";
import { TitleContext } from "hooks/useTitle";
import "../index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <TitleContext>
        <Admin />
      </TitleContext>
    </Router>
  </React.StrictMode>
);
