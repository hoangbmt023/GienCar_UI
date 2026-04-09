import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HashRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";

window.global = window;

createRoot(document.getElementById("root")).render(
  // <BrowserRouter>
  //     <App />
  // </BrowserRouter>,
  <HashRouter>
    <App />
  </HashRouter>,
);
