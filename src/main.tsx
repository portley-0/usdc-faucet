import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultConfig,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import Faucet from "./Faucet.jsx";
import "./styles/tailwind.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "mUSDC Faucet",
  projectId: "bdeb8c2bc7bf8ef345e3f6c2a02bf549",
  chains: [avalancheFuji],
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Faucet />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);

