
import axios from "axios";
import { Octokit } from "@octokit/core";
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';

async function fetchCommits(){
  const isOrg = process.env.isOrg;

  const auth = createOAuthAppAuth({
    clientType: "oauth-app",
    clientId: process.env.cliendId || '',
    clientSecret: process.env.cleintSecret || ''
  });
  
  const appAuthentication = await auth({
    type: "oauth-app"
  });
  
  const octokit = new Octokit({ auth: process.env.accessToken });
  
  const nameLookup = process.env.nameLookup;
  
  let commits;
  const url = "";
  if(isOrg){
    commits = await octokit.request('GET /orgs/:org/events', {
      org: nameLookup
    });
  }else{
    commits = await octokit.request("GET /users/:username/events", {
      username: nameLookup
    });
  }

  return commits;
}

export default fetchCommits;