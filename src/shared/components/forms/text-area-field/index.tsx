import { FC, TextareaHTMLAttributes } from "react";
import {FieldError} from "react-hook-form";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    setValue: (val: string) => void;
    labelText: string;
    rows?: number;
    error?: FieldError;
}

export const TextAreaField: FC<TextAreaFieldProps> = ({
  value,
  setValue,
  labelText,
  rows = 3, error,
      ...rest
  }) => {
    const inputClasses = `
        w-full p-2.5 rounded-lg border text-sm transition
        ${error
        ? 'bg-red-50 border-red-300 text-red-800 placeholder-red-400 focus:ring-red-300 focus:border-red-400'
        : 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-600'}
    `;

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-white mb-1">
                {labelText}
            </label>
            <textarea
                value={value}
                onChange={(e) => setValue(e.target.value)}
                rows={rows}
                className={inputClasses}
                {...rest}
            />
            {error && (
                <p className="text-sm text-red-400">
                    {error.message || "This field is required."}
                </p>
            )}
        </div>
    );
}