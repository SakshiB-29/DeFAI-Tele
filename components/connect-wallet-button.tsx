"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet } from "lucide-react"
import { useState, useEffect } from "react"
import { ethers } from "ethers"

// Define Ethereum provider interface
interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (eventName: string, callback: (...args: any[]) => void) => void;
  removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
}

const wallets = [
  {
    id: "metamask",
    name: "MetaMask",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "trustwallet",
    name: "Trust Wallet",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    icon: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    icon: "/placeholder.svg?height=40&width=40",
  },
]

export function ConnectWalletButton() {
  const [open, setOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [account, setAccount] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Function to safely get ethereum provider
  const getEthereumProvider = (): EthereumProvider | undefined => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
      return window.ethereum as unknown as EthereumProvider;
    }
    return undefined;
  };

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      const ethereum = getEthereumProvider();
      if (ethereum) {
        try {
          // Check if already connected
          const provider = new ethers.providers.Web3Provider(ethereum as any);
          const accounts = await provider.listAccounts();
          
          if (accounts.length > 0) {
            setAccount(accounts[0]);
          }
        } catch (err) {
          console.error("Error checking connection:", err);
        }
      }
    };

    checkConnection();
  }, []);

  // Handle account changes
  useEffect(() => {
    const ethereum = getEthereumProvider();
    if (ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      };

      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
    return undefined;
  }, []);

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId)
    setConnecting(true)
    setError(null);

    try {
      if (walletId === "metamask") {
        const ethereum = getEthereumProvider();
        if (!ethereum) {
          throw new Error("MetaMask is not installed. Please install MetaMask to connect.");
        }

        const provider = new ethers.providers.Web3Provider(ethereum as any);
        const accounts = await provider.send("eth_requestAccounts", []);
        
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setOpen(false);
        } else {
          throw new Error("No accounts found.");
        }
      } else {
        // For other wallets, we can implement similar logic
        // For now, just show an error that it's not implemented
        throw new Error(`${walletId} integration is coming soon.`);
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  }

  const handleDisconnect = () => {
    setAccount(null);
  }

  return (
    <>
      {account ? (
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={handleDisconnect}
        >
          <Wallet className="h-4 w-4" />
          {account.substring(0, 6)}...{account.substring(account.length - 4)}
        </Button>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Wallet className="h-4 w-4" />
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect your wallet</DialogTitle>
              <DialogDescription>Connect your wallet to access all features of DeFAI</DialogDescription>
            </DialogHeader>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <div className="grid gap-4 py-4">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className="justify-start gap-3 h-14"
                  disabled={connecting}
                  onClick={() => handleConnect(wallet.id)}
                >
                  <img src={wallet.icon || "/placeholder.svg"} alt={wallet.name} className="h-6 w-6" />
                  <span>{wallet.name}</span>
                  {connecting && selectedWallet === wallet.id && <span className="ml-auto animate-spin">⟳</span>}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

