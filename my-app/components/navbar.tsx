"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, User, Bookmark } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  // Hide navbar on home, camera, and loading pages
  const shouldHideNavbar = () => {
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

  return (
    <nav className="fixed left-0 right-0 bottom-0 w-[393px] mx-auto bg-stone-100 border-t z-50">
      <div className="flex justify-around items-center h-16">
        <Link
          href="/user"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/user") && !isActive("/user/recipes") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs mt-1">ホーム</span>
        </Link>

        <Link
          href="/user/recipes"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/user/recipes") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <BookOpen className="h-5 w-5" />
          <span className="text-xs mt-1">レシピ</span>
        </Link>

        <Link
          href="/user/recipes/store-recipes"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/user/recipes/store-recipes") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Bookmark className="h-5 w-5" />
          <span className="text-xs mt-1">保存リスト</span>
        </Link>

        <Link
          href="/user/profile"
          className={`flex flex-col items-center justify-center w-full h-full ${
            isActive("/user/profile") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs mt-1">マイページ</span>
        </Link>
      </div>
    </nav>
  )
}
