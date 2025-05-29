import { FC, useEffect, useState } from "react";
import { BaseModal } from "../base-modal";
import { Button } from "../../reusable/buttons/button";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { FileHistoryLog } from "../../../../features/file-storage/types/file-history-log.ts";
import { OutlineButton } from "../../reusable/buttons/outline-button";
import { Spinner } from "../../reusable/loading/spinner";
import { HiOutlineDocumentText } from "react-icons/hi";

interface FileHistoryModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    fileId: string;
}

export const FileHistoryModal: FC<FileHistoryModalProps> = ({ open, setOpen, fileId }) => {
    const [logs, setLogs] = useState<FileHistoryLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const res = await FileStorageApiClient.getFileHistory(fileId);
                setLogs(res.fileHistoryLogs || []);
            } catch (err) {
                console.error("Failed to fetch file history", err);
            }
            setLoading(false);
        };

        if (open) {
            fetchHistory();
        }
    }, [open, fileId]);

    return (
        <BaseModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="File History"
            contentClassName="bg-accent-1 text-white"
            footer={
                <OutlineButton onClick={() => setOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Close
                </OutlineButton>
            }
        >
            {loading ? (
                <Spinner />
            ) : logs.length === 0 ? (
                <div className="text-center py-10 text-gray-400">No history available for this file.</div>
            ) : (
                <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1 custom-scroll">
                    {logs.map((log, idx) => (
                        <div key={idx} className="p-4 rounded-lg flex items-start gap-3">
                            <HiOutlineDocumentText className="text-xl text-gray-300 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-gray-100">{log.historyLog}</p>
                                <div className="text-xs text-gray-400 mt-2 flex justify-between">
                                    <span>{new Date(log.loggedAt).toLocaleString()}</span>
                                    <span className="ml-auto">{log.actionMadeBy?.email || "Unknown user"}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </BaseModal>
    );
};