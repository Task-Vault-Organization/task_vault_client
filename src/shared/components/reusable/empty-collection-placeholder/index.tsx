import { FC, ReactNode } from "react";

interface EmptyCollectionPlaceholderProps {
    icon: ReactNode;
    text: string;
    subtext?: string;
}

export const EmptyCollectionPlaceholder: FC<EmptyCollectionPlaceholderProps> = ({ icon, text, subtext }) => {
    return (
        <div className="w-full flex items-center justify-center py-20">
            <div className="flex flex-col items-center justify-center p-8 rounded-2xl text-gray-600 max-w-sm text-center space-y-4">
                <div className="text-5xl text-gray-400">
                    {icon}
                </div>
                <h2 className="text-4xl font-medium text-gray-400 mt-3">{text}</h2>
                {subtext && (
                    <p className="text-lg font-sm text-gray-400">{subtext}</p>
                )}
            </div>
        </div>
    );
};