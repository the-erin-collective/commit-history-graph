
import axios from "axios";
import { Octokit } from "@octokit/core";
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import { ColorConfig, EnvironmentConfig } from '../../local.config';
import CacheService from '../services/CacheService';
import { Commit } from "@app/commit";
import { ResponseEvent, ResponseEventCommit } from "@app/responseEvent";
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

const _userContributionsQuery: string = `query { 
  user(login: $username) {
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

const _now = new Date();
const _endDate = new Date(_now.getFullYear(), _now.getMonth(), _now.getDate(), 23, 59, 59, 999); 
const _startDate = new Date(_now.getFullYear() - 1, _now.getMonth(), _now.getDate(), 0, 0, 0, 0); 

let octokit: any = null;

async function fetchCommits(): Promise<WeeklyCommits[]>
{
  let commits: Array<Commit> = [];



  if(config.isOrg)
  {
   // let commitsResponse = await octokit.request('GET /orgs/:org/events', {
  //   org: nameLookup
 //  });
  }
  else
  {
   
    
    let results =  await requestUserContributions();

  //  commits = await requestUserEventCommits();

//    const repos = await requestRepos();

 //   const repoCommits = await requestRepoCommits(repos);

 //   commits.push(...repoCommits);
  }

  let weeklyCommits: WeeklyCommits[] = [];
  const weekCount = 54;

  let mondayOffset = (config.startOnSunday ? 1 : 0);
  let dayOffset = _now.getDay();

  // today need to make sure the dates match up with the weekday of the commit

  for (let week = 0; week < weekCount; week++) 
  {
    let thisWeek: WeeklyCommits = {
      DailyCommits: []
    };

    for (let day = 6; day >= 0; day--) 
    {
      // if today is sunday, offset = 0, if today is monday, offset = 1, if today is tuesday, offset = 2
      const daysBehind = ((week - 1) * 7) + (day - 1);

      const dateBehind = new Date(new Date().setDate(_now.getDate() - daysBehind - dayOffset - mondayOffset));

      if(isFuture(now, dateBehind))
      {
        thisWeek.DailyCommits.push({
        dateOfCommit: dateBehind,
        dayOfWeek: day,
        weekNumber: week,
        commits: -1,
        repos: 0
        });
        continue;
      }

      let repos: Array<string> = [];

      const todaysCommitCount = commits.filter(commit => {
        const commitDate = new Date(commit.date);

        const sameDay = commitDate.getDate() === dateBehind.getDate() &&
            commitDate.getMonth() === dateBehind.getMonth() &&
            commitDate.getFullYear() === dateBehind.getFullYear();

        if(sameDay && !repos.includes(commit.repo))
        {
          repos.push(commit.repo);
        }

        return (
          sameDay
        );
      })
      .map(commit => 1)
      .reduce((total, num) => total + num, 0);

      thisWeek.DailyCommits.push({
        dayOfWeek: day,
        weekNumber: week,
        dateOfCommit: dateBehind,
        commits: todaysCommitCount,
        repos: repos.length
      });
    }

    weeklyCommits.push(thisWeek);
  } 

  return weeklyCommits;
}

function isFuture(nowDate: Date, testDate: Date)
{
  // is today
  if(testDate.getFullYear() == nowDate.getFullYear() && testDate.getMonth() == nowDate.getDate() && testDate.getDate() == testDate.getDate())
  {
    return false;
  }

  if(testDate > nowDate)
  {
    return true;
  }

  return false;
}

async function requestUserContributions() 
{
  let _userContributionsVariables: QueryVariables[] = [];

  config.nameLookup.forEach(loginName => {
    _userContributionsVariables.push({
      identifier: loginName,
      startDate: _startDate.toISOString(),
      endDate: _endDate.toISOString(),
    });
  });

  const dataResults = await Promise.all(_userContributionsVariables.map(variables => fetchData(_userContributionsRequestHeaders, _userContributionsQuery, variables)));

  const combinedData = dataResults.flat();

  return combinedData;
}

async function fetchData(headers: { 'Content-Type': string; Authorization: string; }, query: string, variables: QueryVariables): Promise<string>
{
  let results = "";
   
  axios.post(_apiEndpoint, {
    query: query,
    variables: variables,
  }, {
    headers: headers,
  })
  .then((response) => {
    console.log(response.data);

    results = response.data;
  })
  .catch((error) => {
    console.error('Error:', error.message);
  });

  return results;
}

export default {
  fetchCommits: fetchCommits
}