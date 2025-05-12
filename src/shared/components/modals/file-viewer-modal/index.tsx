import { FC, useEffect, useState } from "react";
import { ArrowDownTrayIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { BaseModal } from "../base-modal";
import { Button } from "../../reusable/buttons/button";

interface FileViewerModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    fileId: string;
    fileType: string;
    fileName?: string;
}

export const FileViewerModal: FC<FileViewerModalProps> = ({
                                                              open,
                                                              setOpen,
                                                              fileId,
                                                              fileType,
                                                              fileName,
                                                          }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function prepareFile() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await FileStorageApiClient.downloadFile(fileId);
                const blob = new Blob([response], { type: getMimeType(fileType) });
                const url = URL.createObjectURL(blob);
                setFileUrl(url);

                const lowerType = fileType.toLowerCase();

                if (lowerType === "txt" || lowerType === "json") {
                    const text = await blob.text();
                    if (lowerType === "json") {
                        try {
                            const formatted = JSON.stringify(JSON.parse(text), null, 2);
                            setFileContent(formatted);
                        } catch {
                            setFileContent(text);
                        }
                    } else {
                        setFileContent(text);
                    }
                }
            } catch {
                setError("Failed to load file. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }

        if (open && fileId) {
            prepareFile();
        }

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [open, fileId]);

    const getMimeType = (extension: string) => {
        const types: Record<string, string> = {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            pdf: "application/pdf",
            txt: "text/plain",
            json: "application/json",
            csv: "text/csv",
            doc: "application/msword",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ppt: "application/vnd.ms-powerpoint",
            pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        };
        return types[extension.toLowerCase()] || "application/octet-stream";
    };

    const handleDownload = async () => {
        try {
            if (!fileUrl) return;
            const link = document.createElement("a");
            link.href = fileUrl;
            link.setAttribute("download", fileName || `file-${fileId}.${fileType}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            setError("Download failed. Please try again.");
        }
    };

    const renderTextOrJsonFile = () => {
        if (!fileContent) return null;
        return (
            <div className="h-full w-full p-4 font-mono text-sm whitespace-pre-wrap overflow-auto">
                {fileContent}
            </div>
        );
    };

    const renderImage = () => {
        if (!fileUrl) return null;
        return (
            <div className="flex items-center justify-center h-full">
                <img
                    src={fileUrl}
                    alt={fileName || "Image preview"}
                    className="max-h-full max-w-full object-contain"
                />
            </div>
        );
    };

    const renderPdf = () => {
        if (!fileUrl) return null;
        return <iframe src={fileUrl} className="h-full w-full" title={fileName || "PDF Preview"} />;
    };

    const renderFilePreview = () => {
        const normalizedFileType = fileType.toLowerCase();
        switch (normalizedFileType) {
            case "txt":
            case "json":
                return renderTextOrJsonFile();
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
                return renderImage();
            case "pdf":
                return renderPdf();
            default:
                return (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 p-4">
                        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
                        <p className="text-lg font-medium text-gray-700">
                            Preview not available for this file type
                        </p>
                        <p className="text-sm text-gray-500">You can still download the file to view it.</p>
                    </div>
                );
        }
    };

    return (
        <BaseModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title={fileName || "File Preview"}
            contentClassName="bg-accent-1"
            footer={
                <Button onClick={() => setOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Close
                </Button>
            }
        >
            <div className="flex justify-end mb-2">
                <button
                    onClick={handleDownload}
                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    title="Download"
                >
                    <ArrowDownTrayIcon className="text-gray-200 h-5 w-5" />
                </button>
            </div>
            {isLoading ? (
                <div className="flex h-96 items-center justify-center">
                    <h2>Loading...</h2>
                </div>
            ) : error ? (
                <div className="flex h-96 flex-col items-center justify-center space-y-4 text-red-500">
                    <ExclamationTriangleIcon className="h-12 w-12" />
                    <p className="text-lg font-medium">{error}</p>
                </div>
            ) : (
                <div className="h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-gray-50">
                    {renderFilePreview()}
                </div>
            )}
        </BaseModal>
    );
};