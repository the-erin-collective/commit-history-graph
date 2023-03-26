/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const sampleSettingsPath = './local.settings.sample.json';
const settingsPath = './local.settings.json';

const getLocalSettings = async () => {
  try 
  {
    const localSettingsFile = await fs.promises.readFile(settingsPath, 'utf-8');
  
    const config = JSON.parse(localSettingsFile);

    return config;
  } 
  catch (ex) 
  {
    if (!fs.existsSync(settingsPath)) 
    {
      const localSettingsFile = await fs.promises.readFile(sampleSettingsPath, 'utf-8');

      await fs.promises.writeFile(settingsPath, localSettingsFile); 

      const config = JSON.parse(localSettingsFile);

      return config;
    }
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