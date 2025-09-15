"use client"

import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/AuthGuard"
import { useAuth } from "@/hooks/useAuth"
import { User, LogOut, MapPin, Loader2, CheckCircle, AlertCircle, Search, Store, Info } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "axios"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image";
import Loading from "@/components/common/loading"

const editProfileSchema = z.object({
  name: z.string().min(1, "名前は必須です"),
  zipcode: z.string().optional(),
  prefecture: z.string().optional(),
  city: z.string().optional(),
  street: z.string().optional(),
})

type EditProfileForm = z.infer<typeof editProfileSchema>

// チラシ関連の型定義
interface Store {
  id: string;
  name: string;
  city: string;
  prefecture: string;
  street: string;
}

interface FlyerItem {
  product: {
    name: string;
    category: string;
  };
  price_excluding_tax: number;
  price_including_tax: number;
  unit: string;
  restriction_note: string;
}

interface Campaign {
  name: string;
  start_date: string;
  end_date: string;
}

interface FlyerData {
  store: Store;
  campaign: Campaign;
  flyer_items: FlyerItem[];
}

interface Flyer {
  id: string;
  store_id: string;
  image_data: string;
  flyer_data: FlyerData | null;
  display_expiry_date: string | null;
  created_at: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth()
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
  })

  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSearchingAddress, setIsSearchingAddress] = useState(false)
  const [addressError, setAddressError] = useState("")
  
  // 近隣チラシ関連のstate
  const [nearbyFlyers, setNearbyFlyers] = useState<Flyer[]>([])
  const [flyersLoading, setFlyersLoading] = useState(false)

  // 郵便番号を監視
  const zipcode = watch("zipcode")
  
  // 住所の各フィールドを監視して未登録判定
  const prefecture = watch("prefecture")
  const city = watch("city")
  const street = watch("street")
  
  const isAddressEmpty = !prefecture && !city && !street
  const hasAddress = prefecture && city

  // 期限状況を判定するヘルパー関数
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const expiryDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.ceil((expiryDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) {
      return { status: 'urgent', text: '本日まで', color: 'bg-red-100 text-red-700' };
    } else if (diffDays === 1) {
      return { status: 'tomorrow', text: '明日まで', color: 'bg-orange-100 text-orange-700' };
    } else if (diffDays <= 3) {
      return { status: 'warning', text: `${diffDays}日後まで`, color: 'bg-yellow-100 text-yellow-700' };
    }
    return null;
  };

  // 近隣店舗のチラシを取得
  const fetchNearbyFlyers = async (userCity: string) => {
    if (!userCity) return;
    
    try {
      setFlyersLoading(true);
      // 開発用
      // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      // 本番用
      const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
      const response = await fetch(`${baseUrl}/api/v1/flyer/nearby?city=${encodeURIComponent(userCity)}&limit=3`);
      if (response.ok) {
        const result = await response.json();
        setNearbyFlyers(result.data || []);
      } else {
        console.error('近隣チラシ取得エラー:', response.status, response.statusText);
        setNearbyFlyers([]);
      }
    } catch (error) {
      console.error('近隣チラシ取得エラー:', error);
      setNearbyFlyers([]);
    } finally {
      setFlyersLoading(false);
    }
  };

  // 郵便番号から住所を検索
  useEffect(() => {
    const searchAddress = async () => {
      // 郵便番号が7桁の数字でない場合は処理しない
      if (!zipcode || !/^\d{7}$/.test(zipcode)) {
        setAddressError("")
        return
      }

      setIsSearchingAddress(true)
      setAddressError("")

      try {
        const response = await axios.get(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipcode}`)
        
        if (response.data.status === 200 && response.data.results && response.data.results.length > 0) {
          const result = response.data.results[0]
          
          // 住所情報をフォームに設定
          setValue("prefecture", result.address1)
          setValue("city", result.address2)
          setValue("street", result.address3)
          
        } else {
          setAddressError("該当する住所が見つかりませんでした")
        }
      } catch (err) {
        console.error("住所検索エラー:", err)
        setAddressError("住所の検索に失敗しました")
      } finally {
        setIsSearchingAddress(false)
      }
    }

    // デバウンス処理（500ms待ってから実行）
    const timeoutId = setTimeout(searchAddress, 500)
    return () => clearTimeout(timeoutId)
  }, [zipcode, setValue])

  // プロファイル情報取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return
      
      try {
        setIsLoading(true)
        const token = localStorage.getItem("token")
        
        // 開発用
        // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
        // 本番用
        const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
        const response = await axios.get(`${baseUrl}/api/v1/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })

        const profile = response.data.data
        
        // フォームに値をセット
        setValue("name", profile.name || "")
        setValue("zipcode", profile.zipcode || "")
        setValue("prefecture", profile.prefecture || "")
        setValue("city", profile.city || "")
        setValue("street", profile.street || "")
        
      } catch (err: unknown) {
        console.error("プロファイル情報の取得に失敗しました:", err)
        setError("プロファイル情報の取得に失敗しました")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [setValue, user])

  // 住所が変更された時に近隣チラシを取得
  useEffect(() => {
    if (city && !isLoading) {
      fetchNearbyFlyers(city);
    }
  }, [city, isLoading])

  const onSubmit = async (data: EditProfileForm) => {
    setError("")
    setSuccessMessage("")
    
    try {
      const token = localStorage.getItem("token")
      
      // 開発用
      // const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      // 本番用
      const baseUrl = "https://3qtmceciqv.ap-northeast-1.awsapprunner.com";
      const response = await axios.put(`${baseUrl}/api/v1/users/profile`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        setSuccessMessage("プロファイル情報を更新しました")
      }
    } catch (err: unknown) {
      console.error("更新エラー:", err)
      const axiosError = err as { response?: { data?: { error?: string } } }
      const errorMessage = err instanceof Error 
        ? err.message 
        : axiosError?.response?.data?.error || "プロファイル情報の更新に失敗しました"
      setError(errorMessage)
    }
  }

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            {/* <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: '#F1B300' }} /> */}
            <Loading />
            <p className="text-gray-600">プロファイル情報を読み込み中...</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <main className="w-[390px] mx-auto">
        <div className="w-[390px] mx-auto">
          {/* ヘッダー */}
          <div className="rounded-2xl p-6 text-white bg-[#F1B300]">
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-full p-3">
                <User className="w-6 h-6" style={{ color: '#563124' }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold">プロファイル設定</h1>
                <p className="text-white/80">あなたの基本情報と住所を管理できます</p>
              </div>
            </div>
          </div>

          {/* メインフォーム */}
          <Card className="shadow-lg border-0">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* 基本情報セクション */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
                    <User className="w-5 h-5" style={{ color: '#563124' }} />
                    <h2 className="text-lg font-semibold text-gray-900">基本情報</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-medium">名前</Label>
                      <Input 
                        id="name" 
                        {...register("name")} 
                        className="mt-1 border-gray-300 rounded-xl"
                        style={{ 
                          '--tw-ring-color': '#F1B300',
                          borderColor: '#e5e7eb'
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#F1B300'
                          e.target.style.boxShadow = '0 0 0 3px rgba(241, 179, 0, 0.1)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb'
                          e.target.style.boxShadow = 'none'
                        }}
                        placeholder="例：田中太郎"
                      />
                      {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="zipcode" className="text-gray-700 font-medium">郵便番号</Label>
                      <div className="relative">
                        <Input 
                          id="zipcode" 
                          {...register("zipcode")} 
                          className="mt-1 border-gray-300 rounded-xl pr-10"
                          style={{ 
                            '--tw-ring-color': '#F1B300',
                            borderColor: '#e5e7eb'
                          } as React.CSSProperties}
                          onFocus={(e) => {
                            e.target.style.borderColor = '#F1B300'
                            e.target.style.boxShadow = '0 0 0 3px rgba(241, 179, 0, 0.1)'
                          }}
                          onBlur={(e) => {
                            e.target.style.borderColor = '#e5e7eb'
                            e.target.style.boxShadow = 'none'
                          }}
                          placeholder="1234567（ハイフンなし7桁）"
                          maxLength={7}
                        />
                        {isSearchingAddress && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Loader2 className="w-4 h-4 animate-spin" style={{ color: '#F1B300' }} />
                          </div>
                        )}
                        {!isSearchingAddress && zipcode && zipcode.length === 7 && (
                          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                            <Search className="w-4 h-4" style={{ color: '#563124' }} />
                          </div>
                        )}
                      </div>
                      {errors.zipcode && <p className="text-sm text-red-500 mt-1">{errors.zipcode.message}</p>}
                      {addressError && <p className="text-sm text-red-500 mt-1">{addressError}</p>}
                      {!addressError && zipcode && zipcode.length === 7 && !isSearchingAddress && (
                        <p className="text-sm text-green-600 mt-1">✓ 住所を自動入力しました</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 住所情報セクション */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 pb-4 border-b border-gray-200">
                    <MapPin className="w-5 h-5" style={{ color: '#563124' }} />
                    <h2 className="text-lg font-semibold text-gray-900">住所情報</h2>
                    {!addressError && zipcode && zipcode.length === 7 && !isSearchingAddress && (
                      <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#F7F4F4', color: '#563124' }}>自動入力済み</span>
                    )}
                  </div>
                  
                  {/* 住所未登録時のアピール文言 */}
                  {isAddressEmpty && (
                    <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#F7F4F4' }}>
                      <div className="flex items-center space-x-3">
                        <div className="rounded-full p-2" style={{ backgroundColor: '#F1B300' }}>
                          <MapPin className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: '#563124' }}>住所を登録すると近隣の店舗のお得な情報が表示されます！</p>
                          <p className="text-sm text-gray-600">郵便番号を入力すると住所が自動で入力されます</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="prefecture" className="text-gray-700 font-medium">都道府県</Label>
                      <Input 
                        id="prefecture" 
                        {...register("prefecture")} 
                        className="mt-1 border-gray-300 rounded-xl"
                        style={{ 
                          '--tw-ring-color': '#F1B300',
                          borderColor: '#e5e7eb'
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#F1B300'
                          e.target.style.boxShadow = '0 0 0 3px rgba(241, 179, 0, 0.1)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb'
                          e.target.style.boxShadow = 'none'
                        }}
                        placeholder="東京都"
                      />
                      {errors.prefecture && <p className="text-sm text-red-500 mt-1">{errors.prefecture.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="city" className="text-gray-700 font-medium">市区町村</Label>
                      <Input 
                        id="city" 
                        {...register("city")} 
                        className="mt-1 border-gray-300 rounded-xl"
                        style={{ 
                          '--tw-ring-color': '#F1B300',
                          borderColor: '#e5e7eb'
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#F1B300'
                          e.target.style.boxShadow = '0 0 0 3px rgba(241, 179, 0, 0.1)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb'
                          e.target.style.boxShadow = 'none'
                        }}
                        placeholder="渋谷区"
                      />
                      {errors.city && <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>}
                    </div>
                    
                    <div>
                      <Label htmlFor="street" className="text-gray-700 font-medium">番地</Label>
                      <Input 
                        id="street" 
                        {...register("street")} 
                        className="mt-1 border-gray-300 rounded-xl"
                        style={{ 
                          '--tw-ring-color': '#F1B300',
                          borderColor: '#e5e7eb'
                        } as React.CSSProperties}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#F1B300'
                          e.target.style.boxShadow = '0 0 0 3px rgba(241, 179, 0, 0.1)'
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb'
                          e.target.style.boxShadow = 'none'
                        }}
                        placeholder="代々木1-2-3"
                      />
                      {errors.street && <p className="text-sm text-red-500 mt-1">{errors.street.message}</p>}
                    </div>
                  </div>
                </div>

                {/* メッセージ */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}
                
                {successMessage && (
                  <div className="rounded-xl p-4 flex items-center space-x-3" style={{ backgroundColor: '#F7F4F4', border: '1px solid #F1B300' }}>
                    <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#563124' }} />
                    <p className="text-sm" style={{ color: '#563124' }}>{successMessage}</p>
                  </div>
                )}

                {/* ボタン群 */}
                <div className="space-y-4">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full text-white font-semibold h-12 rounded-xl transition-all hover:opacity-90"
                    style={{ 
                      background: '#F1B300',
                      border: 'none'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        更新中...
                      </>
                    ) : (
                      "プロフィールを更新"
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    onClick={logout}
                    variant="outline"
                    className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all rounded-xl"
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    ログアウト
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 近隣店舗のチラシセクション */}
          {hasAddress && (
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <div className="rounded-full p-2" style={{ backgroundColor: '#F1B300' }}>
                    <Store className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg" style={{ color: '#563124' }}>近隣店舗のお得な情報</h3>
                    <p className="text-sm text-gray-600">{city}のお店からのチラシ</p>
                  </div>
                </div>

                {flyersLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#F1B300' }} />
                    <span className="ml-2 text-gray-600">近隣のお得な情報を取得中...</span>
                  </div>
                ) : nearbyFlyers.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nearbyFlyers.slice(0, 3).map((flyer) => {
                      const expiryStatus = getExpiryStatus(flyer.display_expiry_date || undefined);
                      return (
                        <Card key={flyer.id} className="group hover:shadow-md transition-shadow duration-300 border border-gray-200">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3 gap-2">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1 truncate" style={{ color: '#563124' }}>
                                  {flyer.flyer_data?.store.name}
                                </h4>
                                <p className="text-xs text-gray-600 line-clamp-2 leading-tight">
                                  {flyer.flyer_data?.campaign.name}
                                </p>
                              </div>
                              {expiryStatus && (
                                <Badge className={`text-xs px-1.5 py-0.5 ${expiryStatus.color} flex-shrink-0`}>
                                  {expiryStatus.text}
                                </Badge>
                              )}
                            </div>
                            <div className="aspect-[3/4] mb-3 overflow-hidden rounded-lg bg-gray-100">
                              <Image
                                src={`data:image/png;base64,${flyer.image_data}`}
                                alt={`${flyer.flyer_data?.store.name}のチラシ`}
                                width={500} // 仮の値
                                height={707} // 仮の値
                                unoptimized={true} // data URL なので最適化を無効にする
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            <Button 
                              asChild 
                              size="sm" 
                              className="w-full text-white font-medium rounded-xl transition-all hover:opacity-90"
                              style={{ backgroundColor: '#F1B300' }}
                            >
                              <Link href={`/user/flyer/${flyer.store_id}`}>
                                詳細を見る
                              </Link>
                            </Button>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl p-6 text-center" style={{ backgroundColor: '#F7F4F4' }}>
                    <Store className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600 mb-2">近隣にチラシを配信している店舗が見つかりませんでした</p>
                    <p className="text-sm text-gray-500">後日、新しいお得な情報が届く可能性があります</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ヒントカード */}
          <Card className="shadow-lg border-0" style={{ backgroundColor: '#F7F4F4' }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className="rounded-full p-2" style={{ backgroundColor: '#F1B300' }}>
                  {/* ヒントカードのアイコン(lucide-reactのヒントカードアイコン) */}
                  <span className="text-white text-sm"><Info className="w-5 h-5" /></span>
                </div>
                <h3 className="font-semibold" style={{ color: '#563124' }}>お役立ち情報</h3>
              </div>
              <div className="mb-6 text-sm text-gray-600">
                <p>• 郵便番号（7桁）を入力すると住所が自動で入力されます</p>
                <p>• 住所を登録すると、近隣店舗のお得な情報やタイムセールが表示されます</p>
                <p>• プロファイル情報は安全に暗号化されて保存されます</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthGuard>
  )
}
