import { FC } from "react";
import { GetUser } from "../../../../types/get-user.ts";

interface UsersListProps {
    users: GetUser[];
    onRemoveUser?: (userId: string) => void;
    userRemovable: boolean
}

export const UsersList: FC<UsersListProps> = ({ users, onRemoveUser, userRemovable = true }) => {
    const getColorFromEmail = (email: string) => {
        const colors = [
            "bg-red-200 text-red-800",
            "bg-blue-200 text-blue-800",
            "bg-green-200 text-green-800",
            "bg-yellow-200 text-yellow-800",
            "bg-purple-200 text-purple-800",
            "bg-pink-200 text-pink-800",
            "bg-indigo-200 text-indigo-800",
        ];

        const hash = email.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[hash % colors.length];
    };

    return (
        <div className="flex flex-wrap gap-2">
            {users.map((user) => (
                <div key={user.id} className="relative group">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${getColorFromEmail(user.email)} text-sm font-medium`}
                    >
                        {user.email.charAt(0).toUpperCase()}
                    </div>

                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs px-2 py-1 rounded shadow">
                        {user.email}
                    </div>

                    {
                        userRemovable &&
                        <button
                            onClick={() => onRemoveUser(user.id)}
                            className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                            aria-label={`Remove user ${user.email}`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-3 w-3 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    }
                </div>
            ))}
        </div>
    );
};