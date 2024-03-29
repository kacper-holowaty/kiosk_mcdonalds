import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import { BrowserRouter as Router } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <AppProvider>
        <App />
      </AppProvider>
    </Router>
  </React.StrictMode>
);
