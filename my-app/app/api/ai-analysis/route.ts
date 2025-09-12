import { NextResponse } from "next/server"

// Backend API configuration (currently using direct API calls)
// const BACKEND_API_URL = process.env.BACKEND_API_URL || "http://localhost:8080"

export async function POST(request: Request) {
  try {
    const { imageDataUrl, token } = await request.json()

    if (!imageDataUrl) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      )
    }

    console.log("🔍 Starting AI analysis via backend...")
    console.log("🔑 Token received:", token ? `${token.substring(0, 20)}...` : "No token")

    // Extract base64 data from the image URL
    const base64Data = imageDataUrl.split(',')[1]

    // Call the backend API with authentication
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    // Add Authorization header if token is provided
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
      console.log("🔑 Sending Authorization header:", `Bearer ${token.substring(0, 20)}...`)
    } else {
      console.log("⚠️ No token provided, sending request without authentication")
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const response = await fetch(`${baseUrl}/api/v1/recipes-from-image`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        image_base64: base64Data
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Backend API error ${response.status}:`, errorText)
      throw new Error(`Backend API error: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    // Extract ingredients from backend response
    const ingredients = data.data?.extracted_ingredients || []
    
    console.log("🥕 Detected Ingredients from Backend:", ingredients)

    return NextResponse.json({
      ingredients: ingredients,
      recipes: {
        low_calorie_recipes: data.data?.low_calorie_recipes || [],
        low_price_recipes: data.data?.low_price_recipes || [],
        quick_cook_recipes: data.data?.quick_cook_recipes || [],
        ai_recommended_recipes: data.data?.ai_recommended_recipes || []
      },
      confidence: 0.9
    })

  } catch (error) {
    console.error("❌ AI Analysis Error:", error)
    
    // Check if it's an authentication error
    if (error instanceof Error && error.message.includes('401')) {
      console.log("🔑 Authentication required - providing fallback ingredients")
      return NextResponse.json({
        ingredients: ["にんじん", "玉ねぎ", "キャベツ", "じゃがいも", "豚肉"],
        recipes: {
          low_calorie_recipes: [],
          low_price_recipes: [],
          quick_cook_recipes: [],
          ai_recommended_recipes: []
        },
        analysis: "認証が必要ですが、基本的な食材を提案します。より詳細な分析にはログインが必要です。",
        confidence: 0.3,
        authRequired: true
      })
    }
    
    // Fallback response for other errors
    return NextResponse.json({
      ingredients: ["にんじん", "玉ねぎ", "キャベツ"],
      recipes: {
        low_calorie_recipes: [],
        low_price_recipes: [],
        quick_cook_recipes: [],
        ai_recommended_recipes: []
      },
      analysis: "画像の分析中にエラーが発生しました。基本的な食材を提案します。",
      confidence: 0.5,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 