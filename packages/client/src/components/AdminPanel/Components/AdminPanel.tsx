import { Outlet } from 'react-router-dom';

import Header from './Header/HeaderContainer';

import './AdminPanel.scss';

const AdminPanel: React.FC = () => {
    return (
        <div className="adminPanel">
            <Header />

            <main className="adminPanel__content">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminPanel;
