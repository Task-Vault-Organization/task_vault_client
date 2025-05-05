import { FC, Fragment, ReactNode, useEffect, useState } from "react";
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    showCloseButton?: boolean;
    footer?: ReactNode;
    className?: string;
}

export const BaseModal: FC<BaseModalProps> = ({
                                                  isOpen,
                                                  onClose,
                                                  title,
                                                  children,
                                                  showCloseButton = true,
                                                  footer,
                                                  className = ""
                                              }) => {
    const [visible, setVisible] = useState(isOpen);

    useEffect(() => {
        if (!isOpen) {
            const timeout = setTimeout(() => setVisible(false), 200);
            return () => clearTimeout(timeout);
        }
        setVisible(true);
    }, [isOpen]);

    return (
        <Transition appear show={visible} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm" />
                </TransitionChild>

                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >
                        <DialogPanel className={`w-full max-w-4xl transform overflow-hidden rounded-xl bg-accent-2 shadow-2xl transition-all border border-accent-3 ${className}`}>
                            {title && (
                                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-400">
                                    <DialogTitle className="text-lg font-semibold text-gray-200">{title}</DialogTitle>
                                    {showCloseButton && (
                                        <button
                                            onClick={onClose}
                                            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                            title="Close"
                                        >
                                            <XMarkIcon className="h-5 w-5 text-gray-200" />
                                        </button>
                                    )}
                                </div>
                            )}
                            <div className="px-6 py-4 sm:p-6">{children}</div>
                            {footer && (
                                <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-400">
                                    {footer}
                                </div>
                            )}
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
};