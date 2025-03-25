import React, { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWalletClient } from "wagmi";
import { ethers } from "ethers";
import MockUSDC from "./abi/MockUSDC.json" with { type: "json" };

const USDC_ADDRESS = "0xB1cC53DfF11c564Fbe22145a0b07588e7648db74";
console.log("App mounted");

const Faucet = () => {
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [inputAmount, setInputAmount] = useState("100"); 
  const [isLoading, setIsLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleMint = async () => {
    if (!isConnected) {
      alert("Please connect your wallet.");
      return;
    }
    if (!walletClient) {    
      alert("Wallet client not available. Please reconnect your wallet.");
      return;
    }
    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    try {
      const provider = new ethers.BrowserProvider(walletClient);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(USDC_ADDRESS, MockUSDC.abi, signer);
      const amountParsed = ethers.parseUnits(inputAmount, 6);
      const tx = await contract.mint(amountParsed);
      setTxHash(tx.hash);
      await tx.wait();
      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Transaction failed");
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen">
      <div className="absolute top-4 right-4">
        <ConnectButton />
      </div>

      <div className="max-w-md mx-auto p-4 pt-16">
        <h1 className="text-2xl font-bold text-center mt-4">mUSDC Faucet</h1>
        <div className="mt-8 flex flex-col items-center">
          <input
            type="number"
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            placeholder="Enter amount"
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleMint}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? "Minting..." : "Mint"}
          </button>

          {error && (
            <p className="text-red-600 mt-4">
              Error: {error}
            </p>
          )}
          {txHash && (
            <p className="mt-4">
              Transaction sent:{" "}
              <a
                href={`https://explorer.avax-test.network/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {txHash}
              </a>
            </p>
          )}
          {isSuccess && (
            <p className="text-green-600 mt-4">
              Success! mUSDC minted.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Faucet;
