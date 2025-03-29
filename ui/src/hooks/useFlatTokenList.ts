import {
  type BaseTokenInfo,
  type UnifiedTokenInfo,
  isBaseToken,
} from "@defuse-protocol/defuse-sdk"
import { useSearchParams } from "next/navigation"
import { useMemo } from "react"

export function useFlatTokenList(
  tokenList: (BaseTokenInfo | UnifiedTokenInfo)[]
) {
  const searchParams = useSearchParams()
  const flatListIsEnabled = !!searchParams.get("flatTokenList")

  return useMemo(() => {
    if (flatListIsEnabled) {
      return tokenList
        .flatMap((token) =>
          isBaseToken(token) ? [token] : token.groupedTokens
        )
        .map((token) => ({
          ...token,
          symbol: `${token.symbol} (${token.chainName})`,
        }))
    }
    return tokenList
  }, [flatListIsEnabled, tokenList])
}
