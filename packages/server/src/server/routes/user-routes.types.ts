import { UserWithIdType } from '../../db/users';

export type CurrentUserInfoQueryResponseType = {
    id: UserWithIdType['_id'];
    username: UserWithIdType['user_name'];
    roles: UserWithIdType['roles'];
};
