import { ButtonHTMLAttributes, FC, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    fullWidth?: boolean;
    halfWidth?: boolean | null;
    children?: ReactNode[];
}

export const Button: FC<ButtonProps> = (props) => {
    return (
        <button
            {...props}
            className={`${props.fullWidth ? "w-full" : ""} 
                  ${props.halfWidth ? "w-1/2" : ""} 
                  relative
                  text-white
                  bg-gradient-to-r from-blue-500 to-purple-600
                  hover:bg-gradient-to-br
                  hover:from-purple-600
                  hover:to-blue-500
                  transition-all 
                  duration-500 
                  ease-in-out
                  focus:ring-4 
                  focus:outline-none 
                  focus:ring-purple-300 
                  font-medium 
                  rounded-lg 
                  text-sm 
                  px-5 
                  py-2.5 
                  text-center
                  shadow-md
                  hover:shadow-lg
                  hover:scale-[1.02]
                  active:scale-95
                  active:shadow-sm
                  group
                  cursor-pointer`}
        >
      <span className="relative z-10 group-hover:text-white/90">
        {props.children}
      </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
        </button>
    );
};