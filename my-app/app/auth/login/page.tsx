"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

const handleLogin = async () => {
  if (!email || !password) {
    setError("メールアドレスとパスワードを入力してください")
    return
  }

  try {
    setError("")
    
    // 開発用
    // const baseUrl = "http://localhost:8080";
    // 本番用
    const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
    const response = await fetch(`${baseUrl}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "ログインに失敗しました")
    }

    const data = await response.json()
    
    // JWTトークンをlocalStorageに保存
    localStorage.setItem("token", data.data.token)
    localStorage.setItem("user", JSON.stringify({
      id: data.data.id,
      email: data.data.email,
      name: data.data.name,
    }))

    console.log("ログイン成功:", data)
    
    // ユーザーページにリダイレクト
    router.push("/user")
  } catch (error) {
    console.error("ログインエラー:", error)
    setError(error instanceof Error ? error.message : "ログインに失敗しました")
  }
}

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-sm mx-auto">
        {/* meguruロゴ */}
        <div className="text-center mb-12 mt-8">
          <Image 
            src="/images/meguru_logo.png" 
            alt="meguru" 
            className="mx-auto"
            width={254}
            height={70}
          />
        </div>

        {/* ログインタイトル */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-gray-900">ログイン</h1>
        </div>

        {/* ログインフォーム */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              メールアドレス
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              パスワード
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            />
          </div>

          <div className="text-left">
            <Link href="/auth/forgot-password" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-3">
            <Image src="/images/Vector 35.svg" alt="Arrow Left" width={6} height={9} />
              パスワードを忘れた方
            </Link>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleLogin}
            className="w-full h-12 text-white font-medium rounded-full hover:opacity-90 transition-all"
            style={{ backgroundColor: '#F1B300' }}
          >
            ログインする
          </Button>

          <Button
            variant="outline"
            asChild
            className="w-full h-12 font-medium rounded-full border-2 hover:bg-gray-50 transition-all"
            style={{ borderColor: '#F1B300', color: '#F1B300' }}
          >
            <Link href="/auth/register">新規登録</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
