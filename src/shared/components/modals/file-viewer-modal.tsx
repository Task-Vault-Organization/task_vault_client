import { FC, useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import { FileType } from "../../../features/file-storage/types/file-type.ts";
import FileViewer from 'react-file-viewer';
import { FileStorageApiClient } from "../../../api/clients/file-storage-api-client.ts";

interface FileViewerModal {
    open: boolean,
    setOpen: () => void,
    fileId: string,
    fileType: FileType
}

export const FileViewerModal: FC<FileViewerModal> = ({ open, setOpen, fileId, fileType }) => {
    const [file, setFile] = useState<any>(null);

    useEffect(() => {
        async function downloadFile() {
            const res = await FileStorageApiClient.downloadFile(fileId);
            setFile(res);
            console.log(fileType)
        }
        downloadFile().then(r => console.log());
    }, []);

    return file && (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
            <DialogBackdrop
                transition
                className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
            />

            <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                    <DialogPanel
                        transition
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-4xl data-closed:sm:translate-y-0 data-closed:sm:scale-95"
                    >
                        <div className="bg-white px-8 pt-6 pb-8 sm:p-8 sm:pb-8">
                            <DialogTitle as="h3" className="text-xl font-semibold text-gray-900">
                                Your file:
                            </DialogTitle>
                            <div className="mt-4">
                                <FileViewer
                                    fileType={fileType}
                                    filePath={`https://localhost:44368/api/file-storage/download/${fileId}`}
                                    key={fileId}
                                />
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:px-8">
                            <button
                                type="button"
                                data-autofocus
                                onClick={() => setOpen(false)}
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-3 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    )
}
