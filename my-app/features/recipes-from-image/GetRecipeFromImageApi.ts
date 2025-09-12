// import { Recipe } from "@/types/Recipe";

// export const getRecipesFromImage = async (imageData: FormData): Promise<Recipe[] | null> => {
//   const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"; // バックエンドのURL
//   // ログイン機能が未実装のため、固定のダミートークンを使用
//   const token = "YOUR_STATIC_JWT_TOKEN_HERE"; // ここに固定のJWTトークンを記述してください

//   if (!token || token === "YOUR_STATIC_JWT_TOKEN_HERE") {
//     console.error("Static JWT token is not set or is default value.");
//     return null;
//   }

//   try {
//     const response = await fetch(`${backendUrl}/api/v1/recipes-from-image`, {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${token}`,
//       },
//       body: imageData,
//     });

//     if (!response.ok) {
//       console.error(`Failed to fetch recipes from image: ${response.status} ${response.statusText}`);
//       return null;
//     }

//     const data: Recipe[] = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error fetching recipes from image:", error);
//     return null;
//   }
// }; 