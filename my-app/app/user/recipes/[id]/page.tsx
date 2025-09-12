import RecipeDetail from "@/components/Recipes/RecipeDetail/RecipeDetail";
import { Suspense } from "react";
import Loading from "@/components/common/loading";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  // console.log(params.id)
  // const { id } = 
  // const id = "fd92e13b-c665-47d3-aahttp://localhost:3000/user/recipes/fd92e13b-c665-47d3-aa0b-0e2a8bfdd6e50b-0e2a8bfdd6e5"


  return (
    <Suspense
      fallback={
        <Loading />
      }
    >
      <RecipeDetail id={id} />
    </Suspense>
  );
}
