import { Section } from '../../common';

import CreateAirForm from './CreateAirForm/CreateAirFormContainer';

import './AdminPanelSchedule.scss';

const AdminPanelSchedule: React.FC = () => {
    return (
        <div className="schedule">
            <Section title="Создать эфир">
                <CreateAirForm />
            </Section>

            <Section title="Эфиры">
                <p>Не реализовано</p>
            </Section>
        </div>
    );
};

export default AdminPanelSchedule;
