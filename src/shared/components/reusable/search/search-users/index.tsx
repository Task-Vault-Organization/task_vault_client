import { FC, useCallback, useEffect, useState } from "react";
import {GetUser} from "../../../../types/get-user.ts";
import {UsersApiClient} from "../../../../../api/clients/user-api-client.ts";

interface Props {
    onUserSelect: (user: GetUser) => void;
    placeholder?: string;
}

export const UserSearchField: FC<Props> = ({ onUserSelect, placeholder = "Search users..." }) => {
    const [query, setQuery] = useState("");
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
                const response = await UsersApiClient.searchUsers(term);
                setResults(response.users || []);
                setError(null);
            } catch (err) {
                setError("Failed to fetch users");
            } finally {
                setIsLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowResults(true);
    };

    const handleSelect = (user: GetUser) => {
        onUserSelect(user);
        setQuery("");
        setResults([]);
        setShowResults(false);
    };

    const handleBlur = () => {
        setTimeout(() => setShowResults(false), 200); // wait for click to register
    };

    return (
        <div className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={() => setShowResults(true)}
                placeholder={placeholder}
                className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />

            {showResults && (
                <div className="absolute z-50 mt-1 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                    {isLoading && <div className="p-2 text-sm text-gray-400">Searching...</div>}
                    {error && <div className="p-2 text-sm text-red-400">{error}</div>}
                    {!isLoading && results.length === 0 && query && (
                        <div className="p-2 text-sm text-gray-400">No users found.</div>
                    )}
                    <ul>
                        {results.map((user) => (
                            <li
                                key={user.id}
                                className="p-2 text-sm text-white hover:bg-blue-600 cursor-pointer transition-colors"
                                onClick={() => handleSelect(user)}
                            >
                                {user.email}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}