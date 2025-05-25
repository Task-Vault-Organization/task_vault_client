import {FC, useEffect} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import { HiChevronRight } from "react-icons/hi";
import {useDirectoriesStore} from "../../../stores/directories-store.ts";

export const Breadcrumbs: FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const { folderId } = useParams();

    useEffect(() => {
        const pathParts = location.pathname.split("/").filter(Boolean); // ["files", "folderId"]
        const currentId = pathParts[pathParts.length - 1] || "root";
        goTo(currentId);
    }, [location.pathname]);

    const { directoriesStack, goTo } = useDirectoriesStore();

    const pathSegments: string[] = directoriesStack.map((d) => d.name);

    const handleClick = (index: number) => {
        const directory = directoriesStack[index];
        if (!directory) return;

        goTo(directory.id);
        navigate(directory.id === "root" ? "/files/root" : `/files/${directory.id}`);
    };

    return (
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 space-x-1 mb-4">
            <button
                onClick={() => handleClick(0)}
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