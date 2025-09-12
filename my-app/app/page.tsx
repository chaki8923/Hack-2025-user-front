"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F7F4F4' }}>
      <div className="max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <img 
              src="/images/meguru_logo.png" 
              alt="meguru" 
              className="h-24 mx-auto"
            />
          </div>
          <p className="text-xl mb-8" style={{ color: '#563124' }}>
            食品ロスを減らし、お金を節約し、環境を守る
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Portal */}
          <Card className="hover:shadow-lg transition-shadow border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl mb-2" style={{ color: '#563124' }}>
                🍽️ お客様向け
              </CardTitle>
              <CardDescription className="text-lg" style={{ color: '#563124' }}>
                冷蔵庫の中身を撮影してAIレシピを提案してもらおう
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2" style={{ color: '#563124' }}>
                <li>• 冷蔵庫の中身を撮影してレシピ検索</li>
                <li>• AIが最適なレシピを提案</li>
                <li>• 食品ロス削減をトラッキング</li>
                <li>• お得な食材で美味しい料理を作成</li>
              </ul>
              <Button 
                className="w-full text-white text-lg py-6 rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: '#F1B300' }}
                onClick={() => window.open('https://www.meguru-food.jp/', '_blank')}
              >
                ログインして始める
              </Button>
            </CardContent>
          </Card>

          {/* Store Portal */}
          <Card className="hover:shadow-lg transition-shadow border-0" style={{ backgroundColor: '#FFFFFF' }}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl mb-2" style={{ color: '#563124' }}>
                🏪 店舗向け
              </CardTitle>
              <CardDescription className="text-lg" style={{ color: '#563124' }}>
                余剰在庫を活用して新しい顧客にリーチ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2" style={{ color: '#563124' }}>
                <li>• 余剰食品を割引価格で出品</li>
                <li>• 店舗在庫の管理</li>
                <li>• 顧客への通知機能</li>
                <li>• 食品ロス削減の効果を測定</li>
              </ul>
              <Button 
                className="w-full text-white text-lg py-6 rounded-lg hover:opacity-90 transition-all"
                style={{ backgroundColor: '#F1B300' }}
                onClick={() => window.open('https://www.meguru-food.com/login', '_blank')}
              >
                店舗ログイン
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer text */}
        <div className="text-center mt-12">
          <p className="text-sm" style={{ color: '#563124' }}>
            簡単登録：メールアドレスとパスワードだけで今すぐ始められます
          </p>
        </div>
      </div>
    </div>
  )
} 