import { WalletSelectorProvider } from "@src/providers/WalletSelectorProvider"
import type { Metadata } from "next"
import type { PropsWithChildren } from "react"

export const metadata: Metadata = {
  title: "",
}

const MyNearWalletGatewayLayout = ({ children }: PropsWithChildren) => {
  return <WalletSelectorProvider>{children}</WalletSelectorProvider>
}

export default MyNearWalletGatewayLayout
