import { FC } from "react";
import { Link } from "react-router";

export const LandingPage: FC = () => {
    return (
        <div className="min-h-screen bg-[#11111a] text-white px-6 py-10 flex items-center justify-center">
            <div className="max-w-4xl w-full flex flex-col items-center text-center space-y-10">
                <h1 className="text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500 drop-shadow-lg">
                    Welcome to Task Vault
                </h1>
                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
                    Your smart and secure space for structured file submissions. Whether you're managing HR documents,
                    educational assignments, or collaborative reviews — Task Vault brings AI-enhanced organization to your workflow.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                    <div className="bg-[#22223b] p-6 rounded-2xl shadow-lg border border-[#2a2a3b]">
                        <h3 className="text-xl font-semibold mb-2 text-indigo-400">AI-Assisted File Review</h3>
                        <p className="text-sm text-gray-300">Instantly categorize, validate, and analyze files with built-in LLM assistance.</p>
                    </div>

                    <div className="bg-[#22223b] p-6 rounded-2xl shadow-lg border border-[#2a2a3b]">
                        <h3 className="text-xl font-semibold mb-2 text-pink-400">Task-Centric Workflow</h3>
                        <p className="text-sm text-gray-300">Define tasks, assign users, and track submission progress in real-time.</p>
                    </div>

                    <div className="bg-[#22223b] p-6 rounded-2xl shadow-lg border border-[#2a2a3b]">
                        <h3 className="text-xl font-semibold mb-2 text-green-400">Secure & Private</h3>
                        <p className="text-sm text-gray-300">Open-source backend with MinIO and JWT auth. No ads. No data harvesting.</p>
                    </div>
                </div>

                <div className="flex gap-6 mt-6">
                    <Link
                        to="/login"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full text-lg transition-all shadow-lg"
                    >
                        Get Started
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-300 hover:text-white border border-gray-500 px-6 py-3 rounded-full text-lg transition-all"
                    >
                        View GitHub
                    </a>
                </div>

                <footer className="text-xs text-gray-500 mt-10">
                    Built by Alin-Dragos Bălănescu • Scientific Coord. Cristina Marinescu • July 2025
                </footer>
            </div>
        </div>
    );
};