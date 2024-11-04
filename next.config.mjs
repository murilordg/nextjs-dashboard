/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        ppr: 'incremental',
    },
    images: {
        domains: ['images.unsplash.com'],
    },
};

export default nextConfig;

