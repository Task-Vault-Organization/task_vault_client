import { useParams } from "react-router";

export const useCurrentDirectoryName = (): string => {
    const { '*': wildcardPath } = useParams();
    const folderPathSegments = wildcardPath?.split("/").filter(Boolean) ?? [];

    return folderPathSegments.length > 0
        ? folderPathSegments[folderPathSegments.length - 1]
        : "root";
};