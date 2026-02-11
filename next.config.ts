/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ol', 'rlayers'],
  // webpack: fallback for legacy if needed
  webpack: (config: { resolve: { alias: { [x: string]: string } } }) => {
    config.resolve.alias['ol/proj'] = 'ol/proj.js'
    return config
  }
}

module.exports = nextConfig
