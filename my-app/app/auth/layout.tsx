import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | Meguru（めぐる）認証",
    default: "認証",
  },
  description: "Meguru（めぐる）にログイン・新規登録して、AIレシピ提案と食品ロス削減を始めましょう。",
  robots: {
    index: false,
    follow: false,
  },
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
