/** @type {import('next').NextConfig} */
const path = require('path');
const localSettings = require('./local.settings');

const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: localSettings,
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
