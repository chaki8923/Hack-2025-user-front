import { NextResponse } from "next/server";

export async function getRecipeDetail(id: string) {

    if (!id) {
        return NextResponse.json({ message: "IDが必須です" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
    const response = await fetch(`${baseUrl}/api/v1/recipes/${id}`);

    if (!response.ok) {
        return NextResponse.json({ message: "レシピが見つかりません"}, { status: 404});
    }

    const recipe = await response.json();
    return recipe;
}