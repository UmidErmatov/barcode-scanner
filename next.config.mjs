/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    experimental: {
        serverActions: {
            bodySizeLimit: '10mb'
        },
    }
};

export default nextConfig;
