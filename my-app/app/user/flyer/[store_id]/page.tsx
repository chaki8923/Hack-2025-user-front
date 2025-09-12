"use client"

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import AuthGuard from '@/components/AuthGuard'
import { useAuth } from '@/hooks/useAuth'
import { Loader2, AlertCircle, FileImage, Store, Calendar, ArrowLeft, Clock, Package, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

// 型定義
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

interface FlyerResponse {
  id: string;
  store_id: string;
  image_data: string;
  flyer_data: FlyerData | null;
  display_expiry_date: string | null;
  created_at: string;
}

export default function UserFlyerPage() {
  const params = useParams()
  const storeId = params.store_id as string
  const { user } = useAuth()

  const [flyerDataList, setFlyerDataList] = useState<FlyerResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 期限状況を判定するヘルパー関数
  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    const expiryDateOnly = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate());
    const nowDateOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffDays = Math.ceil((expiryDateOnly.getTime() - nowDateOnly.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', text: '期限切れ', color: 'text-red-600 bg-red-100' };
    } else if (diffDays === 0) {
      return { status: 'today', text: '本日期限切れ', color: 'text-orange-600 bg-orange-100' };
    } else if (diffDays === 1) {
      return { status: 'tomorrow', text: '明日期限切れ', color: 'text-yellow-600 bg-yellow-100' };
    } else if (diffDays <= 3) {
      return { status: 'warning', text: `${diffDays}日後に期限切れ`, color: 'text-yellow-600 bg-yellow-100' };
    } else {
      return { status: 'active', text: `${diffDays}日後に期限切れ`, color: 'text-green-600 bg-green-100' };
    }
  };

  // 期限の日時を表示用にフォーマットするヘルパー関数
  const formatExpiryDate = (expiryDate?: string) => {
    if (!expiryDate) return null;
    const date = new Date(expiryDate);
    return date.toLocaleString('ja-JP', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // フライヤービューを記録する関数
  const recordFlyerView = async (flyerId: string) => {
    if (!user?.id) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
      await fetch(`${baseUrl}/api/v1/flyer/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flyer_id: flyerId,
          user_id: user.id,
        }),
      });
      // エラーがあっても画面表示には影響させない（ビュー記録は非表示での処理）
    } catch (error) {
      console.warn('フライヤービューの記録に失敗しました:', error);
    }
  };



  useEffect(() => {
    if (!storeId) return;

    const fetchFlyerData = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/flyer/all/${storeId}`);
        if (!response.ok) {
          throw new Error('データの取得に失敗しました。');
        }
        const result = await response.json();
        
        // データが配列として返される
        const flyerData = Array.isArray(result.data) ? result.data : [];
        setFlyerDataList(flyerData);

        // 各フライヤーのビューを記録
        if (user?.id && flyerData.length > 0) {
          flyerData.forEach((flyer: FlyerResponse) => {
            recordFlyerView(flyer.id);
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFlyerData();
  }, [storeId, user?.id]);

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex justify-center items-center" style={{ background: 'linear-gradient(135deg, #F7F4F4, #FFFFFF)' }}>
          <Card className="w-full max-w-md mx-4">
            <CardContent className="flex flex-col items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mb-4" style={{ color: '#F1B300' }} />
              <p className="text-gray-600">チラシ情報を読み込み中...</p>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  if (error) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex justify-center items-center" style={{ background: 'linear-gradient(135deg, #F7F4F4, #FFFFFF)' }}>
          <Card className="w-full max-w-md mx-4">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">エラーが発生しました</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="text-white font-medium rounded-xl"
                style={{ backgroundColor: '#F1B300' }}
              >
                再読み込み
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  if (flyerDataList.length === 0) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex justify-center items-center" style={{ background: 'linear-gradient(135deg, #F7F4F4, #FFFFFF)' }}>
          <Card className="w-full max-w-md mx-4">
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#F7F4F4' }}>
                <FileImage className="w-8 h-8" style={{ color: '#563124' }} />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">チラシがありません</h2>
              <p className="text-gray-600 mb-6">この店舗にはまだチラシが登録されていません。</p>
              <Button 
                asChild 
                className="text-white font-medium rounded-xl"
                style={{ backgroundColor: '#F1B300' }}
              >
                <Link href="/user/profile">プロフィールに戻る</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="min-h-screen pb-24" style={{ background: 'linear-gradient(135deg, #F7F4F4, #FFFFFF)' }}>
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                asChild
                className="flex items-center space-x-2"
                style={{ borderColor: '#563124', color: '#563124' }}
              >
                <Link href="/user/profile">
                  <ArrowLeft className="w-4 h-4" />
                  <span>プロフィールに戻る</span>
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: '#563124' }}>店舗チラシ</h1>
                <p className="text-gray-600 mt-1">
                  {flyerDataList[0]?.flyer_data?.store?.name && `${flyerDataList[0].flyer_data.store.name} - `}
                  {flyerDataList.length}件のチラシ
                </p>
              </div>
            </div>
          </div>

          {/* チラシ一覧 */}
          <div className="space-y-8">
            {flyerDataList.map((flyerData, flyerIndex) => {
              if (!flyerData.flyer_data) return null;
              
              const { flyer_data, image_data, created_at } = flyerData;
              const { campaign, store, flyer_items } = flyer_data;

              return (
                <Card key={flyerData.id} className="shadow-lg overflow-hidden">
                  <CardHeader 
                    className="text-white"
                    style={{ background: 'linear-gradient(135deg, #563124, #F1B300)' }}
                  >
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileImage className="w-6 h-6" />
                        <div>
                          <h2 className="text-xl font-bold">
                            {campaign.name || `チラシ #${flyerIndex + 1}`}
                          </h2>
                          <p className="text-white/80 text-sm">
                            登録日: {new Date(created_at).toLocaleDateString('ja-JP')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 text-white/80 text-sm">
                          <Store className="w-4 h-4" />
                          <span>{store.name}</span>
                        </div>
                        {campaign.start_date && (
                          <div className="flex items-center space-x-2 text-white/80 text-sm mt-1">
                            <Calendar className="w-4 h-4" />
                            <span>{campaign.start_date} 〜 {campaign.end_date}</span>
                          </div>
                        )}
                        {flyerData.display_expiry_date && (
                          <div className="flex items-center space-x-2 text-white/80 text-sm mt-1">
                            <Clock className="w-4 h-4" />
                            <span>表示期限: {formatExpiryDate(flyerData.display_expiry_date)}</span>
                          </div>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* 表示期限ステータス */}
                    {flyerData.display_expiry_date && (() => {
                      const expiryStatus = getExpiryStatus(flyerData.display_expiry_date);
                      return expiryStatus ? (
                        <Badge className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${expiryStatus.color}`}>
                          <Clock className="w-4 h-4" />
                          {expiryStatus.text}
                        </Badge>
                      ) : null;
                    })()}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* チラシ画像 */}
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <FileImage className="w-5 h-5" style={{ color: '#563124' }} />
                          <h3 className="text-lg font-semibold text-gray-800">チラシ画像</h3>
                        </div>
                        <div 
                          className="relative rounded-xl overflow-hidden border-2 bg-white shadow-sm"
                          style={{ borderColor: '#F1B300' }}
                        >
                          <Image
                            src={`data:image/png;base64,${image_data}`}
                            alt={`チラシ ${flyerIndex + 1}`}
                            width={500}
                            height={707}
                            className="w-full h-auto object-contain max-h-96"
                          />
                        </div>
                      </div>

                      {/* 商品情報 */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Package className="w-5 h-5" style={{ color: '#563124' }} />
                            <h3 className="text-lg font-semibold text-gray-800">掲載商品</h3>
                          </div>
                          <Badge 
                            className="px-3 py-1 rounded-full text-sm font-medium"
                            style={{ backgroundColor: '#F7F4F4', color: '#563124' }}
                          >
                            {flyer_items.length}商品
                          </Badge>
                        </div>
                        
                        {flyer_items.length > 0 ? (
                          <div className="bg-gray-50 rounded-xl p-4 max-h-96 overflow-y-auto">
                            <div className="space-y-3">
                              {flyer_items.map((item: FlyerItem, index: number) => (
                                <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                      <p className="text-sm text-gray-500">{item.product.category}</p>
                                      {item.restriction_note && (
                                        <p className="text-xs mt-1" style={{ color: '#563124' }}>{item.restriction_note}</p>
                                      )}
                                    </div>
                                    <div className="text-right ml-4">
                                      <p className="font-semibold text-gray-900">
                                        ¥{item.price_excluding_tax.toLocaleString()}
                                      </p>
                                      <p className="text-sm text-gray-500">{item.unit}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="bg-gray-50 rounded-xl p-8 text-center">
                            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600">商品情報がありません</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* フッターアクション */}
          <div className="mt-8 flex justify-center">
            <Button 
              asChild 
              className="text-white font-medium rounded-xl"
              style={{ backgroundColor: '#F1B300' }}
            >
              <Link href="/user/profile" className="flex items-center justify-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>プロフィールに戻る</span>
              </Link>
            </Button>
          </div>
        </div>


      </div>
    </AuthGuard>
  );
}
