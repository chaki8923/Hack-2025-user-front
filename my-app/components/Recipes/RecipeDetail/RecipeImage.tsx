import { useBackButton } from "@/hooks/back-button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RecipeImageProps {
  image: string;
}



export default function RecipeImage({ image }: RecipeImageProps) {

  const handleBack = useBackButton();

  return (
    <div>
      <div className="mb-3 mt-6">
      <Link href="#" onClick={handleBack}>
        <ArrowLeft className="w-6 h-6 text-zinc-900" />
      </Link>
      </div>
      <Image
        className="w-full h-96 object-cover"
        src={image}
        alt="レシピ画像"
        width={1000}
        height={1000}
      />
    </div>
  );
}
