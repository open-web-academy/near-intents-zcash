"use client"

import { BitteAiChat } from "@bitte-ai/chat"
import type { Wallet } from "@near-wallet-selector/core"
import Paper from "@src/components/Paper"
import { useEffect, useState } from "react"
import { useWalletSelector } from "../../providers/WalletSelectorProvider"
//import { Wallet } from "@bitte-ai/react"

const bitteAgent = {
  id: "near-intents-zcash.vercel.app",
  name: "AI-Mixer Assistant",
  verified: true,
  image: "https://z.cash/wp-content/uploads/2023/03/zcash-logo.gif",
};


export default function Agent() {
  const { selector } = useWalletSelector()
  console.log(selector)
  const [wallet, setWallet] = useState<Wallet>()
  useEffect(() => {
    const fetchWallet = async () => {
      const walletInstance = await selector.wallet()
      setWallet(walletInstance)
    }
    if (selector) fetchWallet()
  }, [selector])

  return (
    <main className="flex flex-col items-center gap-8 max-w-5xl mx-auto my-4 md:my-8 w-full">
    <div className="h-[calc(100vh-114px)] lg:h-[calc(100vh-180px)] w-full">
      <BitteAiChat
        options={{
          agentImage: bitteAgent.image,
          agentName: bitteAgent.name,
        }}
        agentId={bitteAgent.id}
        apiUrl="/api/chat"
        historyApiUrl="/api/history"
        wallet={{ near: { wallet } }}
        />
    </div>
  </main>
  )
}
