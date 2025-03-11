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
import { useState } from "react"

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

  const handleConnect = async (walletId: string) => {
    setSelectedWallet(walletId)
    setConnecting(true)

    // Simulate connection
    setTimeout(() => {
      setConnecting(false)
      setOpen(false)
      // Here you would normally handle the actual wallet connection
      // and update the user state
    }, 1500)
  }

  return (
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
  )
}

