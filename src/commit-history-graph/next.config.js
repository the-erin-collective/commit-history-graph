/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const getLocalSettings = async () => {
  try 
  {
    const localSettings = require('./local.settings');

    return localSettings;
  } 
  catch (ex) 
  {
    const data = await fs.promises.readFile('./local.settings.sample.js');
    const localSettings = data.toString();

    await fs.promises.writeFile("./local.settings.js", localSettings); 
    
    return localSettings;
  }
}

module.exports = async function() {
  const localSettings = await getLocalSettings();
  
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

  return nextConfig;
}