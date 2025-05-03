import {FC, ReactNode, useEffect, useRef, useState} from "react";

interface DropdownProps {
    buttonContent: ReactNode,
    children: ReactNode[]
}

export const Dropdown : FC<DropdownProps> = ({ buttonContent, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <div>
                <button
                    type="button"
                    className="inline-flex w-full justify-center items-center gap-x-1.5 rounded-md px-3 py-2.5 text-sm font-semibold text-gray-200 bg-gray-900 shadow-xs cursor-pointer"
                    id="menu-button"
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {buttonContent}
                    <svg
                        className="-mr-1 size-5 text-gray-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fillRule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
            <div
                className={`shadow-sm absolute right-0 z-10 min-w-46 mt-2 origin-top-right rounded-md bg-accent-2 ring-1 shadow-lg ring-black/5 transition-all duration-200 ease-out transform ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="menu-button"
            >
                <div className="py-2 px-3" role="none">
                    {children}
                </div>
            </div>
        </div>
    );
};