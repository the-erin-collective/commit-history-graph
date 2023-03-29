export interface EnvironmentConfig 
{
  clientId: string;
  clientSecret: string;
  accessToken: string;
  nameLookup: string[];
  emailLookup: string[];
  isOrg: boolean;
  startOnSunday: boolean;
  colors: ColorConfig[];
}

export interface ColorConfig 
{
  minValue: number;
  maxValue: number | null;
  level: number;
  hex: string;
}

export type CustomEnvironment = NodeJS.ProcessEnv & EnvironmentConfig;