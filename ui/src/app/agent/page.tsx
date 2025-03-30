"use client"

import { BitteAiChat } from "@bitte-ai/chat"
import type { Wallet } from "@near-wallet-selector/core"
import Paper from "@src/components/Paper"
import { useEffect, useState } from "react"
import { useWalletSelector } from "../../providers/WalletSelectorProvider"
//import { Wallet } from "@bitte-ai/react"

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
    <Paper>
      <BitteAiChat
        agentId={"near-intents-zcash.vercel.app"}
        apiUrl={"../api/chat"}
        //wallet={{ near: { wallet } }}
      />
    </Paper>
  )
}
