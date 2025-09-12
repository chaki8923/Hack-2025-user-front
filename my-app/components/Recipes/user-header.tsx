'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';

interface UserHeaderProps {
  onCategoryChange: (category: string) => void;
}

export default function UserHeader({ onCategoryChange }: UserHeaderProps) {
  const [selectedCategory, setSelectedCategory] = useState('ai_recommended_recipes');
  return (
    <>
      <div className="self-stretch py-2 bg-stone-100 inline-flex justify-between items-center">
          <div className="w-full relative flex justify-between items-center">
              <div className="w-6 h-6 relative overflow-hidden">
                {/* カメラに戻る */}
                <Link href="/user">
                  <ArrowLeft className="w-6 h-6 text-zinc-900" />
                </Link>
              </div>
              {/* レシピ一覧をabsoluteで中央に配置 */}
              <div className="absolute left-1/2 -translate-x-1/2 text-center text-neutral-900 text-sm font-bold font-['Noto_Sans_JP'] leading-snug">レシピ一覧</div>
              <Select 
                value={selectedCategory} 
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  onCategoryChange(value);
                }}
              >
                <SelectTrigger className="h-6 p-2 bg-white rounded flex justify-end items-center gap-1 w-fit">
                  <SelectValue placeholder="カテゴリー" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai_recommended_recipes">AIおすすめ</SelectItem>
                  <SelectItem value="low_calorie_recipes">カロリー</SelectItem>
                  <SelectItem value="low_price_recipes">価格</SelectItem>
                  <SelectItem value="quick_cook_recipes">調理時間</SelectItem>
                </SelectContent>
              </Select>
          </div>
      </div>
    </>
  );
} 