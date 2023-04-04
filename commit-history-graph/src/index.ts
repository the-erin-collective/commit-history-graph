import { ColorConfig, Options } from './graph';
import queryApi from './services/queryApi';
import graphBuilder from './services/graphBuilder';
const styles = require('./styles.css');

export async function loadGraph(selector: string, options: Options): Promise<void> {
    const targetDiv = document.querySelector(selector);

    if (!targetDiv) {
        console.error(`Div with selector '${selector}' not found.`);
        return;
    }

    const pac = options.accessToken;
    if (!pac) {
        console.error('Required option accessToken is not set.');
        return;
    }

    const login = options.login;
    if (!login) {
        console.error('Required option login is not set.');
        return;
    }

    if(options.colors == null)
    {
        options.colors = _fallbackLegend;
    }

    const fetchOptions: Options = {
        accessToken: pac,
        login: login,
        startOnSunday: options.startOnSunday,
        colors: options.colors
    };

    let loading = '<div class="commit-history-graph">Loading...</div>';
    
    targetDiv.innerHTML = loading;

    const commitData = await queryApi.fetchCommits(fetchOptions);

    let graphHtml: string = graphBuilder.BuildGraph(commitData);

    let content = '<div class="commit-history-graph">' + graphHtml + '</div><style>' + JSON.stringify(styles) + '</style>';
    
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
