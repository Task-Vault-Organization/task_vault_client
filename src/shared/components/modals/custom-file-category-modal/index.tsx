import { FC, useEffect, useState } from "react";
import { BaseModal } from "../base-modal";
import { OutlineButton } from "../../reusable/buttons/outline-button";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client";
import { FileCategory } from "../../../../features/file-storage/types/file-category";

interface CustomFileCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CustomFileCategoryModal: FC<CustomFileCategoryModalProps> = ({ isOpen, onClose }) => {
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState<FileCategory[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        const res = await FileStorageApiClient.getFileCategories();
        setCategories(res.fileCategories || []);
    };

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const handleCreate = async () => {
        const trimmed = categoryName.trim();
        if (trimmed.length < 3 || trimmed.length > 20) {
            setError("Category name must be between 3 and 20 characters.");
            return;
        }
        setError(null);
        const dto = { categoryName: trimmed };
        await FileStorageApiClient.createCustomFileCategory(dto);
        setCategoryName("");
        fetchCategories();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleCreate();
        }
    };

    const filteredCategories = categories.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isAddDisabled = categoryName.trim().length < 3 || loading;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="File Categories"
            contentClassName="bg-accent-1 text-white"
            footer={
                <OutlineButton onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Close
                </OutlineButton>
            }
        >
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-end">
                    <div className="flex-1">
                        <label className="block mb-1 text-sm font-medium text-gray-300">New Category</label>
                        <input
                            type="text"
                            value={categoryName}
                            onChange={e => setCategoryName(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="w-full p-2.5 rounded-lg border bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm focus:ring-blue-500 focus:border-blue-600"
                            placeholder="Enter category name"
                        />
                        {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
                    </div>
                    <div>
                        <OutlineButton onClick={handleCreate} disabled={isAddDisabled}>
                            Add
                        </OutlineButton>
                    </div>
                </div>
                <p className="text-sm text-gray-400">
                    Example: <span className="text-white font-medium">CV (Curriculum Vitae)</span>. Use short names and clarify in parentheses when needed.
                </p>
                <div className="border-t border-white/10 mt-4 pt-4" />
                <label className="block text-sm font-medium text-gray-300">Search</label>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full p-2.5 rounded-lg border bg-gray-800 border-gray-700 text-white placeholder-gray-400 text-sm focus:ring-blue-500 focus:border-blue-600"
                    placeholder="Search categories"
                />
                <div className="flex flex-wrap gap-2 mt-4 max-h-64 overflow-y-auto pr-1 custom-scroll">
                    {filteredCategories.map(cat => (
                        <div
                            key={cat.id}
                            className="flex items-center bg-gray-800 border border-gray-600 text-white px-3 py-1 rounded-full"
                        >
                            <span>{cat.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </BaseModal>
    );
};