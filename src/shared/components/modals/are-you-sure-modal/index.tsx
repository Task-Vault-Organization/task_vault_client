import { FC } from "react";
import {BaseModal} from "../base-modal";
import {OutlineButton} from "../../reusable/buttons/outline-button";
import {Button} from "../../reusable/buttons/button";

interface AreYouSureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

export const AreYouSureModal: FC<AreYouSureModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "Do you really want to proceed with this action?",
  confirmText = "Yes",
  cancelText = "No"
}) => {
    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className={"bg-accent-1"}
            footer={
                <>
                    <OutlineButton
                        onClick={onClose}
                    >
                        {cancelText}
                    </OutlineButton>
                    <Button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-sm text-gray-300">{message}</p>
        </BaseModal>
    );
};