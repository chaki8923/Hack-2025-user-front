'use client';

import { Recipe } from "@/types/Recipe";
// このページはレシピの一覧を表示するページです。
// 親からpropsでレシピのデータを受け取って、それをRecipesItemsコンポーネントに渡します。
import RecipeItem from "./RecipeItem";
import { useEffect, useState } from "react";
import Loading from "../common/loading";

interface RecipesListsProps {
    selectedCategory: string;
}

export default function RecipesLists({ selectedCategory }: RecipesListsProps) {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔍 Loading recipes for category:", selectedCategory);
        
        // localStorageから選択されたカテゴリのレシピを取得
        const storedRecipes = localStorage.getItem(selectedCategory);
        console.log("📦 Raw data from localStorage:", storedRecipes ? storedRecipes.substring(0, 200) + '...' : 'null');
        
        if (storedRecipes) {
            try {
                const parsedRecipes = JSON.parse(storedRecipes);
                console.log("✅ Parsed recipes:", parsedRecipes);
                console.log("🔢 Number of recipes loaded:", parsedRecipes.length);
                setRecipes(parsedRecipes);
            } catch (error) {
                console.error("❌ Error parsing recipes from localStorage:", error);
                setRecipes([]);
            }
        } else {
            console.log("❌ No stored recipes found for category:", selectedCategory);
            console.log("📋 Available localStorage keys:", Object.keys(localStorage));
            setRecipes([]);
        }
        setLoading(false);
    }, [selectedCategory]);

    if (loading) {
        return <Loading/>;
    }

    // レシピが存在しない場合の表示
    if (recipes.length === 0) {
        return (
            <div className="self-stretch p-4 flex flex-col justify-center items-center">
                <p className="text-gray-500">レシピが見つかりません</p>
            </div>
        );
    }
    
    return(
        <div className="self-stretch flex flex-col justify-start items-start">
            {recipes.map((recipe, index) => (
                <RecipeItem key={recipe.recipe_id || index} recipe={recipe} />
            ))}
        </div>
    )
}