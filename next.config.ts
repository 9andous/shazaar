import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: __dirname },
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Mock phase only: photos outside the dev subset load from the live origin.
    remotePatterns: [{ protocol: "https", hostname: "www.shazaar.tn", pathname: "/storage/property-images/**" }],
    deviceSizes: [360, 480, 640, 768, 1080, 1280, 1600, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
