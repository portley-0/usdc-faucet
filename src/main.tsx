import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import {
  metaMaskWallet,
  injectedWallet,
  coreWallet,
  rabbyWallet,
  trustWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { toPrivyWallet } from '@privy-io/cross-app-connect/rainbow-kit';
import { createConfig, http, WagmiProvider } from "wagmi";
import type { Chain } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import Faucet from "./Faucet.jsx";
import "./styles/tailwind.css";

const avalancheFujiPrivySafe: Chain = {
  id: 43113,
  name: 'Avalanche Fuji (Privy Safe)',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://api.liveduel-demo-2.app/rpc'],
    },
    public: {
      http: ['https://api.liveduel-demo-2.app/rpc'],
    },
  },
  blockExplorers: {
    default: { name: 'Snowtrace', url: 'https://testnet.snowtrace.io' },
  },
  testnet: true,
};

const queryClient = new QueryClient();

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        toPrivyWallet({
          id: 'cm04asygd041fmry9zmcyn5o5',
          name: 'Abstract (Google)',
          iconUrl: '/abstract.png'
        }),
        coreWallet,
        rabbyWallet,
        trustWallet,
        walletConnectWallet,
        injectedWallet,
      ],
    },
  ],
  {
    appName: "mUSDC Faucet",
    projectId: "bdeb8c2bc7bf8ef345e3f6c2a02bf549",
  }
);

const config = createConfig({
  chains: [avalancheFujiPrivySafe],
  connectors,
  transports: {
    [avalancheFujiPrivySafe.id]: http('https://api.liveduel-demo-2.app/rpc'),
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider chains={[avalancheFujiPrivySafe]} theme={darkTheme()}>
          <Faucet />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
