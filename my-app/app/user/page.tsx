"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CameraCapture from "@/components/camera-capture"
import LoadingAnimation from "@/components/loading-animation"
import { useRouter } from "next/navigation"
import Image from "next/image"
import AuthGuard from "@/components/AuthGuard"

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
      <AuthGuard>
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
      </AuthGuard>
    )
  }

  if (currentView === 'loading') {
    return (
      <AuthGuard>
        <LoadingAnimation 
          imageDataUrl={capturedImage} 
          detectedIngredients={detectedIngredients}
        />
      </AuthGuard>
    )
  }

  // Home view - matching Figma design exactly
  return (
    <AuthGuard>
      <main className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#F7F4F4' }}>
        {/* Main content container - including logo */}
        <div className="flex flex-col items-center gap-14 px-8 py-8 w-full max-w-sm">
          {/* Logo image */}
          <div className="flex justify-center">
            <Image
              src="/images/meguru_logo.png"
              alt="Meguru Logo"
              width={256}
              height={64}
              className="object-contain"
            />
          </div>
          {/* First section - Camera */}
          <div className="flex flex-col items-center gap-3 w-44">
            <p 
              className="text-center leading-5"
              style={{ 
                color: '#563124',
                fontSize: '18px',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                letterSpacing: '-0.14px'
              }}
            >
              冷蔵庫撮影で
            </p>
            
            <button 
              onClick={handleCameraClick}
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md cursor-pointer"
            >
              <Image 
                src="/images/photo_camera.svg"
                alt="photo camera"
                width={34}
                height={27}
                className="object-contain"
              />
            </button>

            <p 
              className="text-center leading-5"
              style={{ 
                color: '#563124',
                fontSize: '18px',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                letterSpacing: '-0.14px'
              }}
            >
              簡単撮影
            </p>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center w-full">
            <div className="h-px bg-gray-300 flex-grow"></div>
            <span 
              className="px-4"
              style={{ 
                color: '#563124',
                fontSize: '16px',
                fontFamily: 'Noto Sans JP',
                fontWeight: 400
              }}
            >
              または
            </span>
            <div className="h-px bg-gray-300 flex-grow"></div>
          </div>

          {/* Second section - Recipe */}
          <div className="flex flex-col items-center gap-3 w-44">
            <p 
              className="text-center leading-5"
              style={{ 
                color: '#563124',
                fontSize: '18px',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                letterSpacing: '-0.14px'
              }}
            >
              これまでの
            </p>
            
            <button 
              onClick={handleRecipeClick}
              className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md cursor-pointer"
            >
              <Image 
                src="/images/photo_recipe.svg"
                alt="photo recipe"
                width={34}
                height={27}
                className="object-contain"
              />
            </button>

            <p 
              className="text-center leading-5"
              style={{ 
                color: '#563124',
                fontSize: '18px',
                fontFamily: 'Noto Sans JP',
                fontWeight: 700,
                letterSpacing: '-0.14px'
              }}
            >
              レシピ
            </p>
          </div>
        </div>
      </main>
    </AuthGuard>
  )
}