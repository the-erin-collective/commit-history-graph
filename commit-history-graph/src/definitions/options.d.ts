export interface Options 
{
  login: string;
  accessToken: string;
  startOnSunday: boolean;
  colors: ColorConfig[] | null;
}

export interface ColorConfig 
{
  minValue: number;
  maxValue: number | null;
  level: number;
  hex: string;
}