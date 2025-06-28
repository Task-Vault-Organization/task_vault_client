import { FC } from "react";
import { BaseModal } from "../base-modal";
import { Button } from "../../reusable/buttons/button";

interface JsonResultModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    jsonData: any;
}

export const JsonResultModal: FC<JsonResultModalProps> = ({ open, setOpen, jsonData }) => {
    return (
        <BaseModal
            isOpen={open}
            onClose={() => setOpen(false)}
            title="Extracted JSON"
            contentClassName="bg-accent-1"
            footer={
                <Button onClick={() => setOpen(false)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Close
                </Button>
            }
        >
            <div className="max-h-[70vh] overflow-auto whitespace-pre-wrap font-mono text-sm bg-white p-4 rounded border border-gray-200">
                <pre>{JSON.stringify(jsonData, null, 2)}</pre>
            </div>
        </BaseModal>
    );
};