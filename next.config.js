const env = require("dotenv").config({
  path: require("path").join(__dirname, ".env.local"),
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: env.parsed,
  reactStrictMode: true,
  output: "standalone",
};

module.exports = nextConfig;
