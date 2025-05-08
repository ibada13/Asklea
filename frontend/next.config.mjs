/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'fedskillstest.ct.digital',
          pathname: '/**',
        },
      ]    
  },
  experimental: {
      optimizeCss: true, 
  },
};

export default nextConfig;
