import {FC, ReactNode, InputHTMLAttributes, useState, useEffect} from "react";
import {InputValidator} from "../../../helpers/validation-helpers.ts";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string;
    setValue: (val: string) => void;
    labelText: ReactNode | string;
    error?: string | null;
    validator?: InputValidator
}

export const FormField: FC<FormFieldProps> = (props) => {
    const { value, setValue, labelText, validator, error: propError, ...rest } = props;

    const inputClasses = propError
        ? "bg-red-50 border-red-500 text-red-900 placeholder-red-400 text-sm rounded-lg block w-full p-2.5 dark:bg-red-100 dark:border-red-400 focus:ring-red-500 focus:border-red-500"
        : "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-800";

    return (
        <div>
            <input
                {...rest}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputClasses}
                placeholder={typeof labelText === 'string' ? labelText : undefined}
            />
            {propError && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                    {propError}
                </p>
            )}
        </div>
    );
};