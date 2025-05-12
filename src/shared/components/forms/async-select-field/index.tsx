import { FC, useEffect, useState } from "react";
import {SelectField} from "../select-field";
import {Spinner} from "../../reusable/loading/spinner";

interface Option {
    id: string | number;
    name: string;
}

interface AsyncSelectFieldProps {
    labelText: string;
    placeholder?: string;
    value: string | number;
    setValue: (val: string | number) => void;
    fetchOptions: () => Promise<Option[]>;
}

export const AsyncSelectField: FC<AsyncSelectFieldProps> = ({
    labelText,
    placeholder,
    value,
    setValue,
    fetchOptions,
}) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const loadOptions = async () => {
            try {
                const data = await fetchOptions();
                if (isMounted) {
                    setOptions(data);
                }
            } catch (err) {
                console.error("Failed to load select options", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadOptions();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="relative">
            <SelectField
                labelText={labelText}
                options={options}
                value={value}
                setValue={setValue}
                placeholder={placeholder}
            />
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg z-10">
                    <Spinner />
                </div>
            )}
        </div>
    );
};