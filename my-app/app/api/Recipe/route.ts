import { RecipeData } from "@/types/Recipe";
import { NextResponse } from "next/server"

const mockRecipeData: RecipeData = {
    extracted_ingredients: [
      "ジュース",
      "ドレッシング",
      "豆板醤",
      "バナナ",
      "キュウリ",
      "卵",
      "ツナ缶",
      "サラダチキン"
    ],
    low_calorie_recipes: [
      {
        recipe_id: "dbfa7ace-8532-49bc-8b92-8d0ac3d515e1",
        name: "豚バラ肉と大根の炒め鍋",
        cook_time: 15,
        calories: 300,
        total_price: 350,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/91143/large_image_original.jpg",
        ingredients: [
          "豚バラ薄切り肉",
          "豚バラ薄切り肉",
          "大根",
          "大根",
          "えのきだけ",
          "えのきだけ",
          "長ねぎ",
          "長ねぎ",
          "卵",
          "卵"
        ],
        seasonings: [
          "水",
          "水",
          "Cook Do 香味ペースト",
          "Cook Do 香味ペースト",
          "にんにく 薄切り",
          "にんにく 薄切り",
          "AJINOMOTO 濃口ごま油",
          "AJINOMOTO 濃口ごま油",
          "小ねぎ 小口切り",
          "小ねぎ 小口切り",
          "すり白ごま",
          "すり白ごま"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "715d311f-fc35-4f24-a8dd-b8ec13b719ee",
        name: "キャベツと豚バラの卵とじ（お好み焼き風）",
        cook_time: 20,
        calories: 370,
        total_price: 200,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/325857/large_image_original.jpg",
        ingredients: [
          "キャベツ",
          "キャベツ",
          "豚バラ肉薄切り",
          "豚バラ肉薄切り",
          "卵",
          "卵"
        ],
        seasonings: [
          "サラダ油",
          "サラダ油",
          "塩",
          "塩",
          "(トッピング) お好みソース",
          "(トッピング) お好みソース",
          "(トッピング) マヨネーズ",
          "(トッピング) マヨネーズ",
          "(トッピング) 鰹節",
          "(トッピング) 鰹節",
          "(トッピング) 青のり",
          "(トッピング) 青のり"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "c5150ef7-487d-432b-ac0c-ace4df315e95",
        name: "ほっとする味 鶏肉と大根の煮物",
        cook_time: 60,
        calories: 520,
        total_price: 400,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/daikon.jpg",
        ingredients: [
          "鶏もも肉",
          "大根",
          "水(下ゆで用)",
          "米(下ゆで用)",
          "卵(Mサイズ)",
          "水(ゆで用)"
        ],
        seasonings: [
          "(煮汁) 水",
          "(煮汁) 顆粒和風だし",
          "(煮汁) しょうゆ",
          "(煮汁) みりん",
          "(煮汁) 料理酒",
          "(煮汁) 砂糖"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "b5377c49-9d61-4adf-9ece-b9490f44a3be",
        name: "簡単ふわとろ！親子丼",
        cook_time: 30,
        calories: 730,
        total_price: 200,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/oyakodon.jpg",
        ingredients: [
          "ご飯",
          "鶏もも肉",
          "玉ねぎ",
          "卵",
          "かいわれ大根"
        ],
        seasonings: [
          "料理酒",
          "みりん",
          "顆粒和風だし",
          "砂糖",
          "しょうゆ",
          "サラダ油"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      }
    ],
    low_price_recipes: [
      {
        recipe_id: "715d311f-fc35-4f24-a8dd-b8ec13b719ee",
        name: "キャベツと豚バラの卵とじ（お好み焼き風）",
        cook_time: 20,
        calories: 370,
        total_price: 200,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/325857/large_image_original.jpg",
        ingredients: [
          "キャベツ",
          "キャベツ",
          "豚バラ肉薄切り",
          "豚バラ肉薄切り",
          "卵",
          "卵"
        ],
        seasonings: [
          "サラダ油",
          "サラダ油",
          "塩",
          "塩",
          "(トッピング) お好みソース",
          "(トッピング) お好みソース",
          "(トッピング) マヨネーズ",
          "(トッピング) マヨネーズ",
          "(トッピング) 鰹節",
          "(トッピング) 鰹節",
          "(トッピング) 青のり",
          "(トッピング) 青のり"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "b5377c49-9d61-4adf-9ece-b9490f44a3be",
        name: "簡単ふわとろ！親子丼",
        cook_time: 30,
        calories: 730,
        total_price: 200,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/oyakodon.jpg",
        ingredients: [
          "ご飯",
          "鶏もも肉",
          "玉ねぎ",
          "卵",
          "かいわれ大根"
        ],
        seasonings: [
          "料理酒",
          "みりん",
          "顆粒和風だし",
          "砂糖",
          "しょうゆ",
          "サラダ油"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "dbfa7ace-8532-49bc-8b92-8d0ac3d515e1",
        name: "豚バラ肉と大根の炒め鍋",
        cook_time: 15,
        calories: 300,
        total_price: 350,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/91143/large_image_original.jpg",
        ingredients: [
          "豚バラ薄切り肉",
          "豚バラ薄切り肉",
          "大根",
          "大根",
          "えのきだけ",
          "えのきだけ",
          "長ねぎ",
          "長ねぎ",
          "卵",
          "卵"
        ],
        seasonings: [
          "水",
          "水",
          "Cook Do 香味ペースト",
          "Cook Do 香味ペースト",
          "にんにく 薄切り",
          "にんにく 薄切り",
          "AJINOMOTO 濃口ごま油",
          "AJINOMOTO 濃口ごま油",
          "小ねぎ 小口切り",
          "小ねぎ 小口切り",
          "すり白ごま",
          "すり白ごま"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "c5150ef7-487d-432b-ac0c-ace4df315e95",
        name: "ほっとする味 鶏肉と大根の煮物",
        cook_time: 60,
        calories: 520,
        total_price: 400,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/daikon.jpg",
        ingredients: [
          "鶏もも肉",
          "大根",
          "水(下ゆで用)",
          "米(下ゆで用)",
          "卵(Mサイズ)",
          "水(ゆで用)"
        ],
        seasonings: [
          "(煮汁) 水",
          "(煮汁) 顆粒和風だし",
          "(煮汁) しょうゆ",
          "(煮汁) みりん",
          "(煮汁) 料理酒",
          "(煮汁) 砂糖"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      }
    ],
    quick_cook_recipes: [
      {
        recipe_id: "dbfa7ace-8532-49bc-8b92-8d0ac3d515e1",
        name: "豚バラ肉と大根の炒め鍋",
        cook_time: 15,
        calories: 300,
        total_price: 350,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/91143/large_image_original.jpg",
        ingredients: [
          "豚バラ薄切り肉",
          "豚バラ薄切り肉",
          "大根",
          "大根",
          "えのきだけ",
          "えのきだけ",
          "長ねぎ",
          "長ねぎ",
          "卵",
          "卵"
        ],
        seasonings: [
          "水",
          "水",
          "Cook Do 香味ペースト",
          "Cook Do 香味ペースト",
          "にんにく 薄切り",
          "にんにく 薄切り",
          "AJINOMOTO 濃口ごま油",
          "AJINOMOTO 濃口ごま油",
          "小ねぎ 小口切り",
          "小ねぎ 小口切り",
          "すり白ごま",
          "すり白ごま"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "715d311f-fc35-4f24-a8dd-b8ec13b719ee",
        name: "キャベツと豚バラの卵とじ（お好み焼き風）",
        cook_time: 20,
        calories: 370,
        total_price: 200,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/325857/large_image_original.jpg",
        ingredients: [
          "キャベツ",
          "キャベツ",
          "豚バラ肉薄切り",
          "豚バラ肉薄切り",
          "卵",
          "卵"
        ],
        seasonings: [
          "サラダ油",
          "サラダ油",
          "塩",
          "塩",
          "(トッピング) お好みソース",
          "(トッピング) お好みソース",
          "(トッピング) マヨネーズ",
          "(トッピング) マヨネーズ",
          "(トッピング) 鰹節",
          "(トッピング) 鰹節",
          "(トッピング) 青のり",
          "(トッピング) 青のり"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "b5377c49-9d61-4adf-9ece-b9490f44a3be",
        name: "簡単ふわとろ！親子丼",
        cook_time: 30,
        calories: 730,
        total_price: 200,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/oyakodon.jpg",
        ingredients: [
          "ご飯",
          "鶏もも肉",
          "玉ねぎ",
          "卵",
          "かいわれ大根"
        ],
        seasonings: [
          "料理酒",
          "みりん",
          "顆粒和風だし",
          "砂糖",
          "しょうゆ",
          "サラダ油"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "c5150ef7-487d-432b-ac0c-ace4df315e95",
        name: "ほっとする味 鶏肉と大根の煮物",
        cook_time: 60,
        calories: 520,
        total_price: 400,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/daikon.jpg",
        ingredients: [
          "鶏もも肉",
          "大根",
          "水(下ゆで用)",
          "米(下ゆで用)",
          "卵(Mサイズ)",
          "水(ゆで用)"
        ],
        seasonings: [
          "(煮汁) 水",
          "(煮汁) 顆粒和風だし",
          "(煮汁) しょうゆ",
          "(煮汁) みりん",
          "(煮汁) 料理酒",
          "(煮汁) 砂糖"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      }
    ],
    ai_recommended_recipes: [
      {
        recipe_id: "c5150ef7-487d-432b-ac0c-ace4df315e95",
        name: "ほっとする味 鶏肉と大根の煮物",
        cook_time: 60,
        calories: 520,
        total_price: 400,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/daikon.jpg",
        ingredients: [
          "鶏もも肉",
          "大根",
          "水(下ゆで用)",
          "米(下ゆで用)",
          "卵(Mサイズ)",
          "水(ゆで用)"
        ],
        seasonings: [
          "(煮汁) 水",
          "(煮汁) 顆粒和風だし",
          "(煮汁) しょうゆ",
          "(煮汁) みりん",
          "(煮汁) 料理酒",
          "(煮汁) 砂糖"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "715d311f-fc35-4f24-a8dd-b8ec13b719ee",
        name: "キャベツと豚バラの卵とじ（お好み焼き風）",
        cook_time: 20,
        calories: 370,
        total_price: 200,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/325857/large_image_original.jpg",
        ingredients: [
          "キャベツ",
          "キャベツ",
          "豚バラ肉薄切り",
          "豚バラ肉薄切り",
          "卵",
          "卵"
        ],
        seasonings: [
          "サラダ油",
          "サラダ油",
          "塩",
          "塩",
          "(トッピング) お好みソース",
          "(トッピング) お好みソース",
          "(トッピング) マヨネーズ",
          "(トッピング) マヨネーズ",
          "(トッピング) 鰹節",
          "(トッピング) 鰹節",
          "(トッピング) 青のり",
          "(トッピング) 青のり"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "b5377c49-9d61-4adf-9ece-b9490f44a3be",
        name: "簡単ふわとろ！親子丼",
        cook_time: 30,
        calories: 730,
        total_price: 200,
        image_url: "https://pub-608156fee9814c35ad00d461a390e841.r2.dev/oyakodon.jpg",
        ingredients: [
          "ご飯",
          "鶏もも肉",
          "玉ねぎ",
          "卵",
          "かいわれ大根"
        ],
        seasonings: [
          "料理酒",
          "みりん",
          "顆粒和風だし",
          "砂糖",
          "しょうゆ",
          "サラダ油"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      },
      {
        recipe_id: "dbfa7ace-8532-49bc-8b92-8d0ac3d515e1",
        name: "豚バラ肉と大根の炒め鍋",
        cook_time: 15,
        calories: 300,
        total_price: 350,
        image_url: "https://video.kurashiru.com/production/recipe_card_contents/image_src_file/91143/large_image_original.jpg",
        ingredients: [
          "豚バラ薄切り肉",
          "豚バラ薄切り肉",
          "大根",
          "大根",
          "えのきだけ",
          "えのきだけ",
          "長ねぎ",
          "長ねぎ",
          "卵",
          "卵"
        ],
        seasonings: [
          "水",
          "水",
          "Cook Do 香味ペースト",
          "Cook Do 香味ペースト",
          "にんにく 薄切り",
          "にんにく 薄切り",
          "AJINOMOTO 濃口ごま油",
          "AJINOMOTO 濃口ごま油",
          "小ねぎ 小口切り",
          "小ねぎ 小口切り",
          "すり白ごま",
          "すり白ごま"
        ],
        saved_flg: false,
        created_at: "2023-01-01T00:00:00Z"
      }
    ]
  };

export async function GET() {
    return NextResponse.json(mockRecipeData);
}