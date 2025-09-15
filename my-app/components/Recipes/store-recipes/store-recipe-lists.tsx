"use client"

import { getStoreRecipes } from "@/features/store-recipes/get-store-recipes"
import StoreRecipeItem from "./store-recipe-item";
import { Recipe } from "@/types/Recipe";
import StoreRecipesHeader from "./store-recipe-header";
import { useState, useEffect } from "react";
import Loading from "@/components/common/loading";

export default function StoreRecipeLists() {
    const [storeRecipes, setStoreRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);

    useEffect(() => {
        const fetchRecipes = async () => {
            const recipes = await getStoreRecipes();
            if (recipes) {
                setStoreRecipes(recipes);
                setFilteredRecipes(recipes);
            }
            setLoading(false);
        };

        fetchRecipes();
    }, []);

    if (loading) {
        return <Loading/>;
    }

    return (
        <div>
            <StoreRecipesHeader recipe={storeRecipes} setFilteredRecipes={setFilteredRecipes} />
            {!storeRecipes || storeRecipes.length === 0 ? (
                <div className="self-stretch p-4 flex flex-col justify-center items-center">
                    <p className="text-gray-500">保存したレシピが見つかりませんでした。</p>
                </div>
            ) : (
                <div className="self-stretch flex flex-col justify-start items-start">
                    {Array.isArray(filteredRecipes) && filteredRecipes.map((recipe: Recipe) => (
                        <StoreRecipeItem key={recipe.recipe_id} recipe={recipe}/>
                    ))}
                </div>
            )}
        </div>
    )
}