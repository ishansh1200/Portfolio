const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  scope: "/",
  sw: "service-worker.js",
});

/**
 * @type {import('next').NextConfig}
 */
const config = withPWA({
  output: "export", // Ensure static export
  reactStrictMode: true,

  // Only use if you're not using the new app directory
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
});

module.exports = config;
