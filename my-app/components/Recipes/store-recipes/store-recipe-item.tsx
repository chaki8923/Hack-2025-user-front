import { Recipe } from "@/types/Recipe";
import Image from "next/image";
import Link from "next/link";

export default function StoreRecipeItem({ recipe }: { recipe: Recipe }) {
  return (
    <>
      <Link href={`/user/recipes/${recipe.recipe_id}`}>
        <div className="self-stretch py-[16px] flex flex-col justify-start items-start">
          <div className="self-stretch rounded-xl inline-flex items-start">
            <div className="w-[120px] h-[120px] ml-[16px] relative rounded-xl overflow-hidden">
              {recipe.image_url && (
                <Image
                  src={recipe.image_url}
                  alt={recipe.name}
                  fill
                  className="object-cover rounded-xl"
                />
              )}
            </div>
            <div className="w-56 inline-flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start ml-[16px]">
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-slate-500 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">
                    調理時間 {recipe.cook_time}分　{recipe.calories}kcal
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-zinc-900 text-base font-bold font-['Noto_Sans_JP'] leading-tight">
                    {recipe.name}
                  </div>
                </div>
                <div className="self-stretch flex flex-col justify-start items-start">
                  <div className="self-stretch justify-start text-slate-500 text-sm font-normal font-['Noto_Sans_JP'] leading-tight">
                    {recipe.ingredients.map((ingredient, index) => (
                      <span key={index}>
                        {ingredient ? ` ${ingredient}` : ""}
                        {index < recipe.ingredients.length - 1 ? "、" : ""}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </>
  );
}