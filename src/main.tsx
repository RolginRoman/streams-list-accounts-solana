import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { WalletProvider } from "./wallet/WalletProvider.tsx";
import { StreamflowClientWrapper } from "./solana/StreamflowClientWrapper.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WalletProvider>
      <StreamflowClientWrapper>
        <App />
      </StreamflowClientWrapper>
    </WalletProvider>
  </React.StrictMode>,
);
