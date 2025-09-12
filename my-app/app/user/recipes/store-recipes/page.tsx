import StoreRecipeLists from "@/components/Recipes/store-recipes/store-recipe-lists";
import { Suspense } from "react";
import Loading from "@/components/common/loading";

export default function Page() {
    return (
        <div className="flex flex-col items-center min-h-screen">
            <Suspense
                fallback={
                    <Loading />
                }
            >
                <div className="flex flex-col items-center">
                    <StoreRecipeLists/>
                </div>
            </Suspense>
        </div>
    )
}