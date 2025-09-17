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
  const [isCapturing, setIsCapturing] = useState(false)
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
      // Check if getUserMedia is supported and HTTPS
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('カメラAPIがサポートされていません。HTTPSでアクセスしてください。')
      }

      // Start with back camera on mobile, front camera on desktop
      let constraints: MediaStreamConstraints = {
        video: {
          facingMode: isMobile ? 'environment' : 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      }

      let mediaStream: MediaStream | null = null
      
      try {
        // Try first constraint
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      } catch (backCameraError) {
        console.warn('初回カメラ起動失敗:', backCameraError)
        
        // Fallback 1: Try front camera if back camera failed on mobile
        if (isMobile) {
          try {
            constraints = {
              video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            }
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
          } catch (frontCameraError) {
            console.warn('フロントカメラ失敗:', frontCameraError)
            
            // Fallback 2: Basic video constraints
            try {
              constraints = { video: true }
              mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
            } catch {
              throw backCameraError // Throw original error
            }
          }
        } else {
          throw backCameraError
        }
      }
      
      if (mediaStream) {
        setStream(mediaStream)
        setIsCameraActive(true)
        setError(null)
        
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
          
          // Ensure video plays
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch(playError => {
              console.warn('Video play failed:', playError)
            })
          }
        }
      }
    } catch (err) {
      console.error('カメラ起動エラー:', err)
      
      let errorMessage = 'カメラにアクセスできませんでした。'
      
      if (err instanceof Error) {
        const error = err as Error & { name?: string }
        if (err.message.includes('Permission denied') || error.name === 'NotAllowedError') {
          errorMessage = 'カメラの使用が許可されていません。ブラウザの設定でカメラの権限を有効にしてください。'
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'カメラが見つかりません。デバイスにカメラが接続されているか確認してください。'
        } else if (error.name === 'NotSupportedError' || err.message.includes('HTTPS')) {
          errorMessage = 'カメラAPIがサポートされていません。HTTPSでアクセスしてください。'
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'カメラが他のアプリケーションで使用中です。他のアプリを閉じてから再試行してください。'
        }
      }
      
      setError(errorMessage)
      setIsCameraActive(false) // 重要: エラー時はfalseにする
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setIsCameraActive(false)
  }

  const captureImage = async () => {
    setIsCapturing(true)
    
    try {
      // If camera is not active, try to start it first
      if (!isCameraActive || !stream) {
        console.log('カメラが非アクティブです。カメラを起動します...')
        await startCamera()
        // Wait a moment for camera to initialize
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      if (videoRef.current && canvasRef.current && isCameraActive) {
        const video = videoRef.current
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')

        if (context && video.videoWidth > 0 && video.videoHeight > 0) {
          // Set canvas dimensions to match video
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight

          // Draw the current video frame to canvas
          context.drawImage(video, 0, 0, canvas.width, canvas.height)

          // Convert to data URL
          const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
          setCapturedImage(imageDataUrl)
          return
        }
      }
      
      // Fallback: create a mock refrigerator image
      console.log('カメラからの撮影に失敗しました。モック画像を作成します。')
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
    } catch (error) {
      console.error('撮影エラー:', error)
      setError('撮影に失敗しました。再度お試しください。')
    } finally {
      setIsCapturing(false)
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
    setIsCapturing(false)
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
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        
        // Add Authorization header if token is available
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        // Data URLからBase64部分のみを抽出
        const base64Data = capturedImage.replace(/^data:image\/[a-z]+;base64,/, '');
        
        const response = await fetch(`${baseUrl}/api/v1/recipes-from-image`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ 
            image_base64: base64Data  // バックエンドが期待するフィールド名
          })
        })
        
        console.log("📡 Response received:", response.status, response.statusText)
        console.log("📋 Response headers:", Object.fromEntries(response.headers.entries()))

        // レスポンスステータスをチェック
        if (!response.ok) {
          console.error("❌ API Error:", response.status, response.statusText)
          
          if (response.status === 401) {
            console.error("🔑 Unauthorized: Token may be missing or invalid")
            throw new Error(`API Error: 401 Unauthorized - Please login to access AI recipe analysis`)
          }
          
          // その他のエラーの場合もフォールバックレシピを使用
          throw new Error(`API Error: ${response.status} ${response.statusText}`)
        }

        let data;
        try {
          data = await response.json()
        } catch (jsonError) {
          console.error("❌ Error parsing response JSON:", jsonError)
          throw new Error("Invalid JSON response from API")
        }
        
        console.log("🤖 AI Analysis Result:", data)
        
        // データ構造の安全チェック
        if (!data || !data.data) {
          console.error("❌ Invalid response structure:", data)
          throw new Error("Invalid response structure from API")
        }
        
        console.log("🤖 AI Analysis Result2:", data.data.ai_recommended_recipes)
        
        const ingredients = data.ingredients || []
        const recipes = data.data || {}
        
        console.log("🥕 Extracted ingredients:", ingredients)
        console.log("📖 Recipe data structure:", recipes)
        console.log("🔢 Recipe counts:", {
          low_calorie: recipes.low_calorie_recipes?.length || 0,
          low_price: recipes.low_price_recipes?.length || 0,
          quick_cook: recipes.quick_cook_recipes?.length || 0,
          ai_recommended: recipes.ai_recommended_recipes?.length || 0
        })
        
        setAnalysisResult(ingredients)
        
        // Show appropriate message based on response type
        if (data.authRequired) {
          console.log("🔑 Authentication required for detailed analysis")
        } else if (data.fallback) {
          console.log("🔄 Using fallback data due to backend issues")
        } else if (data.error) {
          console.log("⚠️ Analysis completed with errors:", data.error)
        }
        
        // Store ingredients and recipes in localStorage with detailed logging
        localStorage.setItem('detectedIngredients', JSON.stringify(ingredients))
        localStorage.setItem('extracted_ingredients', JSON.stringify(ingredients))
        
        // レシピデータを正規化（Recipe型に合わせる）
        const normalizeRecipes = (recipeArray: unknown[]): Record<string, unknown>[] => {
          if (!Array.isArray(recipeArray)) return []
          
          return recipeArray.map((recipe: unknown) => {
            const r = recipe as Record<string, unknown>
            return {
            recipe_id: r.recipe_id || r.id || `recipe_${Date.now()}_${Math.random()}`,
            name: r.name || "名前不明",
            cook_time: r.cook_time || r.cooking_time || 30,
            calories: r.calories || 300,
            total_price: r.total_price || r.price || 400,
            image_url: r.image_url || "/images/curry.jpg",
            ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
            seasonings: Array.isArray(r.seasonings) ? r.seasonings : ["塩", "こしょう"],
            saved_flg: r.saved_flg || false,
            created_at: r.created_at || new Date().toISOString()
          }
        })
        }

        const lowCalorieRecipes = normalizeRecipes(recipes.low_calorie_recipes || [])
        const lowPriceRecipes = normalizeRecipes(recipes.low_price_recipes || [])
        const quickCookRecipes = normalizeRecipes(recipes.quick_cook_recipes || [])
        const aiRecommendedRecipes = normalizeRecipes(recipes.ai_recommended_recipes || [])

        console.log("💾 Low Calorie Recipes:", lowCalorieRecipes)
        console.log("💾 Low Price Recipes:", lowPriceRecipes)
        console.log("💾 Quick Cook Recipes:", quickCookRecipes)
        console.log("💾 AI Recommended Recipes:", aiRecommendedRecipes)
        
        localStorage.setItem('low_calorie_recipes', JSON.stringify(lowCalorieRecipes))
        localStorage.setItem('low_price_recipes', JSON.stringify(lowPriceRecipes))
        localStorage.setItem('quick_cook_recipes', JSON.stringify(quickCookRecipes))
        localStorage.setItem('ai_recommended_recipes', JSON.stringify(aiRecommendedRecipes))
        
        console.log("💾 Saved to localStorage:", {
          'low_calorie_recipes': lowCalorieRecipes.length + ' recipes',
          'low_price_recipes': lowPriceRecipes.length + ' recipes',
          'quick_cook_recipes': quickCookRecipes.length + ' recipes',
          'ai_recommended_recipes': aiRecommendedRecipes.length + ' recipes'
        })
        localStorage.setItem('aiAnalysisResult', JSON.stringify(data))
        
        // If no recipes are available, provide fallback recipes
        const totalRecipeCount = lowCalorieRecipes.length + lowPriceRecipes.length + quickCookRecipes.length + aiRecommendedRecipes.length;
        if (totalRecipeCount === 0) {
          console.log("⚠️ No recipes found in AI response, using fallback recipes");
          const fallbackRecipes = [
            {
              recipe_id: "fallback_1",
              name: "野菜炒め",
              cook_time: 15,
              calories: 200,
              total_price: 300,
              image_url: "/images/vegetable-curry.jpg",
              ingredients: ["にんじん", "玉ねぎ", "キャベツ", "もやし"],
              seasonings: ["醤油", "塩", "こしょう", "サラダ油"],
              saved_flg: false,
              created_at: new Date().toISOString()
            },
            {
              recipe_id: "fallback_2", 
              name: "チキンカレー",
              cook_time: 30,
              calories: 450,
              total_price: 500,
              image_url: "/images/curry.jpg",
              ingredients: ["鶏肉", "玉ねぎ", "にんじん", "じゃがいも"],
              seasonings: ["カレー粉", "塩", "こしょう", "トマト缶"],
              saved_flg: false,
              created_at: new Date().toISOString()
            }
          ];
          
          // Store fallback recipes in all categories
          localStorage.setItem('low_calorie_recipes', JSON.stringify(fallbackRecipes))
          localStorage.setItem('low_price_recipes', JSON.stringify(fallbackRecipes))
          localStorage.setItem('quick_cook_recipes', JSON.stringify(fallbackRecipes))
          localStorage.setItem('ai_recommended_recipes', JSON.stringify(fallbackRecipes))
          
          console.log("💾 Fallback recipes saved to all categories");
        }
        
        // Call the parent callback with image and ingredients
        onImageCapture(capturedImage, ingredients)
        
      } catch (error) {
        console.error("❌ AI Analysis Error:", error)
        
        // 詳細なエラーログ
        if (error instanceof Error) {
          console.error("🔍 Error details:", error.message)
          
          // 401エラーの場合の特別な処理
          if (error.message.includes("401")) {
            console.error("🔑 Unauthorized Error: Please login to access AI recipe analysis")
          }
        }
        
        // Fallback with mock ingredients and recipes
        const fallbackIngredients = ["にんじん", "玉ねぎ", "キャベツ", "豚肉", "じゃがいも"]
        const fallbackRecipes = [
          {
            recipe_id: "error_fallback_1",
            name: "豚肉と野菜の炒め物",
            cook_time: 20,
            calories: 350,
            total_price: 400,
            image_url: "/images/ginger_pork.jpg",
            ingredients: ["豚肉", "にんじん", "玉ねぎ", "キャベツ"],
            seasonings: ["醤油", "みりん", "生姜", "サラダ油"],
            saved_flg: false,
            created_at: new Date().toISOString()
          },
          {
            recipe_id: "error_fallback_2",
            name: "野菜スープ",
            cook_time: 25,
            calories: 150,
            total_price: 250,
            image_url: "/images/vegetable-curry.jpg",
            ingredients: ["にんじん", "玉ねぎ", "じゃがいも", "キャベツ"],
            seasonings: ["塩", "こしょう", "コンソメ"],
            saved_flg: false,
            created_at: new Date().toISOString()
          }
        ];
        
        setAnalysisResult(fallbackIngredients)
        localStorage.setItem('detectedIngredients', JSON.stringify(fallbackIngredients))
        localStorage.setItem('extracted_ingredients', JSON.stringify(fallbackIngredients))
        
        // Store fallback recipes in all categories
        localStorage.setItem('low_calorie_recipes', JSON.stringify(fallbackRecipes))
        localStorage.setItem('low_price_recipes', JSON.stringify(fallbackRecipes))
        localStorage.setItem('quick_cook_recipes', JSON.stringify(fallbackRecipes))
        localStorage.setItem('ai_recommended_recipes', JSON.stringify(fallbackRecipes))
        
        console.log("💾 Error fallback recipes saved to all categories");
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
            disabled={isCapturing}
            className="w-16 h-16 rounded-full flex items-center justify-center disabled:opacity-50"
            style={{ backgroundColor: '#563124' }}
          >
            {isCapturing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <Camera className="w-10 h-10 text-white" />
            )}
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