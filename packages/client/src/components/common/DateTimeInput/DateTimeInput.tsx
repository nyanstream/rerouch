import classnames from 'classnames';
import type { FieldInputProps } from 'formik';

import { formatDateToDateTimeInput } from '../../../utils/dates';

import './DateTimeInput.scss';

type PropsTyp = {
    field: FieldInputProps<any>;
    label?: React.ReactNode;
    labelHidden?: boolean;
    extra?: React.ReactNode;
    required?: boolean;
    className?: string;
};

export const DateTimeInput: React.FC<PropsTyp> = props => {
    const { field } = props;
    const { label, labelHidden, extra } = props;
    const { className, required } = props;

    const renderLabel = () => {
        if (!label) {
            return null;
        }

        return (
            <label className={classnames('rr-formItem__label', { [`${className}__label`]: !!className })} htmlFor={field?.name} hidden={labelHidden}>
                <span>{label}</span>
            </label>
        );
    };

    const renderExtra = () => {
        if (!extra) {
            return null;
        }

        return <div className={classnames('rr-formItem__extra', { [`${className}__extra`]: !!className })}>{extra}</div>;
    };

    return (
        <div className={classnames('rr-formItem', 'rr-formItem--dateTime', className)}>
            <div className="rr-formItem__content">
                {renderLabel()}

                <input
                    type="datetime-local"
                    id={field.name}
                    value={formatDateToDateTimeInput(field.value)}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    {...{ required }}
                    className={classnames('rr-formItem__input', { [`${className}__input`]: !!className })}
                />
            </div>

            {renderExtra()}
        </div>
    );
};
