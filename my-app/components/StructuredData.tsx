"use client"

import Script from "next/script"

export default function StructuredData() {
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Meguru（めぐる）",
    "description": "食品ロス削減と節約を支援するAIアプリケーション",
    "url": "https://www.meguru-food.jp",
    "logo": {
      "@type": "ImageObject",
      "url": "https://www.meguru-food.jp/images/meguru_logo.png",
      "width": 200,
      "height": 56
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": "Japanese"
    },
    "sameAs": [
      "https://twitter.com/meguru_food"
    ],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "JP",
      "addressLocality": "Japan"
    }
  }

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Meguru（めぐる）",
    "alternateName": "めぐる",
    "url": "https://www.meguru-food.jp",
    "description": "冷蔵庫の中身を撮影するだけでAIが最適なレシピを提案。食品ロスを削減しながら節約できるアプリです。",
    "inLanguage": "ja-JP",
    "isAccessibleForFree": true,
    "publisher": {
      "@type": "Organization",
      "name": "Meguru Team",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.meguru-food.jp/images/meguru_logo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://www.meguru-food.jp/user/recipes?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  }

  const webApplicationStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Meguru（めぐる）",
    "description": "食品ロス削減と節約を支援するAIレシピ提案アプリ",
    "url": "https://www.meguru-food.jp",
    "applicationCategory": "LifestyleApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "JPY"
    },
    "featureList": [
      "AIレシピ提案",
      "食品ロス削減",
      "冷蔵庫画像認識",
      "近隣店舗情報",
      "節約サポート"
    ],
    "screenshot": {
      "@type": "ImageObject",
      "url": "https://www.meguru-food.jp/images/meguru_logo.png"
    },
    "author": {
      "@type": "Organization",
      "name": "Meguru Team"
    }
  }

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Meguruはどのようなアプリですか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Meguruは冷蔵庫の中身を撮影するだけで、AIが食材を認識し最適なレシピを提案するアプリです。食品ロスの削減と家計の節約を同時に実現できます。"
        }
      },
      {
        "@type": "Question",
        "name": "どのように食品ロスを削減できますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "冷蔵庫にある食材を有効活用できるレシピを提案することで、食材を無駄にせず使い切ることができます。また、近隣店舗のお得な情報も提供しています。"
        }
      },
      {
        "@type": "Question",
        "name": "利用料金はかかりますか？",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "基本機能は無料でご利用いただけます。冷蔵庫撮影による食材認識やAIレシピ提案などの主要機能を無料でお使いいただけます。"
        }
      }
    ]
  }

  return (
    <>
      {/* Organization Schema */}
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationStructuredData, null, 2)
        }}
      />

      {/* Website Schema */}
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteStructuredData, null, 2)
        }}
      />

      {/* WebApplication Schema */}
      <Script
        id="webapplication-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webApplicationStructuredData, null, 2)
        }}
      />

      {/* FAQ Schema */}
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqStructuredData, null, 2)
        }}
      />
    </>
  )
}
