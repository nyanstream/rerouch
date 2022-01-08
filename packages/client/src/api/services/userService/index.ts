import { API } from '../..';

import type { CurrentUserInfoQueryResponseType } from './types';

const Controller = 'user';

export const UserAPI = {
    getCurrentUserInfo: async (): Promise<CurrentUserInfoQueryResponseType> => {
        return await API.get(`${Controller}/get-current-user-info`).json();
    },
};

export default UserAPI;
