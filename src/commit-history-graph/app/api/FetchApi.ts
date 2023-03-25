
import axios from "axios";
import { Octokit } from "@octokit/core";
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
//import config from '../../local.settings';
//import {config} from "dotenv"

async function fetchCommits(){
 // console.log(config);
  console.log(process.env);
  console.log(process.env.NAME_LOOKUP);
/*
  const isOrg = config.isOrg;

  const auth = createOAuthAppAuth({
    clientType: "oauth-app",
    clientId: config.clientId || '',
    clientSecret: config.clientSecret || ''
  });
  
  const appAuthentication = await auth({
    type: "oauth-app"
  });
  
  const octokit = new Octokit({ auth: config.accessToken });
  
  const nameLookupList = config.nameLookup || [''];
  const emailLookupList = config.emailLookup || [''];

  const flattenedCommits: any = [];

  const url = "";

  if(isOrg)
  {
   // commitsResponse = await octokit.request('GET /orgs/:org/events', {
   //   org: nameLookup
  //  });
  }
  else
  {
    nameLookupList.forEach(async username => {
      let eventResponse = await octokit.request("GET /users/:username/events", {
        username: username
      });

      console.log(eventResponse);
    });

    const reposResponse = await octokit.request("GET /user/repos");

    for (const repo of reposResponse.data) {
      const owner = repo.owner.login;
      const repoName = repo.name;

      const commitsResponse: any = await octokit.request("GET /repos/:owner/:repo/commits", {
        owner,
        repo: repoName
      });

      commitsResponse.data.forEach((commit:any)=> {
        if(commit.author == null){
          console.log(commit);
          return;
        }

        if(!nameLookupList.includes(commit.author.login) && !emailLookupList.includes(commit.author.email)){
          console.log(commit.author.login);
          return;
        }
        flattenedCommits.push(commit);
      })
    }
  }

  let weeklyCommits: any = [];
  const weekCount = 54;
  const now = new Date();
  let dayOffset = now.getDay();

  console.log(flattenedCommits);

  for (let week = 1; week <= weekCount; week++) 
  {
    const dailyCommits = [];
    for (let day = 1; day <= 7; day++) 
    {
        if(week == 1 && day <= dayOffset){
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

  return weeklyCommits;*/
}

export default fetchCommits;