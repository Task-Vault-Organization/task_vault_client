import {FC} from "react";
import {NavLink} from "react-router";

interface MenuLinkProps {
    to: string,
    text: string
}

export const MenuLink: FC<MenuLinkProps> = ({ to, text }) => {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isActive ?
                    "block rounded-md bg-accent-2 px-3 py-2 text-base font-medium text-white" :
                    "block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            }
        >
            {text}
        </NavLink>
    )
}