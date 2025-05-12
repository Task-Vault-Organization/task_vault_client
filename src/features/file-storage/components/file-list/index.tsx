import { FC } from "react";
import { FileItem } from "../file-item";
import { GetFile } from "../../types/get-file.ts";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";

interface FileListProps {
    files: GetFile[];
    setFiles: (files: GetFile[]) => void;
}

export const FileListComponent: FC<FileListProps> = ({ files, setFiles }) => {
    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const updatedFiles = Array.from(files);
        const [movedFile] = updatedFiles.splice(result.source.index, 1);
        updatedFiles.splice(result.destination.index, 0, movedFile);

        setFiles(updatedFiles);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="file-list" direction="vertical">
                {(provided) => (
                    <div
                        className="flex flex-col gap-3 w-full"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {files.map((file, index) => (
                            <Draggable
                                key={file.id}
                                draggableId={file.id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <FileItem file={file} />
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};