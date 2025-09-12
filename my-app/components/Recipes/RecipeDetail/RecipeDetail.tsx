"use client"

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import RecipeImage from "./RecipeImage";
import RecipeTitle from "./RecipeTitle";
import RecipeIngredient from "./RecipeIngredient";
import Refrigerator from "./Refrigerator";
import RecipeSteps from "./RecipeSteps";
import { getSingleRecipe } from "@/features/singleRecipe/GetSingleRecipeApi";
import type { RecipeDetail } from "@/types/RecipeDetail";
import Loading from "@/components/common/loading";

export default function RecipeDetail({id}: {id: string}) {
    const { token } = useAuth();
    const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipe = async () => {
            if (token) {
                const apiResponse = await getSingleRecipe(id, token);
                setRecipe(apiResponse);
            }
            setLoading(false);
        };

        fetchRecipe();
    }, [id, token]);

    if (loading) {
        return (
           <Loading/>
        );
    }

    if (!recipe) {
        return <div className="flex flex-col items-center justify-center h-screen">レシピが見つかりませんでした。</div>;
    }

    return (
        <div className="w-96 mx-auto bg-white">
            <RecipeImage image={recipe.image_url} />
            <div className="py-10 flex flex-col gap-10">
                <RecipeTitle
                    title={recipe.name}
                    cookingTime={recipe.cook_time.toString()}
                    calories={recipe.calories.toString()}
                    recipe_id={recipe.recipe_id}
                    description={recipe.author_comment}
                    saved_flg={recipe.saved_flg}
                />
                <RecipeIngredient ingredients={recipe.ingredients}/>
                <Refrigerator/>
                <RecipeSteps steps={recipe.steps} cookingPoint={recipe.cooking_point} />
            </div>
        </div>
    )
}