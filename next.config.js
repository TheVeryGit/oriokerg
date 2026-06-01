/** @type {import('next').NextConfig} */
const withExportImages = require("next-export-optimize-images");

module.exports = withExportImages({
  output: "export",
  // Emit `route/index.html` instead of `route.html` so a plain static host
  // (Timeweb) serves extensionless URLs like /kittens/<slug>/ reliably.
  trailingSlash: true,
});
