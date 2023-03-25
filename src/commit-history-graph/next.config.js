/** @type {import('next').NextConfig} */
const path = require('path');
const fs = require('fs');

const sampleSettingsPath = './.env.local.sample';
const settingsPath = './env.local';

const getLocalSettings = async () => {
  let localSettings = {};

  try 
  {
    const localSettingsFile = await fs.promises.readFile(settingsPath);
    const variables = localSettingsFile.toString().split('\n');

    variables.forEach(variable => {    
      localSettings[variable.split('='[0])] = variable.split('='[1]);
    });

    return localSettings;
  } 
  catch (ex) 
  {
    if (!fs.existsSync(settingsPath)) 
    {
      const data = await fs.promises.readFile(sampleSettingsPath);
      const localSettingsFile = data.toString();
  
      await fs.promises.writeFile(settingsPath, localSettingsFile); 

      variables.forEach(variable => {    
        localSettings[variable.split('='[0])] = variable.split('='[1]);
      });

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