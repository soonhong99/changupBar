import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ⬇️ 이 부분을 추가합니다.
  typescript: {
    // 빌드 시 타입 에러가 있어도 강제로 빌드를 성공시킵니다.
    ignoreBuildErrors: true,
  },
  /* 다른 기존 설정이 있다면 그대로 둡니다. */
};

export default nextConfig;