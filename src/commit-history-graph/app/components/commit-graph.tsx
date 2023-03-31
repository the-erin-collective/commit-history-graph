"use client"

import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query'
import configService from '../api/configService';
import queryApi from '../api/queryApi';
import styles from './commit-graph.module.css'
import { Commit } from '@app/commit';
import { DailyCommit, WeeklyCommits } from '@app/weeklycommits';
import { DayData } from '@app/day-data';

let populate = async (commits: WeeklyCommits[]): Promise<JSX.Element> => {
  let weekCount = 54;
  const weeks = [];
  
  for (let week = weekCount; week > 0; week--) 
  {
    const days = [];
    const thisWeek = commits[week - 1];

    for (let day = 1; day <= 7; day++) 
    {
      const thisCommitInfo = thisWeek.DailyCommits[day - 1];
      const className = await getDayLevelClass(thisCommitInfo);
      const thisClassName = styles.day + " " + styles.weekday +  "-" + week.toString() + " " + styles.day + "-" + day.toString() + " " + styles.graphDay + " " + className;
    
      const dayData: DayData = ({
        commits: thisCommitInfo.commits,
        repos: thisCommitInfo.repos,
        date: thisCommitInfo.dateOfCommit
      });

      days.push(<div className={thisClassName} data-tag={JSON.stringify(dayData)}></div>);
    }

    weeks.push(<div className={styles.week}>{days}</div>);
  } 

  return (
    <div className={styles.content}>
      <div className={styles.graph}>
        {weeks}
      </div>
    </div>);
};

const getDayLevelClass = async (commitInfo: DailyCommit): Promise<string> => {
  const noDataClassName = 'null';
  const levelPrefix = 'level_';

  if(commitInfo.commits < 0)
  {
    return levelPrefix + noDataClassName;
  }

  let legend = await configService.fetchLegend().sort((a, b) => a.level - b.level);

  let className = levelPrefix;

  for(let colorIndex = 0; colorIndex < legend.length; colorIndex++)
  {
    let lowPass = (legend[colorIndex].minValue <= commitInfo.commits);

    let maxValue = legend[colorIndex].maxValue ?? -1;

    let highPass = (legend[colorIndex].maxValue == null || (maxValue >= commitInfo.commits));

    if(lowPass && highPass)
    {
      className += legend[colorIndex].level;
      
      break;
    }  
  }

  if(className == levelPrefix)
  {
    className += noDataClassName;;
  }
  
  return styles[className];
};

const CommitGraph = (): JSX.Element => {
    const time = new Date();
    const dateStamp = time.getUTCFullYear().toString().substring(2) + (time.getUTCMonth() < 10 ? '0' + time.getUTCMonth() : time.getUTCMonth()) + (time.getUTCDay() < 10 ? '0' + time.getUTCDay() : time.getUTCDay()) + ( time.getHours() < 10 ? '0' +  time.getHours() :  time.getHours())  + ( time.getMinutes() < 10 ? '0' +  time.getMinutes() :  time.getMinutes())  ; 

    const { isLoading, isFetching, error, data, status } = useQuery(dateStamp, queryApi.fetchCommits);
    const [graph, setGraph] = useState(<></>);

    useEffect(() => {
      const populateGraph = async () => {
        if (data) 
        {
          const graphData = await populate(data);
          setGraph(graphData);
        }
      };
      populateGraph();
    }, [data]);
  
    if (isLoading || isFetching) 
    {
      return <div className={styles.loading}>Loading...</div>
    }
    
    if (error) 
    {
      return <div className={styles.error}>Error! {error.toString()}</div>
    }
  
    return (
      <>
        {graph}
      </>
    );
};

export default CommitGraph;