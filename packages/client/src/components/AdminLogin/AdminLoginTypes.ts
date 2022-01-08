import { CurrentUserInfoQueryResponseType } from '../../api/services/userService/types';

export type AdminLoginStateType = {
    IsUserLoggedIn: boolean;
    IsLoginPending: boolean;
    IsLoginError: boolean;
    IsLoginCheckComplete: boolean;
    IsUserInfoPending: boolean;
    UserInfo: CurrentUserInfoQueryResponseType | null;
};
