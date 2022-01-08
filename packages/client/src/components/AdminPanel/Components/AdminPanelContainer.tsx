import { withAuthRedirect } from '../../../HOC';

import AdminPanel from './AdminPanel';

const AdminPanelContainer: React.FC = () => {
    return <AdminPanel />;
};

export default withAuthRedirect(AdminPanelContainer);
