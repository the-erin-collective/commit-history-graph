export interface EnvironmentConfig {
  clientId: string;
  clientSecret: string;
  accessToken: string;
  nameLookup: string[];
  emailLookup: string[];
  isOrg: boolean;
}

export type CustomEnvironment = NodeJS.ProcessEnv & EnvironmentConfig;