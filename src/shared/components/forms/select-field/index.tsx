import { FC, SelectHTMLAttributes } from "react";

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    labelText: string;
    options: { id: number; name: string }[];
    value: number;
    setValue: (val: number) => void;
}

export const SelectField: FC<SelectFieldProps> = ({
      labelText,
      options,
      value,
      setValue,
      ...rest
  }) => (
    <div className="space-y-1">
        <label className="block text-sm font-medium text-white mb-1">
            {labelText}
        </label>
        <select
            value={value}
            onChange={(e) => setValue(parseInt(e.target.value))}
            className="w-full p-2.5 rounded-lg bg-gray-700 border border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500"
            {...rest}
        >
            {options.map((opt) => (
                <option key={opt.id} value={opt.id}>
                    {opt.name}
                </option>
            ))}
        </select>
    </div>
);