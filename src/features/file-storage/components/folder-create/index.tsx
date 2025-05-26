import { useState } from "react";
import { Form } from "../../../../shared/components/forms/form";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client";
import { CreateDirectory } from "../../types/create-directory.ts";
import {showAlert} from "../../../../shared/helpers/alerts-helpers.ts";
import {BASE_DIRECTORY_NAME} from "../../../../config/constants.ts";
import {useParams} from "react-router";

interface FolderFormValues {
    folderName: string;
}

export const FolderCreate = ({ onCreate }: { onCreate: (folderName: string) => void }) => {
    const [loading, setLoading] = useState(false);

    const { folderId } = useParams();

    const fields = [
        {
            name: "folderName",
            label: "Folder Name",
            autoFocus: true,
            type: "text",
            placeholder: "Enter folder name",
            validation: {
                required: "Folder name is required",
                minLength: { value: 2, message: "Minimum 2 characters required" },
            },
        },
    ];

    const handleSubmit = async (data: FolderFormValues) => {
        const folderName = data.folderName.trim();
        setLoading(true);
        try {
            const payload: CreateDirectory = { directoryName: folderName };
            if (folderId !== BASE_DIRECTORY_NAME) {
                payload.parentDirectoryId = folderId;
            }
            const response = await FileStorageApiClient.createDirectory(payload);
            showAlert("success", "Successfully created folder");
            onCreate(response.message);
        } catch (error) {
            console.error("Folder creation failed:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 border border-gray-700 p-6 rounded-2xl space-y-6 shadow-2xl w-full mx-auto">
            <h2 className="text-xl font-semibold text-white">Create New Folder</h2>
            <Form<FolderFormValues>
                fields={fields}
                onSubmit={handleSubmit}
                disabled={loading}
                loading={loading}
            />
        </div>
    );
};