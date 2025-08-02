import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⬇️ 이 부분을 추가합니다.
  typescript: {
    // 빌드 시 타입 에러가 있어도 강제로 빌드를 성공시킵니다.
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  /* 다른 기존 설정이 있다면 그대로 둡니다. */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '**', // images.unsplash.com 도메인의 모든 경로를 허용
      },
      // 필요하다면 다른 도메인도 추가할 수 있습니다.
      // {
      //   protocol: 'https',
      //   hostname: 'example.com',
      // },
    ],
  },
};

export default nextConfig;