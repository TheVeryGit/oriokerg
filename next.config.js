/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Emit `route/index.html` instead of `route.html` so a plain static host
  // (Timeweb) serves extensionless URLs like /kittens/<slug>/ reliably.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
