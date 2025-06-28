import { FC, ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FolderPlus,  } from "lucide-react";
import { FaRobot } from "react-icons/fa";

interface ToolbarToggleProps {
    uploadContent: ReactNode;
    createFolderContent: ReactNode;
    aiToolContent: ReactNode
    setLoading: (loading: boolean) => void;
}

export const ToolbarToggle: FC<ToolbarToggleProps> = ({ uploadContent, createFolderContent, aiToolContent }) => {
    const [visible, setVisible] = useState<null | "upload" | "folder" | "ai-tool">(null);

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
                        onClick={() => setVisible(null)}
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
                            {visible === "upload" ? uploadContent : visible === "folder" ? createFolderContent : aiToolContent}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 z-50">
                <button
                    onClick={() => setVisible(visible === "upload" ? null : "upload")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white p-4 rounded-full shadow-lg transition-all duration-500"
                    aria-label="Upload file"
                >
                    <UploadCloud className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setVisible(visible === "folder" ? null : "folder")}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-blue-500 hover:to-green-500 text-white p-4 rounded-full shadow-lg transition-all duration-500"
                    aria-label="Create folder"
                >
                    <FolderPlus className="w-6 h-6" />
                </button>
                <button
                    onClick={() => setVisible(visible === "ai-tool" ? null : "ai-tool")}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white p-4 rounded-full shadow-lg transition-all duration-500"
                    aria-label="Upload file"
                >
                    <FaRobot className="w-6 h-6" />
                </button>
            </div>
        </>
    );
};