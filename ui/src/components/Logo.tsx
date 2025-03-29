import Image from "next/image"
import Link from "next/link"

import { Navigation } from "@src/constants/routes"
import { FeatureFlagsContext } from "@src/providers/FeatureFlagsProvider"
import { useContext } from "react"

const Logo = () => {
  return (
    <Link href={Navigation.HOME}>
      <Image
        src="/static/templates/near-intents/zcash_logo.png"
        alt="Near Intent Logo"
        width={32}
        height={32}
        className="hidden dark:block"
      />
      <Image
        src="/static/templates/near-intents/zcash_logo.png"
        alt="Near Intent Logo"
        width={32}
        height={32}
        className="dark:hidden"
      />
    </Link>
  )
}

export default Logo
