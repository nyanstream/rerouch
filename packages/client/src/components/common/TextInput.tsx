import classnames from 'classnames';
import type { FieldInputProps } from 'formik';

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
    const { form, field } = props;
    const { type = 'text', placeholder, label, labelHidden } = props;
    const { className, required } = props;

    const renderLabel = () => {
        if (!label || labelHidden === false) {
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
