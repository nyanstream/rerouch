import classnames from 'classnames';

import { datasetBool } from '../../../utils/bool';

import './Button.scss';

type HTMLButtonType = React.ButtonHTMLAttributes<HTMLButtonElement>;

type PropsType = {
    type?: HTMLButtonType['type'];
    disabled?: HTMLButtonType['disabled'];
    onClick?: HTMLButtonType['onClick'];
    className?: HTMLButtonType['className'];
    ghost?: boolean;
    whiteText?: boolean;
    rounded?: boolean;
};

export const Button: React.FC<PropsType> = props => {
    const { type, disabled, onClick } = props;
    const { className } = props;
    const { ghost, whiteText, rounded } = props;
    const { children } = props;

    return (
        <button
            className={classnames('rr-button', className)}
            {...{ type, disabled, onClick }}
            data-ghost={datasetBool(ghost)}
            data-white-text={datasetBool(whiteText)}
            data-rounded={datasetBool(rounded)}>
            {children}
        </button>
    );
};
