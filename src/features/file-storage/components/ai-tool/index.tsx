import { useEffect, useRef, useState } from "react";
import { Form, FormRef } from "../../../../shared/components/forms/form";
import { FormField } from "../../../../shared/components/forms/form-field";
import { useParams } from "react-router";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../authentication/types/authentication-state.ts";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { LlmApiClient } from "../../../../api/clients/llm-api-client.ts";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { BASE_DIRECTORY_NAME } from "../../../../config/constants.ts";
import {Button} from "../../../../shared/components/reusable/buttons/button";

interface FolderFormValues {
    folderName: string;
}

export const AiTool = ({ onSubmit }: { onSubmit: (folderId: string, categories: string[]) => void }) => {
    const [loading, setLoading] = useState(false);
    const [customCategory, setCustomCategory] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [allCategories, setAllCategories] = useState<{ id: string; name: string }[]>([]);
    const { folderId: routeFolderId } = useParams();
    const formRef = useRef<FormRef>(null);
    const user = useAuthenticationStore((state: AuthenticationState) => state.user);
    const folderId = routeFolderId === "root" ? user?.rootDirectoryId : routeFolderId;

    const fetchCategories = async () => {
        const res = await FileStorageApiClient.getFileCategories();
        setAllCategories(res.fileCategories || []);
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleToggleCategory = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
        );
    };

    const handleAddCustomCategory = () => {
        const trimmed = customCategory.trim();
        if (trimmed && !selectedCategories.includes(trimmed)) {
            setSelectedCategories((prev) => [...prev, trimmed]);
            setCustomCategory('');
        }
    };

    const handleSubmit = async () => {
        if (!folderId) return;
        setLoading(true);
        try {
            await LlmApiClient.categorizeFolder({
                folderId,
                categories: selectedCategories,
            });
            showAlert("success", "Folder categorized successfully");
            onSubmit(folderId, selectedCategories);
        } catch (e) {
            showAlert("error", "Failed to categorize folder");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl space-y-6 shadow-2xl w-full mx-auto">
            <h2 className="text-xl font-semibold text-white">Categorize Folder with AI</h2>
            <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                    {[
                        ...allCategories.map((c) => c.name),
                        ...selectedCategories.filter((c) => !allCategories.some((cat) => cat.name === c)),
                    ].map((category) => (
                        <button
                            key={category}
                            onClick={() => handleToggleCategory(category)}
                            className={`px-3 py-1 rounded-full border ${
                                selectedCategories.includes(category)
                                    ? 'bg-accent-2 text-white border-accent-2'
                                    : 'text-gray-300 border-gray-500 hover:bg-gray-700'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                <FormField
                    value={customCategory}
                    setValue={setCustomCategory}
                    placeholderText="Add custom category"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomCategory();
                        }
                    }}
                />
                <div className="flex justify-end">
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || selectedCategories.length === 0}
                        className="bg-blue-600 px-6 py-2 text-white rounded-lg disabled:opacity-50"
                    >
                        {loading ? 'Categorizing...' : 'Categorize'}
                    </Button>
                </div>
            </div>
        </div>
    );
};