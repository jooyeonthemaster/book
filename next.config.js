/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  // 모바일 성능 최적화 (optimizeCss 제거 - 호환성 문제)
  // 압축 최적화
  compress: true,
  // 정적 최적화
  trailingSlash: false,
  // 빌드 최적화
  swcMinify: true,
}

module.exports = nextConfig
