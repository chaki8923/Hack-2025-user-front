"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CameraCapture from "@/components/camera-capture"
import LoadingAnimation from "@/components/loading-animation"
import { useRouter } from "next/navigation"
import Image from "next/image";

export default function UserHomePage() {
  const [currentView, setCurrentView] = useState<'home' | 'camera' | 'loading'>('home')
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [detectedIngredients, setDetectedIngredients] = useState<string[]>([])
  const router = useRouter()

  const handleCameraClick = () => {
    setCurrentView('camera')
  }

  const handleRecipeClick = () => {
    router.push('/user/recipes')
  }

  const handleImageCapture = (imageDataUrl: string, ingredients: string[]) => {
    setCapturedImage(imageDataUrl)
    setDetectedIngredients(ingredients)
    setCurrentView('loading')
    
    // Store ingredients for recipe recommendations
    localStorage.setItem('detectedIngredients', JSON.stringify(ingredients))
    localStorage.setItem('lastAnalysisImage', imageDataUrl)
    
    // Simulate AI analysis completion
    setTimeout(() => {
      router.push('/user/recipes?tab=recommendations')
    }, 4000) // Increased to 4 seconds to show the full loading animation
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setCapturedImage(null)
    setDetectedIngredients([])
  }

  if (currentView === 'camera') {
    return (
      <main className="min-h-screen relative" style={{ backgroundColor: '#FFFFFF' }}>
        {/* Back button */}
        <div className="absolute top-12 left-4 z-10">
          <Button 
            variant="ghost" 
            onClick={handleBackToHome} 
            className="text-white bg-transparent hover:bg-transparent p-2"
          >
            <Image src="/images/back.svg" alt="back" width={24} height={24} />
          </Button>
        </div>

        {/* Camera interface */}
        <CameraCapture 
          onImageCapture={handleImageCapture}
          onBack={handleBackToHome}
        />
      </main>
    )
  }

  if (currentView === 'loading') {
    return (
      <LoadingAnimation 
        imageDataUrl={capturedImage} 
        detectedIngredients={detectedIngredients}
      />
    )
  }

  // Home view - matching Figma design exactly
  return (
    <main className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F7F4F4' }}>
      {/* Background image */}
      <div className="absolute top-24 w-64 h-16">
        <Image
          src="/images/logo-image.png"
          alt="Background"
          width={256} // w-64 は 256px
          height={64} // h-16 は 64px
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main content container */}
      <div className="flex flex-col items-center gap-14 px-36 py-32 w-full max-w-sm">
        {/* First section - Camera */}
        <div className="flex flex-col items-center gap-3 w-44">
          <p 
            className="text-center leading-5"
            style={{ 
              color: '#563124', 
              fontFamily: 'Noto Sans JP', 
              fontSize: '16px', 
              fontWeight: '700', 
              lineHeight: '21px' 
            }}
          >
            冷蔵庫の中身を撮影して<br />レシピを検索しよう
          </p>
          
          <div className="flex flex-col items-center gap-3">
            {/* Camera button */}
            <div 
              className="flex items-center justify-center rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: '#F7F4F4'
              }}
              onClick={handleCameraClick}
            >
              <Image src="/images/photo_camera.svg" alt="Camera" width={96} height={96} />
            </div>
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
              撮影
            </p>
          </div>
        </div>

        {/* Second section - Recipe */}
        <div className="flex flex-col items-center gap-3 w-48">
          <p 
            className="text-center leading-5"
            style={{ 
              color: '#563124', 
              fontFamily: 'Noto Sans JP', 
              fontSize: '16px', 
              fontWeight: '700', 
              lineHeight: '21px' 
            }}
          >
            前回のレシピを確認しよう
          </p>
          
          <div className="flex flex-col items-center gap-3">
            {/* Recipe button */}
            <div 
              className="flex items-center justify-center rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleRecipeClick}
            >
              <Image src="/images/photo_recipe.svg" alt="Recipe" width={96} height={96} />
            </div>
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
              レシピ
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}