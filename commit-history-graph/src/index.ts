import { ColorConfig, Options } from './graph';
import queryApi from './services/queryApi';
import graphBuilder from './services/graphBuilder';
const styles = require('./styles.css');

export async function loadGraph(selector: string, legend: ColorConfig[] | null): Promise<void> {
    const targetDiv = document.querySelector(selector);

    if (!targetDiv) {
        console.error(`Div with selector '${selector}' not found.`);
        return;
    }

    const pac = process.env.chg_pac;
    if (!pac) {
        console.error('Required environment variable chg_pac is not set.');
        return;
    }

    const login = process.env.chg_login;
    if (!login) {
        console.error('Required environment variable chg_login is not set.');
        return;
    }

    const startOnSunday = process.env.chg_startOnSunday;
    if (!startOnSunday || (startOnSunday !== 'true' && startOnSunday !== 'false')) {
        console.error('Required environment variable chg_startOnSunday is not set.');
        return;
    }

    if(legend == null)
    {
        legend = _fallbackLegend;
    }

    const fetchOptions: Options = {
        accessToken: pac,
        login: login,
        startOnSunday: (startOnSunday === 'true'),
        colors: legend
    };

    let loading = '<div class="commit-history-graph">Loading...</div>';
    
    targetDiv.innerHTML = loading;

    const commitData = await queryApi.fetchCommits(fetchOptions);

    let graphHtml: string = graphBuilder.BuildGraph(commitData);

    let content = '<div class="commit-history-graph">' + graphHtml + '</div><style>' + styles + '</style>';
    
    targetDiv.innerHTML = content;
}

const _fallbackLegend: ColorConfig[] = [
    {
        "minValue" : 0,
        "maxValue" : 0,
        "level" : 0,
        "hex" : "868686"
    },
    {
        "minValue" : 1,
        "maxValue" : 4,
        "level" : 1,
        "hex" : "9697A9"
    },
    {
        "minValue" : 5,
        "maxValue" : 9,
        "level" : 2,
        "hex" : "8CA2C6"
    },
    {
        "minValue" : 10,
        "maxValue" : 14,
        "level" : 3,
        "hex" : "7DB176"
    },
    {
        "minValue" : 15,
        "maxValue" : 19,
        "level" : 4,
        "hex" : "ADEE73"
    },
    {
        "minValue" : 20,
        "maxValue" : 14,
        "level" : 5,
        "hex" : "FAF383"
    },
    {
        "minValue" : 25,
        "maxValue" : 29,
        "level" : 6,
        "hex" : "F7A16B"
    },
    {
        "minValue" : 30,
        "maxValue" : null,
        "level" : 7,
        "hex" : "FF6C6C"
    }
];
