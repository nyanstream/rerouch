import classnames from 'classnames';
import type { FieldInputProps, FormikFormProps } from 'formik';

import './TextInput.scss';

type PropsTyp = {
    form: any;
    field: FieldInputProps<any>;
    type?: string;
    placeholder?: string;
    label?: string;
    labelHidden?: boolean;
    required?: boolean;
    className?: string;
};

export const TextInput: React.FC<PropsTyp> = props => {
    const { field } = props;
    const { type = 'text', placeholder, label, labelHidden } = props;
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

    return (
        <div className={classnames('rr-formItem', 'rr-formItem--textInput', className)} data-type={type}>
            {renderLabel()}

            <input
                {...field}
                {...{ type, required, placeholder }}
                className={classnames('rr-formItem__input', { [`${className}__input`]: !!className })}
            />
        </div>
    );
};
