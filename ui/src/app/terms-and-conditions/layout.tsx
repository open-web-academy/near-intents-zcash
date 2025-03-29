import type React from "react"
import type { PropsWithChildren } from "react"

import Layout from "@src/components/Layout"
import { PreloadFeatureFlags } from "@src/components/PreloadFeatureFlags"

const TermsAndConditionsLayout: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <PreloadFeatureFlags>
      <Layout>{children}</Layout>
    </PreloadFeatureFlags>
  )
}

export default TermsAndConditionsLayout
