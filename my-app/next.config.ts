import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ここも時期にdomainを見えないようにenvで管理してenvのように持ってくる
  images: {
    domains: ["video.kurashiru.com", "pub-608156fee9814c35ad00d461a390e841.r2.dev", "example.com"],
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
  },
};

export default nextConfig;
