import Loading from "@/components/common/loading";
import RecipesContainer from "../../../components/Recipes/RecipesContainer";
import { Suspense } from "react";

export default function MainRecipes() {
  return (
    <div className="flex flex-col items-center min-h-screen">
      <Suspense
        fallback={
          <Loading/>
        }
      >
        <RecipesContainer />
      </Suspense>
    </div>
  )
}
