import { FC, ReactNode, InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string;
    setValue: (val: string) => void;
    labelText: ReactNode | string;
    error?: string | null;
    required?: boolean;
}

export const FormField: FC<FormFieldProps> = ({
                                                  value,
                                                  setValue,
                                                  labelText,
                                                  error,
                                                  required,
                                                  ...rest
                                              }) => {
    const inputClasses = `
    w-full p-2.5 rounded-lg border text-sm transition
    ${error ? 'bg-red-100 border-red-500 text-red-900 placeholder-red-400 focus:ring-red-500 focus:border-red-500' : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-600'}
  `;

    return (
        <div className="mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-300">
                {labelText}
                {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            <input
                {...rest}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={inputClasses}
                placeholder={typeof labelText === 'string' ? labelText : undefined}
            />
            {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
        </div>
    );
};