import { NavLink } from 'react-router-dom';

import * as ROUTES from '../../../App/routes';

import './Header.scss';

const Header: React.FC = () => {
    return (
        <header className="adminPanel__header">
            <div className="adminPanel__header__flex">
                <div className="adminPanel__header__brand">
                    <h1>NYAN.STREAM API</h1>
                </div>

                <nav className="adminPanel__header__nav">
                    <ul>
                        <li>
                            <NavLink to={ROUTES.ADMIN_PAGE_SCHEDULE_ROUTE}>Расписание</NavLink>
                        </li>

                        <li>
                            <NavLink to={ROUTES.ADMIN_PAGE_NOTIFICATIONS_ROUTE}>Оповещения</NavLink>
                        </li>

                        <li>
                            <NavLink to={ROUTES.ADMIN_PAGE_NEWS_ROUTE}>Новости</NavLink>
                        </li>

                        <li>
                            <NavLink to={ROUTES.ADMIN_PAGE_USER_MANAGEMENT_ROUTE}>Пользователь</NavLink>
                        </li>
                    </ul>
                </nav>

                <div className="adminPanel__header__logoutBox">
                    <button className="adminPanel__header__logoutBox__btn">Выход</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
