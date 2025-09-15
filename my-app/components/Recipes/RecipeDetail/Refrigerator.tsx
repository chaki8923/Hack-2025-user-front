"use client"
import { useState, useEffect } from 'react';

interface RefrigeratorIngredient {
    id: number;
    name: string;
    amount: string | number;
}

export default function Refrigerator() {
    const [refrigeratorIngredients, setRefrigeratorIngredients] = useState<RefrigeratorIngredient[]>([]);

    useEffect(() => {
        const storedIngredients = localStorage.getItem("extracted_ingredients");
        if (storedIngredients) {
            setRefrigeratorIngredients(JSON.parse(storedIngredients));
        } else {
            <div>
                冷蔵庫の材料がありません。
            </div>
        }
    }, []);

    if (!refrigeratorIngredients || refrigeratorIngredients.length === 0) {
        return null;
    }

    return (
        <div className="self-stretch px-5 flex flex-col justify-start items-start gap-5">
            <div className="text-zinc-800 text-xl font-bold font-['Noto_Sans_JP'] leading-tight">冷蔵庫の材料</div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start">
                    {refrigeratorIngredients.map((ingredient, index) => (
                        <div key={ingredient.toString() + index} className="self-stretch py-2 border-b border-dotted border-zinc-800 inline-flex justify-between items-center gap-2">
                            <div className="text-zinc-800 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">{ingredient.toString()}</div>
                            {/* <div className="text-zinc-800 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">{ingredient}</div> */}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}