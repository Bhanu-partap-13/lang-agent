import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Server-side env vars to make available at build time.
   * NEXT_PUBLIC_API_URL is exposed to the browser bundle;
   * override it in .env.local or your hosting provider.
   */
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
  },

  /**
   * Allow images from the FastAPI server and any external CDNs.
   * Add additional hostnames here as needed.
   */
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
