export type SessionType = {
    cookie: string;
    user_id: string;
    auth_date: Date;
    auth_end_date: Date;
};

export type NewSessionType = {
    id: string;
    data: SessionType;
};
