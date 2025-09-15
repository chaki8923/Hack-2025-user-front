"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { 
  Camera, 
  Bot, 
  BarChart3, 
  DollarSign, 
  Package, 
  ClipboardList, 
  Sprout, 
  FileText,
  Store,
  Users,
  Sparkles
} from "lucide-react"

interface Particle {
  id: number
  emoji: string
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  scale: number
}
import Image from "next/image";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [particles, setParticles] = useState<Particle[]>([])

  // 環境に応じたURLを取得する関数
  const getLoginUrls = () => {
    const isDevelopment = process.env.NODE_ENV === 'development'
    
    if (isDevelopment) {
      return {
        userLogin: '/auth/login',
        storeLogin: 'https://www.meguru-food.com/login'
      }
    } else {
      return {
        userLogin: 'https://www.meguru-food.jp/auth/login',
        storeLogin: 'https://www.meguru-food.com/login'
      }
    }
  }

  const loginUrls = getLoginUrls()

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (particles.length === 0) return

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.8, // gravity
        opacity: particle.opacity - 0.02,
        scale: particle.scale * 0.98
      })).filter(particle => particle.opacity > 0))
    }, 16)

    return () => clearInterval(interval)
  }, [particles])

  const createParticles = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const foodEmojis = ['🥕', '🥬', '🍅', '🥒', '🧄', '🧅', '🍋', '🥦', '🥔', '🌽', '🍆', '🫑', '🥑', '🍊', '🍎', '🍌', '🥝', '🍇', '🍓', '🫐', '🍄', '🌶️']
    
    const newParticles: Particle[] = []
    
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: Date.now() + i,
        emoji: foodEmojis[Math.floor(Math.random() * foodEmojis.length)],
        x: centerX - window.scrollX,
        y: centerY - window.scrollY,
        vx: (Math.random() - 0.5) * 20,
        vy: (Math.random() - 0.8) * 15,
        opacity: 1,
        scale: Math.random() * 0.8 + 0.5
      })
    }
    
    setParticles(prev => [...prev, ...newParticles])
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F7F4F4' }}>
      {/* Particle overlay */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute text-2xl"
            style={{
              left: particle.x,
              top: particle.y,
              opacity: particle.opacity,
              transform: `scale(${particle.scale})`,
            }}
          >
            {particle.emoji}
          </div>
        ))}
      </div>

      <div 
        className={`max-w-5xl w-full transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <Image 
              src="/images/meguru_logo.png" 
              alt="meguru" 
              width={254}
              height={70}
              className="h-24 mx-auto"
            />
          </div>
          <p 
            className={`text-2xl mb-12 font-medium leading-relaxed transition-all duration-700 delay-200 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ color: '#563124' }}
          >
            食品ロスを減らし、お金を節約し、環境を守る
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* User Portal */}
          <Card 
            className={`group border-0 overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105 ${
              isLoaded ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(86, 49, 36, 0.08)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="text-center pb-6 relative z-10">
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <Users size={32} className="text-orange-600" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-4 font-bold transition-colors duration-300 group-hover:text-orange-600" style={{ color: '#563124' }}>
                お客様向け
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed font-medium" style={{ color: '#563124' }}>
                冷蔵庫の中身を撮影してAIレシピを提案してもらおう
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <ul className="space-y-3" style={{ color: '#563124' }}>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <Camera size={20} className="text-orange-500 mr-3" />
                  冷蔵庫の中身を撮影してレシピ検索
                </li>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <Bot size={20} className="text-orange-500 mr-3" />
                  AIが最適なレシピを提案
                </li>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <BarChart3 size={20} className="text-orange-500 mr-3" />
                  食品ロス削減をトラッキング
                </li>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <DollarSign size={20} className="text-orange-500 mr-3" />
                  お得な食材で美味しい料理を作成
                </li>
              </ul>
              <Button 
                className="w-full text-white text-xl py-7 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl active:shadow-sm overflow-hidden relative group cursor-pointer"
                style={{ 
                  backgroundColor: '#F1B300',
                  borderRadius: '16px'
                }}
                onClick={(e) => {
                  createParticles(e)
                  setTimeout(() => {
                    if (process.env.NODE_ENV === 'development') {
                      window.location.href = loginUrls.userLogin
                    } else {
                      window.open(loginUrls.userLogin, '_blank')
                    }
                  }, 300)
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>はじめる</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Store Portal */}
          <Card 
            className={`group border-0 overflow-hidden transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-105 ${
              isLoaded ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-8'
            }`}
            style={{ 
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              boxShadow: '0 8px 32px rgba(86, 49, 36, 0.08)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="text-center pb-6 relative z-10">
              <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
                <div className="w-16 h-16 mx-auto bg-amber-100 rounded-full flex items-center justify-center mb-2">
                  <Store size={32} className="text-amber-600" />
                </div>
              </div>
              <CardTitle className="text-3xl mb-4 font-bold transition-colors duration-300 group-hover:text-amber-600" style={{ color: '#563124' }}>
                店舗向け
              </CardTitle>
              <CardDescription className="text-lg leading-relaxed font-medium" style={{ color: '#563124' }}>
                余剰在庫を活用して新しい顧客にリーチ
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <ul className="space-y-3" style={{ color: '#563124' }}>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <Package size={20} className="text-amber-500 mr-3" />
                  余剰食品を登録
                </li>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <ClipboardList size={20} className="text-amber-500 mr-3" />
                  店舗在庫の管理
                </li>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <Sprout size={20} className="text-amber-500 mr-3" />
                  フードロス対策の提案
                </li>
                <li className="flex items-center transition-transform duration-200 hover:translate-x-2">
                  <FileText size={20} className="text-amber-500 mr-3" />
                  チラシを登録
                </li>
              </ul>
              <Button 
                className="w-full text-white text-xl py-7 font-semibold transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-xl active:shadow-sm overflow-hidden relative group cursor-pointer"
                style={{ 
                  backgroundColor: '#F1B300',
                  borderRadius: '16px'
                }}
                onClick={(e) => {
                  createParticles(e)
                  setTimeout(() => {
                    if (process.env.NODE_ENV === 'development') {
                      window.location.href = loginUrls.storeLogin
                    } else {
                      window.open(loginUrls.storeLogin, '_blank')
                    }
                  }, 300)
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-amber-300 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <span>はじめる</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer text */}
        <div 
          className={`text-center mt-20 transition-all duration-700 delay-700 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-8 py-6 shadow-lg">
            <p className="text-lg font-medium flex items-center justify-center gap-2" style={{ color: '#563124' }}>
              <Sparkles size={20} className="text-orange-500" />
              簡単登録：メールアドレスとパスワードだけで今すぐ始められます
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 