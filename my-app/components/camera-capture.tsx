"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, RotateCcw, Check, Smartphone, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"

interface CameraCaptureProps {
  onImageCapture: (imageDataUrl: string, ingredients: string[]) => void
  onBack: () => void
}

export default function CameraCapture({ onImageCapture, onBack }: CameraCaptureProps) {
  const { token } = useAuth()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if device is mobile
    setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    startCamera()
    return () => {
      stopCamera()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: isMobile ? 'environment' : 'user', // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      })
      
      setStream(mediaStream)
      setIsCameraActive(true)
      setError(null)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error('Error accessing camera:', err)
      setError('カメラにアクセスできませんでした。カメラの権限を確認してください。')
      // Fallback to mock camera for demo purposes
      setIsCameraActive(true)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert to data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImage(imageDataUrl)
      }
    } else {
      // Fallback: create a mock refrigerator image
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 300
      const ctx = canvas.getContext('2d')
      if (ctx) {
        // Create a mock refrigerator image
        ctx.fillStyle = '#f0f0f0'
        ctx.fillRect(0, 0, 400, 300)
        ctx.fillStyle = '#87CEEB'
        ctx.fillRect(50, 50, 300, 200)
        ctx.fillStyle = '#90EE90'
        ctx.fillRect(70, 70, 60, 40)
        ctx.fillStyle = '#FFB6C1'
        ctx.fillRect(150, 70, 80, 60)
        ctx.fillStyle = '#FFD700'
        ctx.fillRect(250, 70, 70, 50)
      }
      
      const imageDataUrl = canvas.toDataURL('image/jpeg')
      setCapturedImage(imageDataUrl)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setCapturedImage(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
    setAnalysisResult([])
    setIsAnalyzing(false)
    // Restart camera when retaking
    startCamera()
  }

  const confirmPhoto = async () => {
    if (capturedImage) {
      setIsAnalyzing(true)
      
      try {
        // Call AI analysis API
        console.log("🔍 Starting AI analysis...")
        console.log("📍 Sending request to:", '/api/ai-analysis')
        console.log("🔑 Token being sent:", token ? `${token.substring(0, 20)}...` : "No token")
        console.log("🖼️ Image data length:", capturedImage?.length || 0)
        
        const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
        const response = await fetch(`${baseUrl}/api/v1/recipes-from-image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            imageDataUrl: capturedImage,
          })
        })
        
        console.log("📡 Response received:", response.status, response.statusText)
        console.log("📋 Response headers:", Object.fromEntries(response.headers.entries()))

        const data = await response.json()
        
        console.log("🤖 AI Analysis Result:", data)
        
        const ingredients = data.ingredients || []
        const recipes = data.recipes || {}
        
        setAnalysisResult(ingredients)
        
        // Show appropriate message based on response type
        if (data.authRequired) {
          console.log("🔑 Authentication required for detailed analysis")
        } else if (data.fallback) {
          console.log("🔄 Using fallback data due to backend issues")
        } else if (data.error) {
          console.log("⚠️ Analysis completed with errors:", data.error)
        }
        
        // Store ingredients and recipes in localStorage
        localStorage.setItem('detectedIngredients', JSON.stringify(ingredients))
        localStorage.setItem('extracted_ingredients', JSON.stringify(ingredients))
        localStorage.setItem('low_calorie_recipes', JSON.stringify(recipes.low_calorie_recipes || []))
        localStorage.setItem('low_price_recipes', JSON.stringify(recipes.low_price_recipes || []))
        localStorage.setItem('quick_cook_recipes', JSON.stringify(recipes.quick_cook_recipes || []))
        localStorage.setItem('ai_recommended_recipes', JSON.stringify(recipes.ai_recommended_recipes || []))
        localStorage.setItem('aiAnalysisResult', JSON.stringify(data))
        
        // Call the parent callback with image and ingredients
        onImageCapture(capturedImage, ingredients)
        
      } catch (error) {
        console.error("❌ AI Analysis Error:", error)
        
        // Fallback with mock ingredients
        const fallbackIngredients = ["にんじん", "玉ねぎ", "キャベツ", "豚肉", "じゃがいも"]
        setAnalysisResult(fallbackIngredients)
        localStorage.setItem('detectedIngredients', JSON.stringify(fallbackIngredients))
        localStorage.setItem('extracted_ingredients', JSON.stringify(fallbackIngredients))
        onImageCapture(capturedImage, fallbackIngredients)
      }
    }
  }

  const handleBack = () => {
    stopCamera()
    onBack()
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">
          <Camera className="w-16 h-16 mx-auto mb-4" />
          <p className="text-lg font-semibold">カメラエラー</p>
        </div>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="space-x-4">
          <Button onClick={handleBack} variant="outline">
            戻る
          </Button>
          <Button onClick={startCamera}>
            再試行
          </Button>
        </div>
      </div>
    )
  }

  if (capturedImage) {
    return (
      <div className="min-h-screen relative">
        {/* Captured image display */}
        <div className="relative w-full h-full min-h-screen">
          <Image 
            src={capturedImage} 
            alt="Captured refrigerator contents" 
            fill
            className="object-cover"
            unoptimized
          />
          <div 
            className="absolute top-24 left-14 right-14 text-white p-2 rounded-full text-center"
            style={{ 
              backgroundColor: 'rgba(51, 51, 51, 0.7)',
              fontFamily: 'Noto Sans JP',
              fontSize: '16px',
              fontWeight: '700',
              lineHeight: '23px'
            }}
          >
            冷蔵庫の中を写してください
          </div>
        </div>
        
        {/* Camera controls - positioned at bottom */}
        <div 
          className="absolute bottom-0 left-0 right-0 flex justify-center items-center"
          style={{ backgroundColor: '#F7F4F4' }}
        >
          <div className="flex items-center justify-center gap-6 py-5">
            {/* Retake button */}
            <button
              onClick={retakePhoto}
              className="w-16 h-16 rounded-full flex items-center justify-center border-2"
              style={{ 
                backgroundColor: '#F7F4F4',
                borderColor: '#563124'
              }}
            >
              <RotateCcw className="w-8 h-8" style={{ color: '#563124' }} />
            </button>
            
            {/* Confirm button */}
            <button
              onClick={confirmPhoto}
              disabled={isAnalyzing}
              className="w-16 h-16 rounded-full flex items-center justify-center disabled:opacity-50"
              style={{ backgroundColor: '#563124' }}
            >
              {isAnalyzing ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
              ) : (
                <Check className="w-8 h-8 text-white" />
              )}
            </button>
          </div>
        </div>
        
        {/* Show analysis results if available */}
        {analysisResult.length > 0 && (
          <div 
            className="absolute top-32 left-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4"
            style={{ backgroundColor: 'rgba(240, 253, 244, 0.95)' }}
          >
            <h4 className="font-semibold text-green-800 mb-2">🥕 検出された食材:</h4>
            <div className="flex flex-wrap gap-2">
              {analysisResult.map((ingredient, index) => (
                <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Camera viewfinder */}
      <div className="absolute inset-0 w-full h-full">
        {isCameraActive && stream ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full relative">
            {/* Overlay for camera loading state */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center text-white">
                <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <p>カメラを起動中...</p>
                {isMobile && (
                  <div className="mt-2 text-sm text-gray-300 flex items-center justify-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    モバイルカメラを使用
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Instruction overlay */}
        <div 
          className="absolute top-24 left-14 right-14 text-white p-2 rounded-full text-center"
          style={{ 
            backgroundColor: 'rgba(51, 51, 51, 0.7)',
            fontFamily: 'Noto Sans JP',
            fontSize: '16px',
            fontWeight: '700',
            lineHeight: '23px'
          }}
        >
          冷蔵庫の中を写してください
        </div>
      </div>

      {/* Camera controls - positioned at bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 flex justify-center items-center"
        style={{ backgroundColor: '#F7F4F4' }}
      >
        <div className="flex items-center justify-center gap-6 py-5">
          {/* Gallery button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-16 h-16 rounded-full flex items-center justify-center border-2"
            style={{ 
              backgroundColor: '#F7F4F4',
              borderColor: '#563124'
            }}
          >
            <ImageIcon className="w-8 h-8" style={{ color: '#563124' }} />
          </button>
          
          {/* Camera capture button */}
          <button
            onClick={captureImage}
            disabled={!isCameraActive}
            className="w-16 h-16 rounded-full flex items-center justify-center disabled:opacity-50"
            style={{ backgroundColor: '#563124' }}
          >
            <Camera className="w-10 h-10 text-white" />
          </button>
        </div>
      </div>
      
      {/* Hidden file input for gallery selection */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
} 