import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/user/',
          '/api/',
          '/auth/reset-password',
          '/auth/forgot-password',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/user/',
          '/api/',
          '/auth/reset-password',
          '/auth/forgot-password',
        ],
      },
    ],
    sitemap: 'https://www.meguru-food.jp/sitemap.xml',
    host: 'https://www.meguru-food.jp',
  }
}
