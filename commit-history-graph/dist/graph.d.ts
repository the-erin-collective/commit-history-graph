export interface DayData {
    date: Date,
    commits: number
}

export interface Options 
{
  login: string;
  accessToken: string;
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
export interface QueryVariables {
    identifier: string,
    startDate: string,
    endDate: string
}

export interface UserContributionsResponse {
    data: {
      user: User;
    };
  }
  
  interface User {
    email: string;
    createdAt: string;
    contributionsCollection: ContributionsCollection;
  }
  
  interface ContributionsCollection {
    contributionCalendar: ContributionCalendar;
  }
  
  interface ContributionCalendar {
    totalContributions: number;
    weeks: Week[];
  }
  
  interface Week {
    contributionDays: ContributionDay[];
  }
  
  interface ContributionDay {
    weekday: number;
    date: string;
    contributionCount: number;
    contributionLevel: string;
  }

export interface WeeklyCommits 
{
    DailyCommits: DailyCommit[];
}

export interface DailyCommit 
{
    dateOfCommit: Date;
    dayOfWeek: number;
    weekNumber: number;
    commits: number;
    color: ColorConfig;
}

