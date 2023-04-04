import { DayData, WeeklyCommits } from "../graph";

const _levelPrefix = 'level_';

const buildGraph = (weeklyData: WeeklyCommits[]): string => {
  let graphHtlm = '';

  let weekCount = 53;
  const weeks = [];
  
  for (let week = weekCount; week > 0; week--) 
  {
    const days = [];
    const thisWeek = weeklyData[week - 1];

    for (let day = 1; day <= 7; day++) 
    {
      const thisCommitInfo = thisWeek.DailyCommits[day - 1];
      const className = _levelPrefix + (thisCommitInfo.color.level < 0 ? 'null' : thisCommitInfo.color.level.toString());
      const thisClassName = 'day week-' + week.toString() + ' day-' + day.toString() + ' graphDay ' + className;
    
      const dayData: DayData = ({
        commits: thisCommitInfo.commits,
        date: thisCommitInfo.dateOfCommit
      });

      days.push('<div class="' + thisClassName + '" data-tag="' + JSON.stringify(dayData) + '"></div>');
    }

    weeks.push('<div class="week">' + days.join('') + '</div>');
  } 

  graphHtlm = '<div class="content">';
  graphHtlm += '<div class="graph">';
  graphHtlm += weeks.join('');
  graphHtlm += '</div>';
  graphHtlm += '</div>';

  return graphHtlm;
}

export default {
  BuildGraph : buildGraph
}