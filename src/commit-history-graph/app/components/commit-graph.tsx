"use client"

import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query'
import fetchCommits from '../api/FetchApi';
import styles from './commit-graph.module.css'

let populate = async (commits: any) => {
  let weekCount = 54;
  const weeks = [];

  for (let week = 1; week <= weekCount; week++) 
  {
    const days = [];

    for (let day = 1; day <= 7; day++) 
    {
      const thisClassName = styles.day + " " + styles.weekday +  "-" + week.toString() + " " + styles.day + "-" + day.toString();
      days.push(<div className={thisClassName}></div>);
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

const CommitGraph = () => {
    const time = new Date();
    const dateStamp = time.getUTCFullYear().toString().substring(2) + (time.getUTCMonth() < 10 ? '0' + time.getUTCMonth() : time.getUTCMonth()) + (time.getUTCDay() < 10 ? '0' + time.getUTCDay() : time.getUTCDay()) + ( time.getHours() < 10 ? '0' +  time.getHours() :  time.getHours())  + ( time.getMinutes() < 10 ? '0' +  time.getMinutes() :  time.getMinutes())  ; 

    const { isLoading, isFetching, error, data, status } = useQuery(dateStamp, fetchCommits);
    const [graph, setGraph] = useState(<></>);

    useEffect(() => {
      const populateGraph = async () => {
        if (data) 
        {
          console.log(data);

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