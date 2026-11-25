import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@opsway/shell"],
  async rewrites() {
    return [
      {
        source: "/v1/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/v1/:path*`,
      },
      {
        source: "/loki/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/loki/:path*`,
      },
      {
        source: "/mcp",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/mcp`,
      },
      {
        source: "/mcp/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8080"}/mcp/:path*`,
      },
    ];
  },
};

export default nextConfig;
