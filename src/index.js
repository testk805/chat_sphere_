import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import Google OAuth Provider
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const clientId =
  "728165937090-15b9f7n63pc8dfc8p7t59in8f0rk279h.apps.googleusercontent.com"; // Replace with your actual Google Client ID

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();
