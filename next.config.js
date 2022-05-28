const Package = require('./package.json')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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