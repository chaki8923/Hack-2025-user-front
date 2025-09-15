import { RecipeData } from "@/types/Recipe";

export const getRecipes = async (): Promise<RecipeData> => {
  // 開発用
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:3000";
  // 本番用
  const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
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