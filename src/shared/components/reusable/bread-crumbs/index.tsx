import { FC } from "react";
import { useLocation, useNavigate } from "react-router";
import { HiChevronRight } from "react-icons/hi";

export const Breadcrumbs: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const pathSegments = location.pathname
        .split("/")
        .filter((segment) => segment.length > 0);

    const handleClick = (index: number) => {
        const newPath = "/" + pathSegments.slice(0, index + 1).join("/");
        navigate(newPath);
    };

    return (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-1 mb-4">
            <button
                onClick={() => navigate("/files")}
                className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
            >
                root
            </button>
            {pathSegments.slice(1).map((segment, index) => (
                <div key={index} className="flex items-center space-x-1">
                    <HiChevronRight />
                    <button
                        onClick={() => handleClick(index + 1)}
                        className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
                    >
                        {decodeURIComponent(segment)}
                    </button>
                </div>
            ))}
        </div>
    );
};