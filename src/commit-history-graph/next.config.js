/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  experimental: {
    appDir: true,
  },
  env : {
    isOrg : false,
    nameLookup: 'your-user-name',
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret'
  },
  compress: false,
  productionBrowserSourceMaps: true,
  swcMinify: false,
  webpack: (config,
    {buildId, dev, isServer, defaultLoaders, nextRuntime, webpack}
    ) => {
      config.optimization.minimize = false;
      config.resolve.alias.react = path.resolve('./node_modules/react');
      config.module.rules.push(
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader']
        }
      );
      return config;
  },
}

module.exports = nextConfig
