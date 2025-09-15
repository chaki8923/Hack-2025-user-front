"use client"

import Image from "next/image"
import { useState, useEffect } from "react"

interface LoadingAnimationProps {
  imageDataUrl?: string | null
  detectedIngredients?: string[]
}

export default function LoadingAnimation({ }: LoadingAnimationProps) {
  const [progress, setProgress] = useState(0)
  const [, setCurrentStep] = useState(0)
  
  const steps = [
    "画像を分析中...",
    "食材を識別中...",
    "レシピを検索中...",
    "完了！"
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          return 100
        }
        return prev + 2
      })
    }, 60) // Update every 60ms for smooth animation

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepTimer)
          return steps.length - 1
        }
        return prev + 1
      })
    }, 750) // Change step every 750ms

    return () => {
      clearInterval(timer)
      clearInterval(stepTimer)
    }
  }, [steps.length])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F7F4F4' }}>
      {/* Main content container */}
      <div className="flex flex-col items-center gap-4 px-36 py-32 w-full max-w-sm">
        {/* Loading image */}
        <div className="w-48 h-52 flex items-center justify-center mb-4">
          {/* gifで動かす */}
          <Image 
            src="/images/loading-1.gif" 
            alt="Loading" 
            className="w-full h-full object-cover" 
            width={192} // Added width
            height={208} // Added height
          />
        </div>
        
        {/* Progress bar container */}
        <div className="w-72 h-8 relative overflow-hidden rounded-full border-2" style={{ borderColor: '#563124' }}>
          {/* Background bar */}
          <div 
            className="w-full h-full rounded-full"
            style={{ 
              backgroundColor: '#F7F4F4'
            }}
          ></div>
          
          {/* Progress fill */}
          <div 
            className="absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`, 
              backgroundColor: '#563124',
              borderRadius: '100px 0px 0px 100px'
            }}
          ></div>
        </div>
        
        {/* Loading text */}
        <p 
          className="text-center"
          style={{ 
            color: '#563124', 
            fontFamily: 'Noto Sans JP', 
            fontSize: '16px', 
            fontWeight: '700', 
            lineHeight: '21px' 
          }}
        >
          Loading...
        </p>
      </div>
    </div>
  )
} 