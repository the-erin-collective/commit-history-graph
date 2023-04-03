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
