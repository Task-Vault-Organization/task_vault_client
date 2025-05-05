import { FC, useState } from "react";
import { X, UploadCloud } from "lucide-react";
import { FileUpload } from "../../../../../features/file-storage/components/file-upload";
import { motion, AnimatePresence } from "framer-motion";

interface FileUploadToggleProps {
    setLoading: (loading: boolean) => void;
}

export const FileUploadToggle: FC<FileUploadToggleProps> = ({ setLoading }) => {
    const [visible, setVisible] = useState<boolean>(false);

    return (
        <>
            <AnimatePresence>
                {visible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setVisible(false)} // click outside
                    >
                        <div className="absolute inset-0" />

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 40 }}
                            transition={{ duration: 0.3 }}
                            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-full max-w-lg rounded-2xl shadow-2xl z-50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setVisible(false)}
                                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <FileUpload setLoading={setLoading} />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={() => setVisible(!visible)}
                className="cursor-pointer fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-500"
                aria-label="Upload file"
            >
                <UploadCloud className="w-6 h-6" />
            </button>
        </>
    );
};