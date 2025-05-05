import { FC, useState } from "react";
import { GetTaskItem } from "../../types/get-task-item.ts";
import { SubmitPopup } from "../../../../shared/components/modals/submit-modal";
import { useAuthenticationStore } from "../../../authentication/stores/authentication-store.ts";
import { AuthenticationState } from "../../../authentication/types/authentication-state.ts";
import { GetUser } from "../../../../shared/types/get-user.ts";
import { GetTask } from "../../types/get-task.ts";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

interface Props {
    items: GetTaskItem[];
    canSubmit?: boolean;
    task: GetTask;
}

export const TaskItemList: FC<Props> = ({ items, canSubmit = false, task }) => {
    const [openPopupId, setOpenPopupId] = useState<string | null>(null);
    const user: GetUser = useAuthenticationStore((state: AuthenticationState) => state.user);
    const isOwner = user?.id === task.ownerId;
    const isAssigned = task.assignees?.some(a => a.id === user?.id);

    if (items.length === 0) return <p className="text-gray-400 italic">No task items added.</p>;

    return (
        <div>
            <h3 className="text-xl font-semibold text-white mb-3">Task Items</h3>
            {isAssigned && canSubmit && (
                <p className="text-lg font-medium text-gray-400 mb-5">
                    Double-click a task item to add a submission.
                </p>
            )}
            <ul className="space-y-4">
                {items.map(item => {
                    const isClickable = canSubmit && isAssigned;
                    return (
                        <li
                            key={item.id}
                            onDoubleClick={() => isClickable && setOpenPopupId(item.id)}
                            className={`relative p-5 rounded-xl border shadow-sm transition-all text-sm ${
                                isClickable
                                    ? "bg-gradient-to-r from-accent-2 to-accent-3 border-accent-3 hover:border-white cursor-pointer"
                                    : "bg-accent-2 border-accent-3"
                            }`}
                            title={isClickable ? "Double-click to submit" : undefined}
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <div className="text-lg text-white font-semibold">{item.title}</div>
                                    {item.description && (
                                        <p className="text-gray-300">{item.description}</p>
                                    )}

                                    {(item.fileType || item.fileCategory) && (
                                        <div className="flex flex-wrap items-center gap-3 mt-2">
                                            {item.fileType && (
                                                <span className="px-2 py-1 bg-blue-900 text-blue-300 text-xs rounded-full border border-blue-700">
                                                    File Type: {item.fileType.name} ({item.fileType.extension})
                                                </span>
                                            )}
                                            {item.fileCategory && (
                                                <span className="px-2 py-1 bg-green-900 text-green-300 text-xs rounded-full border border-green-700">
                                                    Category: {item.fileCategory.name}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {isClickable && (
                                    <div className="flex items-center gap-1 text-xs text-blue-400 bg-blue-900 bg-opacity-30 px-2 py-1 rounded-md">
                                        <PencilSquareIcon className="w-4 h-4" />
                                        <span>Submit</span>
                                    </div>
                                )}
                            </div>

                            {openPopupId === item.id && (
                                <SubmitPopup
                                    onClose={() => setOpenPopupId(null)}
                                    itemTitle={item.title}
                                />
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};