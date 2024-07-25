import withPWAInit from "@ducanh2912/next-pwa";

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

const withPWA = withPWAInit({
    dest: "public",
    cacheOnFrontEndNav: true,
    aggressiveFrontEndNavCaching: true,
    reloadOnOnlineNav: true,
    disabled: true,
    workboxOptions: {
        disableDevLogs: true
    }
});


export default withPWA(nextConfig);

