// import { Bookmark } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

interface BookMarkToggleProps {
    recipe_id: string;
    saved_flg: boolean;
}

// localStorage操作用のヘルパー関数
const getSavedRecipes = (): Record<string, { saved_flg: boolean }> => {
    if (typeof window === 'undefined') return {};
    try {
        const saved = localStorage.getItem('saved_recipes');
        return saved ? JSON.parse(saved) : {};
    } catch (error) {
        console.error('Error reading saved recipes from localStorage:', error);
        return {};
    }
};

const setSavedRecipes = (recipes: Record<string, { saved_flg: boolean }>) => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem('saved_recipes', JSON.stringify(recipes));
    } catch (error) {
        console.error('Error saving recipes to localStorage:', error);
    }
};

const updateRecipeBookmark = (recipe_id: string, saved_flg: boolean) => {
    const savedRecipes = getSavedRecipes();
    savedRecipes[recipe_id] = { saved_flg };
    setSavedRecipes(savedRecipes);
    
    // カスタムイベントを発火してブックマーク状態変更を通知
    window.dispatchEvent(new CustomEvent('bookmarkChanged', {
        detail: { recipe_id, saved_flg }
    }));
};

export default function BookMarkToggle({ recipe_id, saved_flg }: BookMarkToggleProps) {
    const [isBookMarked, setIsBookMarked] = useState(saved_flg);

    // localStorage から初期状態を読み込む
    useEffect(() => {
        const savedRecipes = getSavedRecipes();
        const savedRecipe = savedRecipes[recipe_id];
        if (savedRecipe !== undefined) {
            setIsBookMarked(savedRecipe.saved_flg);
        }
    }, [recipe_id]);

    const handleBookmarkToggle = useCallback(async() => {
        const token = localStorage.getItem("token");
        
        // ログインしていない場合はlocalStorageのみ更新
        if (!token) {
            const newBookmarkStatus = !isBookMarked;
            setIsBookMarked(newBookmarkStatus);
            updateRecipeBookmark(recipe_id, newBookmarkStatus);
            return;
        }
        // 開発用
        // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";
        // 本番用
        const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
        const method = isBookMarked ? "DELETE" : "POST";
        const endpoint = isBookMarked ? `${baseUrl}/api/v1/saved-recipes/${recipe_id}` : `${baseUrl}/api/v1/saved-recipes`;

        const response = await fetch(endpoint, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: method === "POST" ? JSON.stringify({ recipe_id: recipe_id }) : undefined,
        });

        if (response.ok) {
            const newBookmarkStatus = !isBookMarked;
            setIsBookMarked(newBookmarkStatus);
            // localStorage に保存
            updateRecipeBookmark(recipe_id, newBookmarkStatus);
        } else {
            console.error("Failed to toggle bookmark status");
        }
    }, [isBookMarked, recipe_id]);
    
    return (
        <div>
            <button onClick={handleBookmarkToggle}>
                <svg 
                    width="30" 
                    height="30" 
                    viewBox="0 0 15 22" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path 
                        d="M1 20.5V1H14V20.5L7.5 16.1065L1 20.5Z" 
                        stroke={isBookMarked ? "#EAB308" : "#000000"} 
                        fill={isBookMarked ? "#EAB308" : "transparent"}
                        strokeWidth="1.39286"
                    />
                </svg>
            </button>
        </div>
    )
}