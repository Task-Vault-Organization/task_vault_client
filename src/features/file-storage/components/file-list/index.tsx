import {FC} from "react";
import {FileItem} from "../file-item";
import {GetFile} from "../../types/get-file.ts";

interface FileListProps {
    files: GetFile[]
}

export const FileListComponent: FC<FileListProps> = ({ files }) => {
    return (
        <div className="grid gap-4">
            {files.map(file => (
                <FileItem key={file.id} file={file} />
            ))}
        </div>
    );
};