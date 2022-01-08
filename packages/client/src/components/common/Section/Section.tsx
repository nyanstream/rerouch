import './Section.scss';

type PropsType = {
    title: string;
};

export const Section: React.FC<PropsType> = ({ children, title }) => {
    return (
        <section className="rr-section">
            <h3 className="rr-section__heading">{title}</h3>

            <div className="rr-section__content">{children}</div>
        </section>
    );
};
