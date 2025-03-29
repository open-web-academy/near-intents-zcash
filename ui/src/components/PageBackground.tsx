"use client"

import Image from "next/image"
import { useContext } from "react"

import { FeatureFlagsContext } from "@src/providers/FeatureFlagsProvider"
import solswapBg from "../../public/static/templates/solswap/bg.png"

const PageBackground = () => {
  return (
    <div className="absolute bottom-0 w-full h-full -z-[1] bg-gray-50 dark:bg-black-900">
      <div className="w-full h-full bg-gray-950" />
    </div>
  )
}

export default PageBackground
