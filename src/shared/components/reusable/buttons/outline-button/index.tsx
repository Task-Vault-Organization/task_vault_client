import { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { Spinner } from "../../loading/spinner";

interface OutlineButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    halfWidth?: boolean | null;
    children?: ReactNode[] | ReactNode;
    loading?: boolean;
}

export const OutlineButton: FC<OutlineButtonProps> = ({
  fullWidth,
  halfWidth,
  loading,
  children,
  ...rest
}) => {
    return (
        <button
            {...rest}
            className={`
                ${fullWidth ? "w-full" : ""}
                ${halfWidth ? "w-1/2" : ""}
                border border-gray-600 text-gray-600
                hover:bg-blue-600 hover:text-white
                transition-all duration-300 ease-in-out
                focus:ring-4 focus:outline-none focus:ring-blue-200
                font-medium rounded-lg text-sm px-5 py-2.5 text-center
                shadow-sm hover:shadow-md
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