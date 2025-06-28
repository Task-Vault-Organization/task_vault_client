import { FC } from "react";
import { Link } from "react-router";
import { FaTasks } from "react-icons/fa"; // Using a nice task-related icon

export const HomePage: FC = () => {
    return (
        <div className="min-h-[calc(100vh-5rem)] px-6 py-10 flex flex-col items-center justify-center text-white text-center space-y-12">
            <div className="animate-bounce text-indigo-400 text-6xl mb-4">
                <FaTasks />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500 drop-shadow-lg">
                Welcome back to Task Vault
            </h1>

            <p className="max-w-xl text-gray-300 text-lg leading-relaxed">
                Your secure hub for managing tasks and structured file submissions.
                Review files, assign tasks, and get AI-enhanced feedback — all in one place.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl w-full">
                <Link
                    to="/files/root"
                    className="bg-[#22223b] hover:bg-[#2a2a3b] border border-gray-700 p-6 rounded-2xl shadow-md transition-all"
                >
                    <h3 className="text-xl font-semibold text-indigo-400 mb-2">My Files</h3>
                    <p className="text-sm text-gray-300">Access, upload, and organize your documents securely.</p>
                </Link>

                <Link
                    to="/tasks"
                    className="bg-[#22223b] hover:bg-[#2a2a3b] border border-gray-700 p-6 rounded-2xl shadow-md transition-all"
                >
                    <h3 className="text-xl font-semibold text-pink-400 mb-2">My Tasks</h3>
                    <p className="text-sm text-gray-300">Track assigned tasks, review files, and receive instant feedback.</p>
                </Link>

                <Link
                    to="/task/new"
                    className="bg-[#22223b] hover:bg-[#2a2a3b] border border-gray-700 p-6 rounded-2xl shadow-md transition-all"
                >
                    <h3 className="text-xl font-semibold text-green-400 mb-2">Create Task</h3>
                    <p className="text-sm text-gray-300">Define a new structured submission workflow for your team.</p>
                </Link>
            </div>
        </div>
    );
};