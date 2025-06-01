import { FC } from "react";
import { FileItem } from "../file-item";
import { GetFile } from "../../types/get-file.ts";
import {DragDropContext, Draggable, Droppable} from "@hello-pangea/dnd";
import {FileStorageApiClient} from "../../../../api/clients/file-storage-api-client.ts";

interface FileListProps {
    files: GetFile[];
    setFiles: (files: GetFile[]) => void;
    setLoading?: (loading: boolean) => void;
    fetchFiles?: () => Promise<void>;
    displayMode?: string;
}

export const FileListComponent: FC<FileListProps> = ({
                                                         files,
                                                         setFiles,
                                                         setLoading,
                                                         fetchFiles,
                                                         displayMode = "1"
                                                     }) => {
    const isDraggable = displayMode === "1";

    const gridCols =
        displayMode === "3" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" :
            displayMode === "2" ? "grid-cols-1 sm:grid-cols-2" :
                "grid-cols-1";

    if (!isDraggable) {
        return (
            <div className={`grid ${gridCols} gap-4 w-full`}>
                {files.map((file) => (
                    <div key={file.id}>
                        <FileItem
                            file={file}
                            setLoading={setLoading}
                            fetchFiles={fetchFiles}
                            files={files}
                            setFiles={setFiles}
                        />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <DragDropContext
            onDragEnd={async (result) => {
                if (!result.destination) return;
                const updatedFiles = Array.from(files);
                const [movedFile] = updatedFiles.splice(result.source.index, 1);
                updatedFiles.splice(result.destination.index, 0, movedFile);
                setFiles(updatedFiles);
                const updatePayload = {
                    fileId: movedFile.id,
                    newIndex: result.destination.index,
                };
                await FileStorageApiClient.updateFileIndex(updatePayload);
            }}
        >
            <Droppable droppableId="file-list" direction="vertical">
                {(provided) => (
                    <div
                        className={`grid ${gridCols} gap-4 w-full`}
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {files.map((file, index) => (
                            <Draggable key={file.id} draggableId={file.id} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                    >
                                        <FileItem
                                            file={file}
                                            setLoading={setLoading}
                                            fetchFiles={fetchFiles}
                                            files={files}
                                            setFiles={setFiles}
                                        />
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