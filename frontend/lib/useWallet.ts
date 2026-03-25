"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  BLOCK_EXPLORER_URL,
  CHAIN_ID,
  CHAIN_ID_HEX,
  CURRENCY_SYMBOL,
  NETWORK_NAME,
  RPC_URL,
} from "@/lib/contractConfig";

declare global {
  interface Window {
    ethereum?: {
      on: (event: string, listener: (...args: any[]) => void) => void;
      removeListener: (
        event: string,
        listener: (...args: any[]) => void
      ) => void;
      request: (args: {
        method: string;
        params?: unknown[] | Record<string, unknown>;
      }) => Promise<unknown>;
    };
  }
}

export interface WalletState {
  address: string | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  isConnecting: boolean;
  error: string | null;
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isCorrectNetwork: false,
    isConnecting: false,
    error: null,
    provider: null,
    signer: null,
  });

  const checkNetwork = useCallback(async (provider: ethers.BrowserProvider) => {
    const network = await provider.getNetwork();
    return Number(network.chainId) === CHAIN_ID;
  }, []);

  const networkErrorMessage = `Please switch to ${NETWORK_NAME} (chainId: ${CHAIN_ID}, RPC: ${RPC_URL})`;

  const connect = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((s) => ({ ...s, error: "MetaMask not detected. Please install MetaMask." }));
      return;
    }
    setState((s) => ({ ...s, isConnecting: true, error: null }));
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const isCorrectNetwork = await checkNetwork(provider);

      setState({
        address,
        isConnected: true,
        isCorrectNetwork,
        isConnecting: false,
        error: isCorrectNetwork ? null : networkErrorMessage,
        provider,
        signer,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect wallet";
      setState((s) => ({ ...s, isConnecting: false, error: message }));
    }
  }, [checkNetwork, networkErrorMessage]);

  const switchNetwork = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setState((s) => ({
        ...s,
        error: "MetaMask not detected. Please install MetaMask.",
      }));
      return;
    }

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: CHAIN_ID_HEX }],
      });
    } catch (err: unknown) {
      const code =
        typeof err === "object" &&
        err !== null &&
        "code" in err &&
        typeof err.code === "number"
          ? err.code
          : undefined;

      if (code !== 4902) {
        const message =
          err instanceof Error ? err.message : "Failed to switch network";
        setState((s) => ({ ...s, error: message }));
        return;
      }

      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: CHAIN_ID_HEX,
            chainName: NETWORK_NAME,
            nativeCurrency: {
              name: "Ether",
              symbol: CURRENCY_SYMBOL,
              decimals: 18,
            },
            rpcUrls: [RPC_URL],
            ...(BLOCK_EXPLORER_URL
              ? { blockExplorerUrls: [BLOCK_EXPLORER_URL] }
              : {}),
          },
        ],
      });
    }

    await connect();
  }, [connect]);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      isConnected: false,
      isCorrectNetwork: false,
      isConnecting: false,
      error: null,
      provider: null,
      signer: null,
    });
  }, []);

  // Listen for account / chain changes
  useEffect(() => {
    if (typeof window === "undefined" || !window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) disconnect();
      else setState((s) => ({ ...s, address: accounts[0] }));
    };

    const handleChainChanged = () => window.location.reload();

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
      window.ethereum?.removeListener("chainChanged", handleChainChanged);
    };
  }, [disconnect]);

  return { ...state, connect, disconnect, switchNetwork };
}
