import { FC, useState, useEffect, useCallback } from "react";
import {GetUser} from "../../../../types/get-user.ts";
import {UsersApiClient} from "../../../../../api/clients/user-api-client.ts";

interface SearchUsersProps {
    onUserSelect?: (user: GetUser) => void;
    apiClient: typeof UsersApiClient;
    placeholder?: string;
    className?: string;
}

export const SearchUsers: FC<SearchUsersProps> = ({
     onUserSelect,
     apiClient,
     placeholder = "Search users...",
     className = ""}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<GetUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (!term.trim()) {
                setResults([]);
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await apiClient.searchUsers(term);
                setResults(response.users);
                setError(null);
            } catch (err) {
                setError("Failed to fetch users");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 1000),
        []
    );

    useEffect(() => {
        debouncedSearch(searchTerm);
    }, [searchTerm, debouncedSearch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setShowResults(true);
    };

    const handleUserSelect = (user: GetUser) => {
        // Removed: setSearchTerm(user.email);
        setShowResults(false);
        onUserSelect?.(user);
    };

    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 200);
    };

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setShowResults(true)}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-200 text-gray-200 rounded-md"
                />
                {isLoading && (
                    <div className="absolute right-3 top-2.5">
                        <LoadingSpinner />
                    </div>
                )}
            </div>

            {showResults && (results.length > 0 || error) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                    {error ? (
                        <div className="p-2 text-red-500">{error}</div>
                    ) : (
                        <ul className="py-1">
                            {results.map((user) => (
                                <li
                                    key={user.id}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleUserSelect(user)}
                                >
                                    {user.email}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

const LoadingSpinner: FC = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );
};

function debounce<T extends (...args: any[]) => any>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}