import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /**
     * EVOX serves licensed stills from its own CloudFront distribution, so those
     * hosts must be allow-listed for next/image to optimise them. The Wikimedia
     * Commons photographs are downloaded into `public/vehicles/` by
     * `scripts/fetch-car-photos.mjs` and need no entry here.
     */
    remotePatterns: [
      { protocol: "https", hostname: "cdn.imagin.studio" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.evoximages.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
      { protocol: "https", hostname: "*.evoxstock.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "commons.wikimedia.org" },
      { protocol: "https", hostname: "thumb.wikimedia.org" },
    ],
  },
};

export default nextConfig;
