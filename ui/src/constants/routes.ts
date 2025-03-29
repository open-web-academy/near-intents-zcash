export enum Navigation {
  HOME = "/",
  AIAGENT = "/agent",
  ACCOUNT = "/account",
  DEPOSIT = "/deposit",
  WITHDRAW = "/withdraw",
  JOBS = "/jobs",
}

export type NavigationLinks = {
  href: Navigation
  label: string
  comingSoon?: true
}

export const LINKS_HEADER: NavigationLinks[] = [
  { href: Navigation.AIAGENT, label: "Ai Agent" },
  { href: Navigation.ACCOUNT, label: "Balances" },
  { href: Navigation.DEPOSIT, label: "Deposit" },
  { href: Navigation.HOME, label: "Swap" },
  { href: Navigation.WITHDRAW, label: "Withdraw" },
]
