import {FC, FormEvent, useState} from "react";
import {CreateUser} from "../../types/create-user.ts";
import {AuthenticateApiClient} from "../../../../api/clients/authenticate-api-client.ts";
import {AuthenticateUser} from "../../types/authenticate-user.ts";
import {AuthenticateUserResponse} from "../../types/authenticate-user-response.ts";
import {showAlert} from "../../../../shared/helpers/alerts-helpers.ts";
import {BaseApiResponse} from "../../../../shared/types/base-api-response.ts";
import {AuthenticationService} from "../../services/authentication-service.ts";

export const Login: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const authenticateUser: AuthenticateUser = {
            email,
            password
        }
        await AuthenticationService.authenticateUser(authenticateUser);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log In</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700">Password</label>
                        <input
                            type="password"
                            className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
                    >
                        Log In
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 w-96">
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5" />
                            <span className="text-gray-700 font-medium">Sign in with Google</span>
                    </button>
                </form>
            </div>
        </div>
    );
};