import { FC } from "react";

interface TaskTabsProps {
    activeTab: "owned" | "assigned";
    setActiveTab: (tab: "owned" | "assigned") => void;
}

export const TaskTabs: FC<TaskTabsProps> = ({ activeTab, setActiveTab }) => (
    <div className="flex justify-center space-x-6">
        <button
            onClick={() => setActiveTab("owned")}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
                activeTab === "owned"
                    ? "bg-accent-2 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-accent-1"
            }`}
        >
            Owned Tasks
        </button>
        <button
            onClick={() => setActiveTab("assigned")}
            className={`px-4 py-2 rounded-md font-semibold transition-all ${
                activeTab === "assigned"
                    ? "bg-accent-2 text-white shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-accent-1"
            }`}
        >
            Assigned Tasks
        </button>
    </div>
);