import type { RecipeDetail, RecipeApiResponse } from "@/types/RecipeDetail";

export const getSingleRecipe = async (id: string, token: string | null): Promise<RecipeDetail | null> => {

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 開発用
  // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
  // 本番用
  const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
  const response = await fetch(`${baseUrl}/api/v1/recipes/${id}`, {
    headers: headers,
  });

  

  if (!response.ok) {
    // エラーレスポンスの場合
    console.error(`Failed to fetch recipe: ${response.status} ${response.statusText}`);
    return null;
  }

  const apiResponse: RecipeApiResponse = await response.json();

  const recipeDetail: RecipeDetail = {
      recipe_id: apiResponse.data.recipe.recipe_id,
      name: apiResponse.data.recipe.name,
      author_comment: apiResponse.data.recipe.author_comment,
      cook_time: apiResponse.data.recipe.cook_time,
      calories: apiResponse.data.recipe.calories,
      total_price: apiResponse.data.recipe.total_price,
      cooking_point: apiResponse.data.recipe.cooking_point,
      image_url: apiResponse.data.recipe.image_url,
      created_at: apiResponse.data.recipe.created_at,
      updated_at: apiResponse.data.recipe.updated_at,
      ingredients: apiResponse.data.ingredients,
      seasonings: apiResponse.data.seasonings,
      steps: apiResponse.data.steps,
      saved_flg: apiResponse.data.saved_flg,
  };

  return recipeDetail;
};