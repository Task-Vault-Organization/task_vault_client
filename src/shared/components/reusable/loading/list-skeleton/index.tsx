import { FC } from "react";

export const ListSkeleton: FC<{ count?: number }> = ({ count = 5 }) => {
    return (
        <div className="w-full space-y-4">
            {Array.from({ length: count }).map((_, idx) => (
                <div
                    key={idx}
                    className="relative overflow-hidden flex items-center space-x-4 bg-white/10 p-4 rounded-xl"
                >
                    <div className="w-10 h-10 bg-white/20 rounded-md shimmer" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 bg-white/20 rounded w-3/4 shimmer" />
                        <div className="h-3 bg-white/10 rounded w-1/2 shimmer" />
                    </div>
                </div>
            ))}
        </div>
    );
};