"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!email) {
      setError("メールアドレスを入力してください")
      return
    }

    // メールアドレスの簡単なバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setError("正しいメールアドレスを入力してください")
      return
    }

    try {
      setError("")
      setIsLoading(true)
      
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const response = await fetch(`${baseUrl}/api/v1/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "パスワードリセット申請に失敗しました")
      }

      setIsSubmitted(true)
    } catch (error) {
      console.error("パスワードリセット申請エラー:", error)
      setError(error instanceof Error ? error.message : "パスワードリセット申請に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-sm mx-auto">
          {/* meguruロゴ */}
          <div className="text-center mb-12 mt-8">
            <img 
              src="/images/meguru_logo.png" 
              alt="meguru" 
              className="h-12 mx-auto"
            />
          </div>

          {/* 送信完了メッセージ */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl text-gray-900 mb-4">メールを送信しました</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              入力されたメールアドレス宛に<br />
              パスワードリセット用のリンクを送信しました。<br />
              メールをご確認ください。
            </p>
          </div>

          {/* 戻るボタン */}
          <div className="space-y-4">
            <Button
              variant="outline"
              asChild
              className="w-full h-12 font-medium rounded-lg border-2 hover:bg-gray-50 transition-all"
              style={{ borderColor: '#F1B300', color: '#F1B300' }}
            >
              <Link href="/auth/login">ログイン画面に戻る</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* 戻るリンク */}
        <div className="mb-6">
          <Link href="/auth/login" className="inline-flex items-center text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm">ログインに戻る</span>
          </Link>
        </div>

        {/* meguruロゴ */}
        <div className="text-center mb-12 mt-8">
          <img 
            src="/images/meguru_logo.png" 
            alt="meguru" 
            className="h-12 mx-auto"
          />
        </div>

        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-gray-900 mb-4">パスワードリセット</h1>
          <p className="text-gray-600 text-sm">
            登録されたメールアドレスを入力してください。<br />
            パスワードリセット用のリンクをお送りします。
          </p>
        </div>

        {/* フォーム */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              メールアドレス
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@example.com"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full h-12 text-white font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#F1B300' }}
          >
            {isLoading ? "送信中..." : "リセットリンクを送信"}
          </Button>
        </div>
      </div>
    </div>
  )
}
