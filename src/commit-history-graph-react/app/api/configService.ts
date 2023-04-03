import { ColorConfig, EnvironmentConfig } from '../../local.config';
const config: EnvironmentConfig = require('../../local.settings.json');

function fetchLegend()
{
  let colorLegend: ColorConfig[] = config.colors;

  return colorLegend;
}

function fetchConfig()
{
  return config;
}

export default {
  fetchLegend: fetchLegend,
  fetchConfig: fetchConfig
}