import { FC, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { FileType } from "../../../features/file-storage/types/file-type.ts";
import FileViewer from 'react-file-viewer';
import { FileStorageApiClient } from "../../../api/clients/file-storage-api-client.ts";
import {ExclamationTriangleIcon} from "@heroicons/react/16/solid";

interface FileViewerModal {
    open: boolean,
    setOpen: (open: boolean) => void,
    fileId: string,
    fileType: string,
    fileName?: string
}

export const FileViewerModal: FC<FileViewerModal> = ({ open, setOpen, fileId, fileType, fileName }) => {
    const [file, setFile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        console.log(fileType)
        async function downloadFile() {
            try {
                setIsLoading(true);
                setError(null);
                const res = await FileStorageApiClient.downloadFile(fileId);
                setFile(res);
            } catch (err) {
                console.error("Failed to load file:", err);
                setError("Failed to load file. Please try again.");
            } finally {
                setIsLoading(false);
            }
        }

        if (open && fileId) {
            downloadFile();
        }
    }, [open, fileId]);

    const handleDownload = async () => {
        try {
            const response = await FileStorageApiClient.downloadFile(fileId);
            const url = URL.createObjectURL(new Blob([response]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || `file-${fileId}.${fileType}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download failed:", err);
            setError("Download failed. Please try again.");
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
                                    {
                                        (fileType == 'png' || fileType == 'jpg') &&
                                        <FileViewer
                                            fileType={fileType}
                                            filePath={`https://localhost:44368/api/file-storage/download/${fileId}`}
                                            key={fileId}
                                            onError={(e: any) => {
                                                console.error("File viewer error:", e);
                                                setError("This file type cannot be previewed.");
                                            }}
                                            errorComponent={<div className="flex h-full items-center justify-center text-red-500">
                                                Preview not available for this file type
                                            </div>}
                                            unsupportedComponent={<div className="flex h-full items-center justify-center text-gray-500">
                                                Preview not available for this file type
                                            </div>}
                                        />
                                    }
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
    )
}