import Image from "next/image"
import { useContext } from "react"
import NearLogo from "../../../public/static/logos/blockchain-strips/near.svg"
import OWAlogo from "../../../public/static/logos/owa.png"

const Footer = () => {
  return (
    <footer className="w-full flex justify-center items-center py-7">
      <div className="flex justify-center items-center gap-1.5 text-sm font-medium bg-black-900 dark:bg-black px-3 py-1.5 rounded-full">
        <span className="text-secondary">Powered by</span>
        <Image src={OWAlogo} alt="OWA" width={100} height={50} />
      </div>
    </footer>
  )
}

export default Footer
