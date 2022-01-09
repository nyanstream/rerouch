import classnames from 'classnames';
import type { FieldInputProps } from 'formik';

import './TextInput.scss';

type PropsTyp = {
    field: FieldInputProps<any>;
    type?: string;
    placeholder?: string;
    label?: React.ReactNode;
    labelHidden?: boolean;
    extra?: React.ReactNode;
    required?: boolean;
    className?: string;
};

export const TextInput: React.FC<PropsTyp> = props => {
    const { field } = props;
    const { type = 'text', placeholder, label, labelHidden, extra } = props;
    const { className, required } = props;

    const renderLabel = () => {
        if (!label) {
            return null;
        }

        return (
            <label className={classnames('rr-formItem__label', { [`${className}__label`]: !!className })} htmlFor={field?.name} hidden={labelHidden}>
                {label}
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
        <div className={classnames('rr-formItem', 'rr-formItem--textInput', className)} data-type={type}>
            {renderLabel()}

            <input
                {...field}
                {...{ type, required, placeholder }}
                id={field.name}
                className={classnames('rr-formItem__input', { [`${className}__input`]: !!className })}
            />

            {renderExtra()}
        </div>
    );
};
