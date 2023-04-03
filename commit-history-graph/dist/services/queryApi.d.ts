import { Options, WeeklyCommits } from '../graph';
declare function fetchCommits(options: Options): Promise<WeeklyCommits[]>;
declare const _default: {
    fetchCommits: typeof fetchCommits;
};
export default _default;
