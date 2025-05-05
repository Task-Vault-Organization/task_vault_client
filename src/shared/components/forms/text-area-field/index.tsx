import { FC, TextareaHTMLAttributes } from "react";

interface TextAreaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    value: string;
    setValue: (val: string) => void;
    labelText: string;
    rows?: number;
}

export const TextAreaField: FC<TextAreaFieldProps> = ({
      value,
      setValue,
      labelText,
      rows = 3,
      ...rest
  }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-white mb-1">
            {labelText}
        </label>
        <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={rows}
            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            {...rest}
        />
    </div>
);