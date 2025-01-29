import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  env: {
    REACT_APP_BASE_URL: process.env.REACT_APP_BASE_URL,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
