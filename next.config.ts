// const withPWA = require('@ducanh2912/next-pwa').default({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === 'development'
// })

// module.exports = withPWA({
//   // Your Next.js config
//   reactStrictMode: true
// })

const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['ol', 'rlayers'],
  webpack: (config: { resolve: { alias: { [x: string]: string } } }) => {
    config.resolve.alias['ol/proj'] = 'ol/proj.js'
    return config
  }
}

module.exports = withPWA(nextConfig)
