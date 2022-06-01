const Package = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    })
    return config
  },
  distDir: (() => {
    if (process.env.npm_lifecycle_event === 'dist') {
      return 'build/.next'
    } else {
      return '.next'
    }
  })(),
  publicRuntimeConfig: {
    version: Package.version
  }
}

module.exports = nextConfig