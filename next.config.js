/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['chromeunboxed.com', 'user-images.githubusercontent.com', 'lh3.googleusercontent.com', 'res.cloudinary.com']
  },
  experimental: {
    appDir: true,
  }
}
