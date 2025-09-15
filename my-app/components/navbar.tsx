"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Hide navbar on home, camera, and loading pages
  const shouldHideNavbar = () => {
    // Check if we're on the main homepage
    if (pathname === '/') {
      return true
    }
    // Check if we're on the user home page (which handles camera and loading states)
    if (pathname === '/user') {
      return true
    }
    return false
  }

  if (shouldHideNavbar()) {
    return null
  }

  if (pathname === '/auth/login' || pathname === '/auth/register') {
    return null
  }

  if (pathname === '/auth/register') {
    return null
  }

  return (
    <nav className="fixed left-0 right-0 bottom-0 w-[390px] mx-auto bg-stone-100 border-t z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/user"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("/user") && !isActive("/user/recipes") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Image  src={("/images/not-clicked-home.svg")} alt="Home" width={24} height={24} />
          <span className={`text-xs font-medium text-gray-500`}>ホーム</span>
        </Link>

        <Link
          href="/user/recipes"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("/user/recipes") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Image src={isActive("/user/recipes") && !isActive("/user/recipes/store-recipes") ? "/images/clicked-recipe.svg" : "/images/not-clicked-recipe.svg"} alt="Recipe" width={24} height={24} />
          <span className={`text-xs font-medium text-gray-500 ${isActive("/user/recipes") && !isActive("/user/recipes/store-recipes") ? 'text-gray-500' : 'text-gray-700 font-bold'}`}>レシピ</span>
        </Link>

        <Link
          href="/user/recipes/store-recipes"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("/user/recipes/store-recipes") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Image src={isActive("/user/recipes/store-recipes") ? "/images/clicked-store.svg" : "/images/not-clicked-bookmark.svg"} alt="Store" width={24} height={24} />
          <span className={`text-xs font-medium text-gray-500`}>保存リスト</span>
        </Link>

        <Link
          href="/user/profile"
          className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors duration-200 ${
            isActive("/user/profile") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Image src={isActive("/user/profile") ? "/images/clicked-mypage.svg" : "/images/not-clicked-profile.svg"} alt="Profile" width={24} height={24} />
          <span className={`text-xs font-medium text-gray-500`}>マイページ</span>
        </Link>
      </div>
    </nav>
  )
}
