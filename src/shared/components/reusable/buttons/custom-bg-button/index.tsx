import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { Spinner } from "../../loading/spinner";

interface CustomBgButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    halfWidth?: boolean | null;
    children?: ReactNode[] | ReactNode;
    loading?: boolean;
    background?: string;
}

export const CustomBgButton: FC<CustomBgButtonProps> = ({
    fullWidth,
    halfWidth,
    loading,
    children,
    background = "bg-accent-2",
    ...rest
}) => {
    return (
        <button
            {...rest}
            className={`
                ${fullWidth ? "w-full" : ""}
                ${halfWidth ? "w-1/2" : ""}
                ${background}
                text-white
                transition-all duration-300 ease-in-out
                focus:ring-4 focus:outline-none focus:ring-blue-300
                font-medium rounded-lg text-sm px-5 py-2.5 text-center
                shadow-md hover:shadow-lg hover:scale-[1.02]
                active:scale-95 active:shadow-sm
                relative group cursor-pointer
            `}
        >
            <span className="relative z-10 flex items-center justify-center w-full h-full">
                {loading ? <Spinner /> : children}
            </span>
        </button>
    );
};