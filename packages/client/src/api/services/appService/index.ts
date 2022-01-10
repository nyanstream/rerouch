import { API } from '../..';

import type { ParseMarkdownQueryParamsType, ParseMarkdownQueryResponseType } from './types';

const Controller = 'app';

export const AppAPI = {
    parseMarkdown: async (params: ParseMarkdownQueryParamsType): Promise<ParseMarkdownQueryResponseType> => {
        return await API.post(`${Controller}/parse-markdown`, { json: params }).json();
    },
};

export default AppAPI;
