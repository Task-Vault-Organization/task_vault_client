import { FC } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { FileItem } from "../file-item";
import {FileStorageApiClient} from "../../../../api/clients/file-storage-api-client.ts";
import {useFilesStore} from "../../stores/files-store.ts";

interface FileListProps {
    displayMode: string;
}

export const FileListComponent: FC<FileListProps> = ({ displayMode = "1" }) => {
    const { files, setFiles } = useFilesStore();
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
                        <FileItem file={file} />
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