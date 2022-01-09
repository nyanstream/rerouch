import classnames from 'classnames';
import type { FieldInputProps } from 'formik';

import './SelectInput.scss';

type OptionType = {
    value: string | number;
    title: string;
    disabled?: boolean;
};

export type SelectInputPropsType = {
    field: FieldInputProps<any>;
    options: OptionType[];
    label?: string;
    labelHidden?: boolean;
    required?: boolean;
    className?: string;
};

export const SelectInput: React.FC<SelectInputPropsType> = props => {
    const { field } = props;
    const { options } = props;
    const { label, labelHidden } = props;
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

    const renderOptions = () => {
        return options.map((optionInfo, index) => {
            return (
                <option key={index} value={optionInfo.value} disabled={optionInfo.disabled}>
                    {optionInfo.title}
                </option>
            );
        });
    };

    return (
        <div className={classnames('rr-formItem', 'rr-formItem--select', className)}>
            {renderLabel()}

            <select
                {...field}
                {...{ required }}
                id={field.name}
                className={classnames('rr-formItem__input', { [`${className}__input`]: !!className })}>
                {renderOptions()}
            </select>
        </div>
    );
};
