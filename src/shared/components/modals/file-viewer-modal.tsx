import { FC, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { FileStorageApiClient } from "../../../api/clients/file-storage-api-client.ts";
import { ExclamationTriangleIcon } from "@heroicons/react/16/solid";

interface FileViewerModal {
    open: boolean,
    setOpen: (open: boolean) => void,
    fileId: string,
    fileType: string,
    fileName?: string
}

export const FileViewerModal: FC<FileViewerModal> = ({ open, setOpen, fileId, fileType, fileName }) => {
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

                // Special handling for text files
                if (fileType.toLowerCase() === 'txt') {
                    const text = await blob.text();
                    setFileContent(text);
                }
            } catch (err) {
                console.error("Failed to load file:", err);
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
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'pdf': 'application/pdf',
            'txt': 'text/plain',
            'csv': 'text/csv',
            'doc': 'application/msword',
            'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls': 'application/vnd.ms-excel',
            'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt': 'application/vnd.ms-powerpoint',
            'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
        };
        return types[extension.toLowerCase()] || 'application/octet-stream';
    };

    const handleDownload = async () => {
        try {
            if (!fileUrl) return;

            const link = document.createElement('a');
            link.href = fileUrl;
            link.setAttribute('download', fileName || `file-${fileId}.${fileType}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed:", err);
            setError("Download failed. Please try again.");
        }
    };

    const renderTextFile = () => {
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

        return (
            <iframe
                src={fileUrl}
                className="h-full w-full"
                title={fileName || "PDF Preview"}
            />
        );
    };

    const renderFilePreview = () => {
        const normalizedFileType = fileType.toLowerCase();

        switch(normalizedFileType) {
            case 'txt':
                return renderTextFile();
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return renderImage();
            case 'pdf':
                return renderPdf();
            default:
                return (
                    <div className="flex h-full flex-col items-center justify-center space-y-4 p-4">
                        <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
                        <p className="text-lg font-medium text-gray-700">
                            Preview not available for this file type
                        </p>
                        <p className="text-sm text-gray-500">
                            You can still download the file to view it.
                        </p>
                    </div>
                );
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-xl bg-white text-left shadow-2xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-6xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                            <DialogTitle as="h3" className="text-lg font-semibold text-gray-900">
                                {fileName || "File Preview"}
                            </DialogTitle>
                            <div className="flex items-center space-x-3">
                                <button
                                    onClick={handleDownload}
                                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    title="Download"
                                >
                                    <ArrowDownTrayIcon className="h-5 w-5" />
                                </button>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                    title="Close"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white px-6 py-4 sm:p-6">
                            {isLoading ? (
                                <div className="flex h-96 items-center justify-center">
                                    <h2>Loading...</h2>
                                </div>
                            ) : error ? (
                                <div className="flex h-96 flex-col items-center justify-center space-y-4 text-red-500">
                                    <ExclamationTriangleIcon className="h-12 w-12" />
                                    <p className="text-lg font-medium">{error}</p>
                                    <button
                                        onClick={() => setOpen(false)}
                                        className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                <div className="h-[70vh] overflow-auto rounded-lg border border-gray-200 bg-gray-50">
                                    {renderFilePreview()}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end border-t border-gray-100 px-6 py-4">
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Close
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};