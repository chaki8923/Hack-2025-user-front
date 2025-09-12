"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [emailConfirm, setEmailConfirm] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleStep1Submit = () => {
    if (!email || !emailConfirm) {
      setError("メールアドレスを入力してください")
      return
    }
    if (email !== emailConfirm) {
      setError("メールアドレスが一致しません")
      return
    }
    setError("")
    setStep(2)
  }

  const handleStep2Submit = async () => {
    if (!password || !passwordConfirm) {
      setError("パスワードを入力してください")
      return
    }
    if (password !== passwordConfirm) {
      setError("パスワードが一致しません")
      return
    }
    if (password.length < 6) {
      setError("パスワードは6文字以上で入力してください")
      return
    }
    
    try {
      setError("")
      
      // emailからnameを生成（@より前の部分）
      const name = email.split("@")[0]
      
      // 既存のuser登録APIに送信
      const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
      const response = await fetch(`${baseUrl}/api/v1/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "登録に失敗しました")
      }

      const data = await response.json()
      console.log("ユーザー登録成功:", data)
      
      setStep(3)
    } catch (error) {
      console.error("登録エラー:", error)
      setError(error instanceof Error ? error.message : "登録に失敗しました")
    }
  }

  const handleCompleteRegistration = () => {
    // ここで実際のAPI呼び出しを行う
    router.push("/user")
  }

  // メールアドレスの入力と確認が完了しているかチェック
  const isEmailValid = () => {
    return email && emailConfirm && email === emailConfirm
  }

  // ステップをクリックした時の処理
  const handleStepClick = (targetStep: number) => {
    // step3（完了）には戻れない
    if (step === 3) return
    
    if (targetStep === 1) {
      // step1には常に戻れる
      setStep(1)
      setError("")
    } else if (targetStep === 2) {
      // step2にはメールアドレスが有効な場合のみ移動可能
      if (isEmailValid()) {
        setStep(2)
        setError("")
      } else {
        setError("メールアドレスを正しく入力してください")
      }
    }
  }

  const StepIndicator = () => {
    // 各ステップがクリック可能かどうかを判定
    const canClickStep1 = step !== 3 // step3からは戻れない
    const canClickStep2 = step !== 3 && isEmailValid() // step3からは戻れない、かつメールアドレスが有効

    return (
      <div className="flex mb-8 gap-1" style={{ backgroundColor: '#F1B300' }}>
        {/* ステップ1: メールアドレス */}
        <div 
          className={`flex-1 h-12 flex items-center justify-center text-sm text-center font-medium ${
            step === 1 ? 'text-white' : 'text-gray-700'
          } ${canClickStep1 ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
          style={{
            backgroundColor: step === 1 ? '#F1B300' : 'white',
            border: step === 1 ? 'none' : '1px solid #F1B300',
            clipPath: 'polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%)',
            marginRight: '-9px'
          }}
          onClick={() => canClickStep1 && handleStepClick(1)}
        >
          <span>メールアドレス<br></br>送信</span>
        </div>
        
        {/* ステップ2: パスワード設定 */}
        <div 
          className={`flex-1 h-12 flex items-center justify-center text-sm font-medium ${
            step === 2 ? 'text-white' : 'text-gray-700'
          } ${canClickStep2 ? 'cursor-pointer hover:opacity-80' : 'cursor-default'} transition-opacity`}
          style={{
            backgroundColor: step === 2 ? '#F1B300' : 'white',
            border: step === 2 ? 'none' : '1px solid #F1B300',
            clipPath: 'polygon(0% 0%, calc(100% - 14px) 0%, 100% 50%, calc(100% - 14px) 100%, 0% 100%, 14px 50%)',
            marginLeft: '-8px',
            marginRight: '-8px',
            paddingLeft: '12px'
          }}
          onClick={() => canClickStep2 && handleStepClick(2)}
        >
          <span>パスワード設定</span>
        </div>
        
        {/* ステップ3: 登録完了 */}
        <div 
          className={`flex-1 h-12 flex items-center justify-center text-sm font-medium ${
            step === 3 ? 'text-white' : 'text-gray-700'
          } cursor-default`}
          style={{
            backgroundColor: step === 3 ? '#F1B300' : 'white',
            border: step === 3 ? 'none' : '1px solid #F1B300',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 14px 50%)',
            marginLeft: '-9px',
            paddingLeft: '12px'
          }}
        >
          <span>登録完了</span>
        </div>
      </div>
    )
  }

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

        {/* タイトル */}
        <div className="text-center mb-8">
          <h1 className="text-2xl text-gray-900">新規会員登録</h1>
        </div>

        {/* ステップインジケーター */}
        <StepIndicator />

        {/* ステップ1: メールアドレス入力 */}
        {step === 1 && (
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
                メールアドレス（確認）
              </label>
              <Input
                type="email"
                value={emailConfirm}
                onChange={(e) => setEmailConfirm(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleStep1Submit}
              className="w-full h-12 text-white font-medium rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: '#F1B300' }}
            >
              送信する
            </Button>
          </div>
        )}

        {/* ステップ2: パスワード設定 */}
        {step === 2 && (
          <div className="space-y-6">
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

            <div>
              <label className="block text-sm text-gray-700 mb-2">
                パスワード（確認）
              </label>
              <Input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <Button
              onClick={handleStep2Submit}
              className="w-full h-12 text-white font-medium rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: '#F1B300' }}
            >
              送信する
            </Button>
          </div>
        )}

        {/* ステップ3: 完了画面 */}
        {step === 3 && (
          <div className="space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-xl text-gray-900">
                新規会員登録が<br />完了しました
              </h2>
              <p className="text-sm text-gray-600">
                ホームに戻り献立レシピを作りましょう
              </p>
            </div>

            <Button
              onClick={handleCompleteRegistration}
              className="w-full h-12 text-white font-medium rounded-lg hover:opacity-90 transition-all"
              style={{ backgroundColor: '#F1B300' }}
            >
              レシピを作る
            </Button>
          </div>
        )}

        {/* ログインリンク（ステップ3以外で表示） */}
        {step !== 3 && (
          <div className="text-center mt-8">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は{" "}
              <Link href="/auth/login" className="font-medium hover:underline" style={{ color: '#F1B300' }}>
                ログイン
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}