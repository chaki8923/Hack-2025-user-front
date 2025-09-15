import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import StructuredData from "@/components/StructuredData"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.meguru-food.jp'),
  title: {
    default: "Meguru（めぐる）- 食品ロス削減で節約・環境保護を実現",
    template: "%s | Meguru（めぐる）"
  },
  description: "Meguru（めぐる）は食品ロスを削減しながら節約できるアプリです。冷蔵庫の中身を撮影するだけでAIが最適なレシピを提案。近隣店舗のお得な情報もチェックして、環境に優しい生活を始めましょう。",
  keywords: [
    "食品ロス",
    "節約",
    "レシピ提案",
    "AI",
    "環境保護",
    "冷蔵庫",
    "料理",
    "SDGs",
    "サステナブル",
    "フードシェアリング",
    "食材活用",
    "家計節約"
  ],
  authors: [{ name: "Meguru Team" }],
  creator: "Meguru",
  publisher: "Meguru",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://www.meguru-food.jp',
    siteName: 'Meguru（めぐる）',
    title: 'Meguru（めぐる）- 食品ロス削減で節約・環境保護を実現',
    description: '冷蔵庫の中身を撮影するだけでAIが最適なレシピを提案。食品ロスを削減しながら節約できるアプリです。',
    images: [
      {
        url: '/images/meguru_logo.png',
        width: 1200,
        height: 630,
        alt: 'Meguru（めぐる）- 食品ロス削減アプリ',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meguru（めぐる）- 食品ロス削減で節約・環境保護を実現',
    description: '冷蔵庫の中身を撮影するだけでAIが最適なレシピを提案。食品ロスを削減しながら節約できるアプリです。',
    images: ['/images/meguru_logo.png'],
    creator: '@meguru_food',
    site: '@meguru_food',
  },
  category: 'food',
  classification: 'Food & Sustainability',
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#F1B300',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <StructuredData />
        {children}
        <Navbar />
      </body>
    </html>
  )
}
