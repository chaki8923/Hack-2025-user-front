import type { Metadata } from "next"

export const metadata: Metadata = {
  title: {
    template: "%s | Meguru（めぐる）",
    default: "ユーザーダッシュボード",
  },
  description: "冷蔵庫の撮影とレシピ検索、プロフィール設定など、Meguru（めぐる）の全機能をご利用いただけます。",
  robots: {
    index: false,
    follow: false,
  },
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
