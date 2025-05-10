import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/,
            use: ['@svgr/webpack'],
        });
        return config;
    },
    output: 'standalone',
    reactStrictMode: true,
    compress: true,
};

export default nextConfig;
