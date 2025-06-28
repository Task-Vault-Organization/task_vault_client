import { FC, useEffect, useState } from "react";
import { ArrowDownTrayIcon, ClipboardIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { FileStorageApiClient } from "../../../../api/clients/file-storage-api-client.ts";
import { LlmApiClient } from "../../../../api/clients/llm-api-client.ts";
import { BaseModal } from "../base-modal";
import { Spinner } from "../../reusable/loading/spinner";
import { CustomBgButton } from "../../reusable/buttons/custom-bg-button";
import { FormField } from "../../forms/form-field";

interface FileViewerModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    fileId: string;
    fileType: string;
    fileName?: string;
}

export const FileViewerModal: FC<FileViewerModalProps> = ({
                                                              open,
                                                              setOpen,
                                                              fileId,
                                                              fileType,
                                                              fileName,
                                                          }) => {
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [fileContent, setFileContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [isExtractingJson, setIsExtractingJson] = useState(false);
    const [extractedJson, setExtractedJson] = useState<any | null>(null);
    const [showJson, setShowJson] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    useEffect(() => {
        if (open && fileId) {
            prepareFile();
            loadCachedJson();
        }

        return () => {
            if (fileUrl) {
                URL.revokeObjectURL(fileUrl);
            }
        };
    }, [open, fileId]);

    const prepareFile = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await FileStorageApiClient.downloadFile(fileId);
            const blob = new Blob([response], { type: getMimeType(fileType) });
            const url = URL.createObjectURL(blob);
            setFileUrl(url);
            if (fileType.toLowerCase() === "txt" || fileType.toLowerCase() === "json") {
                const text = await blob.text();
                if (fileType.toLowerCase() === "json") {
                    try {
                        setFileContent(JSON.stringify(JSON.parse(text), null, 2));
                    } catch {
                        setFileContent(text);
                    }
                } else {
                    setFileContent(text);
                }
            }
        } catch {
            setError("Failed to load file. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const loadCachedJson = () => {
        const cached = localStorage.getItem(`extracted-json-${fileId}`);
        if (cached) {
            try {
                setExtractedJson(JSON.parse(cached));
            } catch {
                setExtractedJson(null);
            }
        }
    };

    const saveJsonToCache = (json: any) => {
        localStorage.setItem(`extracted-json-${fileId}`, JSON.stringify(json));
    };

    const handleDownload = async () => {
        try {
            const response = await FileStorageApiClient.downloadFile(fileId);
            const blob = new Blob([response], { type: getMimeType(fileType) });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", fileName || `file.${fileType}`);
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 100);
        } catch {
            setError("Download failed. Please try again.");
        }
    };

    const handleExtractJson = async () => {
        try {
            setJsonError(null);
            setIsExtractingJson(true);
            const result = await LlmApiClient.extractJsonFromImage(fileId);
            setExtractedJson(result);
            saveJsonToCache(result);
            setShowJson(true);
        } catch {
            setJsonError("Failed to extract structured data. Please try again.");
        } finally {
            setIsExtractingJson(false);
        }
    };

    const getMimeType = (extension?: string) => {
        if (!extension) return "application/octet-stream";
        const types: Record<string, string> = {
            png: "image/png",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            gif: "image/gif",
            pdf: "application/pdf",
            txt: "text/plain",
            json: "application/json",
            csv: "text/csv",
            doc: "application/msword",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ppt: "application/vnd.ms-powerpoint",
            pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        };
        return types[extension.toLowerCase()] || "application/octet-stream";
    };

    const renderJsonFields = () => {
        if (!extractedJson) return null;

        const flattenJson = (obj: any, prefix = ""): Record<string, string> => {
            return Object.entries(obj).reduce((acc, [key, val]) => {
                const newKey = prefix ? `${prefix}.${key}` : key;
                const finalKey = newKey.startsWith("labelData.") ? newKey.replace(/^labelData\./, "") : newKey;
                if (val !== null && typeof val === "object" && !Array.isArray(val)) {
                    Object.assign(acc, flattenJson(val, finalKey));
                } else if (Array.isArray(val)) {
                    val.forEach((item, idx) => {
                        if (item !== null && typeof item === "object") {
                            Object.assign(acc, flattenJson(item, `${finalKey}[${idx}]`));
                        } else {
                            acc[`${finalKey}[${idx}]`] = String(item);
                        }
                    });
                } else {
                    acc[finalKey] = String(val);
                }
                return acc;
            }, {} as Record<string, string>);
        };

        const flattened = flattenJson(extractedJson);

        return (
            <div className="custom-scroll space-y-4 overflow-y-auto max-h-[60vh] p-4 bg-gray-800 rounded-lg">
            {Object.entries(flattened).map(([key, value]) => (
                    <div key={key} className="relative">
                        <FormField
                            value={value}
                            setValue={() => {}}
                            labelText={key}
                            readOnly
                        />
                        <button
                            className="absolute top-9 right-3 text-gray-400 hover:text-white"
                            onClick={() => {
                                navigator.clipboard.writeText(value);
                                setCopiedKey(key);
                                setTimeout(() => setCopiedKey(null), 1500);
                            }}
                            title="Copy"
                        >
                            <ClipboardIcon className="w-5 h-5" />
                        </button>
                        {copiedKey === key && (
                            <div className="absolute top-2 right-10 text-xs bg-gray-700 text-white px-2 py-1 rounded shadow-md transition-opacity duration-300 ease-in-out opacity-100 animate-fade-in-out">
                                Copied!
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderTextOrJsonFile = () => fileContent ? (
        <div className="flex-1 w-full p-4 font-mono text-sm whitespace-pre-wrap overflow-auto text-white bg-gray-800 rounded border border-gray-700">
            {fileContent}
        </div>
    ) : null;

    const renderImage = () => fileUrl ? (
        <div className="flex flex-col items-center p-4">
            <img src={fileUrl} alt={fileName || "Image preview"} className="max-h-[50vh] max-w-full object-contain border rounded" />
            {jsonError && <p className="text-sm text-red-500 mt-4">{jsonError}</p>}
        </div>
    ) : null;

    const renderPdf = () => fileUrl ? (
        <iframe src={fileUrl} className="w-full flex-1 rounded border" title={fileName || "PDF Preview"} />
    ) : null;

    const renderFilePreview = () => {
        const type = fileType.toLowerCase();
        if (["txt", "json"].includes(type)) return renderTextOrJsonFile();
        if (["png", "jpg", "jpeg", "gif"].includes(type)) return renderImage();
        if (type === "pdf") return renderPdf();
        return (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4 p-4">
                <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
                <p className="text-lg font-medium text-gray-300">Preview not available for this file type</p>
                <p className="text-sm text-gray-500">You can still download the file to view it.</p>
            </div>
        );
    };

    return <BaseModal
        isOpen={open}
        onClose={() => setOpen(false)}
        title={fileName || "File Preview"}
        contentClassName="bg-gray-900 max-h-[90vh] overflow-hidden"
    >
        <div className="flex justify-between items-center mb-2">
            <div className="flex gap-2">
                <CustomBgButton
                    onClick={handleExtractJson}
                    background="bg-emerald-600 hover:bg-emerald-700"
                    disabled={isExtractingJson}
                >
                    {isExtractingJson ? "Extracting..." : "Extract Text"}
                </CustomBgButton>
                {extractedJson && !isExtractingJson && (
                    <CustomBgButton
                        onClick={() => setShowJson(!showJson)}
                        background="bg-slate-600 hover:bg-slate-700"
                    >
                        {showJson ? "Hide Extracted Data" : "View Extracted Data"}
                    </CustomBgButton>
                )}
            </div>
            <button
                onClick={handleDownload}
                className="rounded-md p-2 text-gray-400 hover:bg-gray-800 hover:text-white"
                title="Download"
            >
                <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
        </div>
        {isLoading ? (
            <div className="flex h-96 items-center justify-center">
                <Spinner />
            </div>
        ) : error ? (
            <div className="flex h-96 flex-col items-center justify-center space-y-4 text-red-500">
                <ExclamationTriangleIcon className="h-12 w-12" />
                <p className="text-lg font-medium">{error}</p>
            </div>
        ) : (
            <div className="flex-1 min-h-0 flex flex-col overflow-auto rounded-lg border border-gray-700 bg-gray-800">
                {showJson ? renderJsonFields() : renderFilePreview()}
            </div>
        )}
    </BaseModal>;
};