/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const sampleSettingsPath = './local.settings.sample.js';
const settingsPath = './local.settings.js';

const getLocalSettings = async () => {
  try 
  {
    const localSettings = require(settingsPath);

    return localSettings;
  } 
  catch (ex) 
  {
    if (!fs.existsSync(sampleSettingssettingsPathPath)) 
    {
      const data = await fs.promises.readFile(sampleSettingsPath);
      const localSettings = data.toString();
  
      await fs.promises.writeFile(settingsPath, localSettings); 
      
      return localSettings;
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