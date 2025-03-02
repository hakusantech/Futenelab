/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ビルド時の型チェックを無効化
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 