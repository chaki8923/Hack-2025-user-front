"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

function ResetPasswordForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError("無効なリンクです。")
    }
  }, [searchParams])

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setError("すべてのフィールドを入力してください")
      return
    }

    if (newPassword.length < 8) {
      setError("パスワードは8文字以上で入力してください")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("パスワードが一致しません")
      return
    }

    if (!token) {
      setError("無効なリンクです")
      return
    }

    try {
      setError("")
      setIsLoading(true)
      
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      const response = await fetch(`${baseUrl}/api/v1/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "パスワードリセットに失敗しました")
      }

      setIsSuccess(true)
      
      // 3秒後にログイン画面に自動遷移
      setTimeout(() => {
        router.push("/auth/login")
      }, 3000)
    } catch (error) {
      console.error("パスワードリセットエラー:", error)
      setError(error instanceof Error ? error.message : "パスワードリセットに失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
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

          {/* 成功メッセージ */}
          <div className="text-center mb-8">
            <div className="mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </div>
            <h1 className="text-2xl text-gray-900 mb-4">パスワードを変更しました</h1>
            <p className="text-gray-600 text-sm leading-relaxed">
              パスワードの変更が完了しました。<br />
              新しいパスワードでログインしてください。<br />
              <br />
              <span className="text-xs text-gray-500">3秒後に自動的にログイン画面に移動します</span>
            </p>
          </div>

          {/* ログインボタン */}
          <div className="space-y-4">
            <Button
              asChild
              className="w-full h-12 text-white font-medium rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: '#F1B300' }}
            >
              <Link href="/auth/login">ログイン画面へ</Link>
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
          <h1 className="text-2xl text-gray-900 mb-4">新しいパスワード</h1>
          <p className="text-gray-600 text-sm">
            新しいパスワードを入力してください。
          </p>
        </div>

        {/* トークンエラー */}
        {!token && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-600 text-sm">
                無効なリンクです。パスワードリセットを再度申請してください。
              </p>
            </div>
          </div>
        )}

        {/* フォーム */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              新しいパスワード
            </label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8文字以上で入力してください"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              パスワード確認
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="上記と同じパスワードを入力してください"
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
            disabled={isLoading || !token}
            className="w-full h-12 text-white font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50"
            style={{ backgroundColor: '#F1B300' }}
          >
            {isLoading ? "変更中..." : "パスワードを変更する"}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">読み込み中...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
