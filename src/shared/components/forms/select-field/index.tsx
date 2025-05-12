import { FC, useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
    id: number;
    name: string;
}

interface CustomSelectFieldProps {
    labelText: string;
    options: Option[];
    value: number;
    setValue: (val: number) => void;
    placeholder?: string;
}

export const SelectField: FC<CustomSelectFieldProps> = ({
                                                            labelText,
                                                            options,
                                                            value,
                                                            setValue,
                                                            placeholder = "Select an option",
                                                        }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const selected = options.find(opt => opt.id === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-white mb-1">{labelText}</label>

            {/* Wrapper with relative to position dropdown absolutely */}
            <div className="relative" ref={wrapperRef}>
                <div
                    className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5 cursor-pointer"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <span>{selected?.name || placeholder}</span>
                    <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
                </div>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.15 }}
                            className="absolute left-0 top-full mt-1 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50"
                        >
                            {options.map((opt) => (
                                <div
                                    key={opt.id}
                                    className={`px-4 py-2 cursor-pointer hover:bg-gray-600 ${
                                        opt.id === value ? "bg-gray-700 font-medium" : ""
                                    }`}
                                    onClick={() => {
                                        setValue(opt.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    {opt.name}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};