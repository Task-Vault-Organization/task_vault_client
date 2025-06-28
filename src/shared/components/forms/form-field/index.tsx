import { FC, ReactNode, InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    value: string;
    setValue: (val: string) => void;
    labelText?: ReactNode | string;
    placeholderText?: string;
    required?: boolean;
    error?: FieldError;
    icon?: React.ComponentType<{ className?: string }>;
}

export const FormField: FC<FormFieldProps> = ({
                                                  value,
                                                  setValue,
                                                  labelText,
                                                  placeholderText,
                                                  error,
                                                  required,
                                                  icon: Icon,
                                                  ...rest
                                              }) => {
    const baseClasses = `
        w-full p-2.5 rounded-lg border text-sm transition
        ${error
        ? "bg-red-50 border-red-300 text-red-800 placeholder-red-400 focus:ring-red-300 focus:border-red-400"
        : "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-600"}
    `;

    const inputClasses = Icon ? `${baseClasses} pl-10` : baseClasses;

    return (
        <div className="mb-4">
            {labelText && (
                <label className="block mb-1 text-sm font-medium text-gray-300">
                    {labelText}
                    {required && <span className="text-red-400 ml-1">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    {...rest}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className={inputClasses}
                    placeholder={placeholderText || ""}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-400">
                    {error.message || "This field is required."}
                </p>
            )}
        </div>
    );
};