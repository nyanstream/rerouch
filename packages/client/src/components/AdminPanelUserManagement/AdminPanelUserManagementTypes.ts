type ChangePasswordQueryResult = {
    timestamp: string;
    success: boolean;
};

export type AdminPanelUserManagementStateType = {
    IsChangePasswordQueryPending: boolean;
    ChangePasswordQueryResult: ChangePasswordQueryResult | null;
};
