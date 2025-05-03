import { FC } from "react";
import { IconType } from "react-icons";

interface TitleWithIconProps {
    icon: IconType;
    text: string;
    iconClassName?: string;
}

export const TitleWithIcon: FC<TitleWithIconProps> = ({ icon: Icon, text, iconClassName }) => {
    return (
        <div className="flex items-center gap-3">
            <Icon className={`text-text-primary w-6 h-6 ${iconClassName}`} />
            <h1 className="text-xl font-bold leading-tight tracking-tight text-text-primary md:text-2xl">
                {text}
            </h1>
        </div>
    );
};