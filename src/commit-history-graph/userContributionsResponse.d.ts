interface UserContributionsResponse {
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
    color: string;
  }

export default UserContributionsResponse;