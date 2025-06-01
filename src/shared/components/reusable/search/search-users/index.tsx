import { FC, useCallback, useEffect, useState, useRef } from "react";
import { GetUser } from "../../../../types/get-user.ts";
import { UsersApiClient } from "../../../../../api/clients/user-api-client.ts";
import { motion } from "framer-motion";
import { FiPlus, FiMinus } from "react-icons/fi";

interface Props {
    onUserSelect: (user: GetUser) => void;
    onUserDeselect: (userId: string) => void;
    selectedUsers: GetUser[];
    placeholder?: string;
    excludedUserIds?: string[];
}

export const UserSearchField: FC<Props> = ({
                                               onUserSelect,
                                               onUserDeselect,
                                               selectedUsers,
                                               placeholder = "Search users...",
                                               excludedUserIds
                                           }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<GetUser[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const containerRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useCallback(
        debounce(async (term: string) => {
            if (term.length < 3) return
            if (!term.trim()) {
                setResults([]);
                return;
            }

            try {
                setIsLoading(true);
                const response = await UsersApiClient.searchUsers(term);
                setResults(response.users || []);
                setError(null);
            } catch {
                setError("Failed to fetch users");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(query);
    }, [query, debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        if (!showResults) setShowResults(true);
    };

    const handleSelect = (user: GetUser) => {
        const isAlreadySelected = selectedUsers.some((u) => u.id === user.id);
        const isExcluded = excludedUserIds?.includes(user.id);

        if (isExcluded) return;

        if (isAlreadySelected) {
            onUserDeselect(user.id);
        } else {
            onUserSelect(user);
        }
    };

    const dropdownVisible = showResults && query.trim();

    return (
        <div ref={containerRef} className="relative w-full">
            <input
                type="text"
                value={query}
                onChange={handleChange}
                onFocus={() => {
                    setShowResults(true);
                    if (query.trim()) {
                        debouncedSearch.cancel?.();
                        debouncedSearch(query);
                    }
                }}
                placeholder={placeholder}
                className="w-full p-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
            />

            <motion.div
                initial={false}
                animate={dropdownVisible ? "open" : "closed"}
                variants={{
                    open: { opacity: 1, y: 0, display: "block", transition: { duration: 0.15 } },
                    closed: { opacity: 0, y: -5, transitionEnd: { display: "none" }, transition: { duration: 0.15 } }
                }}
                className="absolute mt-1 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto"
            >
                {dropdownVisible && (
                    <>
                        {isLoading && (
                            <div className="p-3 text-sm text-gray-400">Searching...</div>
                        )}
                        {error && (
                            <div className="p-3 text-sm text-red-400">{error}</div>
                        )}
                        {!isLoading && results.length === 0 && (
                            <div className="p-3 text-sm text-gray-500">No users found.</div>
                        )}
                        <ul>
                            {results.map((user) => {
                                const isSelected = selectedUsers.some((u) => u.id === user.id);
                                return (
                                    <li
                                        key={user.id}
                                        onClick={() => handleSelect(user)}
                                        className={`px-4 py-2 text-sm flex justify-between items-center transition-colors cursor-pointer ${
                                            isSelected
                                                ? "bg-accent-2 text-white"
                                                : "text-white"
                                        }`}
                                    >
                                        <span>{user.email}</span>
                                        <span className="ml-3">
                                            {isSelected ? (
                                                <FiMinus className="text-blue-300 w-4 h-4" />
                                            ) : (
                                                <FiPlus className="text-blue-300 w-4 h-4" />
                                            )}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </motion.div>
        </div>
    );
};

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
    let timeout: NodeJS.Timeout;
    const debounced = function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
    debounced.cancel = () => clearTimeout(timeout);
    return debounced as T & { cancel: () => void };
}