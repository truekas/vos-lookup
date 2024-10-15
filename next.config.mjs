/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      "api.imagequix.com",
      "c.tenor.com",
    ]
  }
}

export default nextConfig
