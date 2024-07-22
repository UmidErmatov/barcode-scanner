/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    output: 'standalone',
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb'
        }
    }
};

export default nextConfig;
