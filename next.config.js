const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: process.env.ANALYZE === "true",
})

module.exports = withBundleAnalyzer({
    staticPageGenerationTimeout: 1000,
    async rewrites() {
        const server = process.env.NEXT_PUBLIC_NODE_ENDPOINT;

        return [
            {
                source: '/api/:slug*',
                destination: server + '/:slug*',
            },
        ];
    },
})
