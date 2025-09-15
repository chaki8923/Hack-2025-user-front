interface Ingredient {
    id: number;
    name: string;
    display_order: number;
    amount_text: string;
}

interface RecipeIngredientProps {
    ingredients: Ingredient[];
}

export default function RecipeIngredient({ ingredients }: RecipeIngredientProps) {
    return (
        <div className="self-stretch px-5 flex flex-col justify-start items-start gap-5">
            <div className="self-stretch inline-flex justify-between items-center">
                <div className="inline-flex flex-col justify-start items-start gap-2">
                    <div className="text-zinc-800 text-xl font-bold font-['Noto_Sans_JP'] leading-tight">材料</div>
                    <div className="text-stone-700 text-sm font-bold font-['Noto_Sans_JP'] leading-tight">2人分</div>
                </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="self-stretch flex flex-col justify-start items-start">
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="self-stretch py-2 border-b border-dotted border-zinc-800 inline-flex justify-between items-center gap-2">
                            <div className="text-zinc-800 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">{ingredient.name}</div>
                            <div className="text-zinc-800 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">{ingredient.amount_text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}