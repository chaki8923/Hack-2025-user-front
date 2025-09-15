export interface Recipe {
    recipe_id: string;
    name: string;
    cook_time: number;
    calories: number;
    total_price: number;
    image_url: string;
    ingredients: string[];
    seasonings: string[];
    saved_flg: boolean;
    created_at: string;
}

// レシピカテゴリ別のデータ構造
export interface RecipeData {
    extracted_ingredients: string[];
    low_calorie_recipes: Recipe[];
    low_price_recipes: Recipe[];
    quick_cook_recipes: Recipe[];
    ai_recommended_recipes: Recipe[];
}