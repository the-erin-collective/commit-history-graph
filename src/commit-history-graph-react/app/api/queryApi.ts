
import axios from "axios";
import { ColorConfig, EnvironmentConfig } from '../../local.config';
import CacheService from './../services/CacheService';
import UserContributionsResponse from '@app/userContributionsResponse'
import { DailyCommit, WeeklyCommits } from "@app/weeklycommits";
import { QueryVariables } from "@app/queryVariables";

import ConfigService from './configService';

const config: EnvironmentConfig = ConfigService.fetchConfig();
const legend: ColorConfig[] = ConfigService.fetchLegend();

const _userContributionsRequestHeaders = {
  'Content-Type': 'application/json',
  'Authorization': 'bearer ' + config.accessToken
};

const _apiEndpoint = 'https://api.github.com/graphql';

const _userContributionsQuery: string = `query($identifier: String!, $startDate: DateTime!, $endDate: DateTime!) { 
  user(login: $identifier) {
    email
    createdAt
    contributionsCollection(from: $startDate, to: $endDate) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            weekday
            date 
            contributionCount 
            contributionLevel
          }
        }
      }
    }
  }
}`;

const _now = new Date(Date.UTC(
  new Date().getUTCFullYear(),
  new Date().getUTCMonth(),
  new Date().getUTCDate(),
  new Date().getUTCHours(),
  new Date().getUTCMinutes(),
  new Date().getUTCSeconds(),
  new Date().getUTCMilliseconds()
));

const daysUntilWeekEnds = 6 - _now.getDay() + (config.startOnSunday ? 0 : 1);
const dayThisWeekEnds = new Date(new Date().setDate(_now.getDate() + (daysUntilWeekEnds == 7 ? 0 : daysUntilWeekEnds)));
const _endDate = new Date(Date.UTC(dayThisWeekEnds.getFullYear(), dayThisWeekEnds.getMonth(), dayThisWeekEnds.getDate(), 23, 59, 59, 999));
const previousYear = new Date(Date.UTC(_endDate.getFullYear() - 1, _endDate.getMonth(), _endDate.getDate(), 0, 0, 0, 0));
const _startDate = addDays(previousYear, 1);

let octokit: any = null;

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

async function fetchCommits(): Promise<WeeklyCommits[]>
{
  let commits: Array<DailyCommit> = [];

  if(config.isOrg)
  {
   // let commitsResponse = await octokit.request('GET /orgs/:org/events', {
  //   org: nameLookup
 //  });
  }
  else
  {  
    let results =  await requestUserContributions();

    results.forEach(result => {
      result.data.user.contributionsCollection.contributionCalendar.weeks.forEach(week => {
        week.contributionDays.forEach(contributionDay => {
          const contributionDate_UTC = new Date(contributionDay.date);
          const contributionDate = new Date(Date.UTC(
            contributionDate_UTC.getUTCFullYear(),
            contributionDate_UTC.getUTCMonth(),
            contributionDate_UTC.getUTCDate(),
            contributionDate_UTC.getUTCHours(),
            contributionDate_UTC.getUTCMinutes(),
            contributionDate_UTC.getUTCSeconds(),
            contributionDate_UTC.getUTCMilliseconds()
          ));
          
          commits.push({
            commits: contributionDay.contributionCount,
            dateOfCommit: contributionDate,
            dayOfWeek: 0,
            weekNumber: 0
          });
        })
      })
    });
  }

  let weeklyCommits: WeeklyCommits[] = [];
  const weekCount = 53;

  let mondayOffset = (config.startOnSunday ? -5 : 1);
  let dayOffset = _now.getDay();

  for (let week = 0; week < weekCount; week++) 
  {
    let thisWeek: WeeklyCommits = {
      DailyCommits: []
    };

    for (let day = 6; day >= 0; day--) 
    {
      // if today is sunday, offset = 0, if today is monday, offset = 1, if today is tuesday, offset = 2
      const daysBehind = ((week) * 7) + (day - 1);

      const dateBehind_UTC = new Date(new Date().setDate(_now.getDate() - daysBehind - dayOffset - mondayOffset));
      const dateBehind = new Date(Date.UTC(dateBehind_UTC.getUTCFullYear(), dateBehind_UTC.getUTCMonth(), dateBehind_UTC.getUTCDate(), new Date().getUTCHours(), dateBehind_UTC.getUTCMinutes(), dateBehind_UTC.getUTCSeconds(), dateBehind_UTC.getUTCMilliseconds()));

      if(isFuture(_now, dateBehind) || isBefore(_startDate, dateBehind))
      {
        thisWeek.DailyCommits.push({
        dateOfCommit: dateBehind,
        dayOfWeek: day,
        weekNumber: week,
        commits: -1
        });
        continue;
      }
      
      const todaysCommitCount = commits
        .filter(commit => {
          const commitDate = new Date(Date.UTC(commit.dateOfCommit.getUTCFullYear(), commit.dateOfCommit.getUTCMonth(), commit.dateOfCommit.getUTCDate()));

          return isSameDay(commitDate, dateBehind);
        })
        .reduce((total, commit) => total + commit.commits, 0);

      thisWeek.DailyCommits.push({
        dayOfWeek: day,
        weekNumber: week,
        dateOfCommit: dateBehind,
        commits: todaysCommitCount,
      });
    }

    weeklyCommits.push(thisWeek);
  } 

  return weeklyCommits;
}


function isBefore(beforeDate: Date, testDate: Date)
{
  if(isSameDay(beforeDate, testDate))
  {
    return false;
  }

  if(beforeDate > testDate)
  {
    return true;
  }

  return false;
}

function isFuture(nowDate: Date, testDate: Date)
{
  if(isSameDay(nowDate, testDate))
  {
    return false;
  }

  if(testDate > nowDate)
  {
    return true;
  }

  return false;
}

function isSameDay(firstDate: Date, testDate: Date)
{
  const sameDay = firstDate.getUTCDate() === testDate.getUTCDate() &&
    firstDate.getUTCMonth() === testDate.getUTCMonth() &&
    firstDate.getUTCFullYear() === testDate.getUTCFullYear();

  return sameDay;
}

async function requestUserContributions(): Promise<UserContributionsResponse[]>
{
  let _userContributionsVariables: QueryVariables[] = [];

  config.nameLookup.forEach(loginName => {
    _userContributionsVariables.push({
      identifier: loginName,
      startDate: _startDate.toISOString(),
      endDate: _endDate.toISOString(),
    });
  });

  const dataResults = await Promise.all(
      _userContributionsVariables.map(async (variables) => {
        const result = await fetchData(
          _userContributionsRequestHeaders,
          variables.identifier,
          _userContributionsQuery,
          variables
        );

        return result;
      })
    );

  const combinedData: UserContributionsResponse[] = dataResults.flat().map(result => {
      if(result.length == 0)
      {
        return null;
      }
        return JSON.parse(result)
      }
    );

  return combinedData;
}

async function fetchData(headers: { 'Content-Type': string; Authorization: string; }, queryIdentifier: string, query: string, variables: QueryVariables): Promise<string>
{
  let results = "";
   
  let response = await CacheService.GetResponse('userContributions-' + queryIdentifier);

  if(response != null)
    return response;

  await axios.post(_apiEndpoint, {
    query: query,
    variables: variables,
  }, {
    headers: headers,
  })
  .then((response) => {
    results = JSON.stringify(response.data);
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

  await CacheService.SaveResponse('userContributions-' + queryIdentifier, results);

  return results;
}

export default {
  fetchCommits: fetchCommits
}