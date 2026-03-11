const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    "@lurnt/ai",
    "@lurnt/api",
    "@lurnt/ui",
    "@lurnt/domain",
    "@lurnt/database",
    "@lurnt/data-access",
    "@lurnt/domain-services",
    "@lurnt/email",
    "@lurnt/utils",
  ],
};

module.exports = nextConfig;
