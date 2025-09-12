import { RecipeData } from "@/types/Recipe";

export const getRecipes = async (): Promise<RecipeData> => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000";
  try {
    const response = await fetch(`${baseUrl}/api/Recipe`);
    
    if (!response.ok) {
      throw new Error(`エラー: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('レシピの取得に失敗しました:', error);
    throw error;
  }
};