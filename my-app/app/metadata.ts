import { Metadata } from "next"

export const homePageMetadata: Metadata = {
  title: "Meguru（めぐる）- 食品ロス削減で節約・環境保護を実現",
  description: "冷蔵庫の中身を撮影するだけでAIが最適なレシピを提案。食品ロスを削減しながら節約できるアプリ。お客様向けと店舗向けの両方に対応し、持続可能な社会を目指します。",
  keywords: ["食品ロス削減", "AI レシピ", "節約アプリ", "冷蔵庫 撮影", "環境保護", "SDGs", "サステナブル"],
  openGraph: {
    title: "Meguru（めぐる）- 食品ロス削減で節約・環境保護を実現",
    description: "冷蔵庫の中身を撮影するだけでAIが最適なレシピを提案。食品ロスを削減しながら節約できるアプリです。",
    url: "https://www.meguru-food.jp",
    type: "website",
    images: [
      {
        url: "/images/meguru_logo.png",
        width: 1200,
        height: 630,
        alt: "Meguru（めぐる）- 食品ロス削減アプリ",
      },
    ],
  },
  alternates: {
    canonical: "https://www.meguru-food.jp",
  },
}

export const userDashboardMetadata: Metadata = {
  title: "ユーザーホーム",
  description: "冷蔵庫の撮影とレシピ検索ができます。AIが食材を認識して最適なレシピを提案いたします。",
  robots: {
    index: false,
    follow: false,
  },
}

export const recipesMetadata: Metadata = {
  title: "AIレシピ一覧",
  description: "あなたの冷蔵庫の食材に基づいてAIが提案する、食品ロス削減に役立つレシピ一覧です。",
  openGraph: {
    title: "AIレシピ一覧 | Meguru（めぐる）",
    description: "食材を有効活用できるAIレシピをご紹介。食品ロス削減と節約を同時に実現できます。",
  },
}

export const profileMetadata: Metadata = {
  title: "プロフィール設定",
  description: "基本情報と住所を設定して、近隣店舗のお得な情報を受け取りましょう。",
  robots: {
    index: false,
    follow: false,
  },
}

export const loginMetadata: Metadata = {
  title: "ログイン",
  description: "Meguru（めぐる）にログインして、AIレシピ提案と食品ロス削減を始めましょう。",
  robots: {
    index: false,
    follow: false,
  },
}
