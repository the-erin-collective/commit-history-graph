
import axios from "axios";
import { Octokit } from "@octokit/core";
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import { EnvironmentConfig } from '../../local.config';
import CacheService from '../services/CacheService';
import { Commit } from "@app/commit";
import { ResponseEvent, ResponseEventCommit } from "@app/responseEvent";
const config: EnvironmentConfig = require('../../local.settings.json');

const _nameLookupList: Array<string> = config.nameLookup;
const _emailLookupList: Array<string> = config.emailLookup;
const _isOrg: boolean = config.isOrg;
const _clientId: string = config.clientId;
const _clientSecret: string = config.clientSecret;
const _accessToken: string = config.accessToken;
const _userEventEndpoint: string = "GET /users/:username/events";
const _userReposEndpoints : string = "GET /user/repos";
const _repoCommitsEndpoint: string = "GET /repos/:owner/:repo/commits";

let octokit: any = null;

async function fetchCommits()
{
  let flattenedCommits: Array<Commit> = [];

  const url = "";

  if(_isOrg)
  {
   // let commitsResponse = await octokit.request('GET /orgs/:org/events', {
  //   org: nameLookup
 //  });
  }
  else
  {
    flattenedCommits = await requestUserEventCommits();

    const repos = await requestRepos();

    const repoCommits = await requestRepoCommits(repos);

    flattenedCommits.push(...repoCommits);
  }

  let weeklyCommits: any = [];
  const weekCount = 54;
  const now = new Date();
  let dayOffset = now.getDay();

  for (let week = 1; week <= weekCount; week++) 
  {
    const dailyCommits = [];
    for (let day = 1; day <= 7; day++) 
    {
        if(week == 1 && day <= dayOffset)
        {
          dailyCommits.push({
            dayOfWeek: day,
            weekNumber: week,
            commits: 0
          });
          continue;
        }

        const daysBehind = ((week - 1) * 7) + (day - 1) - dayOffset;
        const dateBehind = new Date(new Date().setDate(now.getDate() - daysBehind));

        let todaysCommitCount = 0;

        dailyCommits.push({
          dayOfWeek: day,
          weekNumber: week,
          dateOfCommit: dateBehind,
          commits: todaysCommitCount
        });
    }

    weeklyCommits.push(dailyCommits);
  } 

  return weeklyCommits;
}

async function doAuth()
{
  const auth = createOAuthAppAuth({
    clientType: "oauth-app",
    clientId: _clientId,
    clientSecret: _clientSecret
  });
  
  const appAuthentication = await auth({
    type: "oauth-app"
  });
  
  octokit = new Octokit({ auth: _accessToken });
}

async function requestUserEventCommits() {
  if (octokit == null) 
  {
    await doAuth();
  }

  const commitsList = await Promise.all(
    _nameLookupList.map(async (username) => {
      let commits: Array<Commit> = [];
        
      let eventResponse: any = await CacheService.GetResponse(_userEventEndpoint);

      if (eventResponse == null) 
      {
        eventResponse = await octokit.request(_userEventEndpoint, {
          username: username,
        });

        if (eventResponse == null) 
        {
          throw "no response from " + _userEventEndpoint;
        }

        CacheService.SaveResponse(_userEventEndpoint, eventResponse);

        eventResponse.data.forEach((event: ResponseEvent) => {
          if (event.type == "PushEvent") 
          {
            if (event.payload != null && event.payload.commits != null) 
            {
              event.payload.commits.forEach((commit: ResponseEventCommit) => {
                let login = "";

                if (commit.actor == null || commit.actor.login == null) 
                {
                  login = username;
                } 
                else 
                {
                  login = commit.actor.login;
                }

                const newCommit: Commit = {
                  date: event.created_at,
                  email: commit.author.email,
                  login: login,
                };

                if (_emailLookupList.includes(newCommit.email) || _nameLookupList.includes(newCommit.login)) 
                {
                  commits.push(newCommit);
                }
              });
            }
          }
        });
      }

      return commits;
    })
  );

  const commits = commitsList.flat();
  return commits;
}

async function requestRepos()
{
  if(octokit == null)
  {
    await doAuth();
  }

  let reposResponse: any = await CacheService.GetResponse(_userReposEndpoints);
 
  if(reposResponse == null)
  {
    reposResponse = await octokit.request(_userReposEndpoints);

    if(reposResponse == null)
    {
      throw('no response from ' + _userReposEndpoints);
    }

    CacheService.SaveResponse(_userReposEndpoints, reposResponse);
  }

  return reposResponse.data;
}

async function requestRepoCommits(repos: any) {
  if (octokit == null) 
  {
    await doAuth();
  }

  const commitsList = repos.map(async (repo: any) => {
    const owner = repo.owner.login;
    const repoName = repo.name;

    const cacheRequestName = _repoCommitsEndpoint + '_' + owner + '_' + repoName;

    let commitsResponse: any = await CacheService.GetResponse(cacheRequestName);

    if (commitsResponse == null) 
    {
      commitsResponse = await octokit.request(_repoCommitsEndpoint, {
        owner,
        repo: repoName
      });

      if (commitsResponse == null) {
        throw ('no response from ' + _repoCommitsEndpoint);
      }

      CacheService.SaveResponse(cacheRequestName, commitsResponse);
    }

    const commits: Array<Commit> = [];

    commitsResponse.data.forEach((commitInfo: any) => {
      let login = "";

      if (commitInfo.author == null || commitInfo.commit == null || commitInfo.commit.author == null)
      {
        if(commitInfo.commit.author == null)
        {
          return;
        }
      
        commitInfo.author = {};
        commitInfo.author.login = commitInfo.commit.author.name;
      }

      if(commitInfo.author.login == null) 
      {
        login = owner;
      } 
      else 
      {
        login = commitInfo.author.login;
      }

      const newCommit: Commit = {
        date: commitInfo.commit.author.date,
        email: commitInfo.commit.author.email,
        login: login
      };

      if (_emailLookupList.includes(newCommit.email) || _nameLookupList.includes(newCommit.login)) 
      {
        commits.push(newCommit);
      }
    });

    return commits;
  });

  const commits = (await Promise.all(commitsList)).flat();

  return commits;
}

export default fetchCommits;