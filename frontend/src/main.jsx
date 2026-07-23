import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "sileo";
import App from "./App";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/sidebar.css";
import "./styles/components.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <>
        <Toaster 
        position="top-center"
        toastOptions={{
            style: {
                minWidth: '320px',
                padding: '14px 18px',
            }
        }}
        />
        <App />
    </>
);