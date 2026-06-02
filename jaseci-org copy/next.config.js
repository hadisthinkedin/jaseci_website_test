/** @type {import('next').NextConfig} */
const nextConfig = {
  // You might have other configurations here
  reactStrictMode: true,

  // Add the images configuration below
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.jaseci.org",
        port: "",
        pathname: "/wp-content/uploads/**", // This is optional but recommended for security
      },
      {
        protocol: "https",
        hostname: "img.youtube.com",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
  },
};

module.exports = nextConfig;
