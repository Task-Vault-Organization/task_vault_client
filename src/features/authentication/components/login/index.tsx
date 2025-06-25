import { FC, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { AuthenticateUser } from "../../types/authenticate-user.ts";
import { AuthenticationService } from "../../services/authentication-service.ts";
import {Link, useNavigate} from "react-router";
import { FaSignInAlt, FaEnvelope, FaLock } from "react-icons/fa";
import { TitleWithIcon } from "../../../../shared/components/reusable/title-with-icon";
import { Form } from "../../../../shared/components/forms/form";
import { GoogleLogin } from "@react-oauth/google";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { AuthenticateUserGoogle } from "../../types/authenticate-user-google.ts";

interface LoginInput {
    email: string;
    password: string;
}

const fieldConfigs = [
    {
        name: "email",
        label: "Your email",
        type: "email",
        placeholder: "name@company.com",
        autoComplete: "off",
        icon: FaEnvelope,
        validation: {
            required: "Email is required",
            pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
                message: "Please enter a valid email address",
            },
        },
    },
    {
        name: "password",
        label: "Password",
        type: "password",
        placeholder: ". . . . . . . .",
        autoComplete: "new-password",
        icon: FaLock,
        validation: {
            required: "Password is required",
            minLength: {
                value: 8,
                message: "Password has a min length of 8",
            },
        },
    },
];

export const Login: FC = () => {
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<LoginInput> = async (data) => {
        const authenticateUser: AuthenticateUser = {
            email: data.email,
            password: data.password,
        };
        setLoading(true);
        try {
            await AuthenticationService.authenticateUser(authenticateUser, navigate);
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 sm:p-8 space-y-6 bg-accent-1">
                    <TitleWithIcon icon={FaSignInAlt} text="Log in to your account" />

                    <Form<LoginInput>
                        fields={fieldConfigs}
                        onSubmit={onSubmit}
                        loading={loading}
                        submitLabel="Log In"
                    />

                    <GoogleLogin
                        onSuccess={async (credentialResponse) => {
                            if (credentialResponse.credential) {
                                const authenticateUserGoogle: AuthenticateUserGoogle = {
                                    accessToken: credentialResponse.credential
                                };
                                setLoading(true);
                                try {
                                    await AuthenticationService.authenticateUserGoogle(authenticateUserGoogle);
                                } catch (error) {
                                } finally {
                                    setLoading(false);
                                }
                            }
                        }}
                        onError={() => {
                            showAlert("error", "Google Login Failed");
                        }}
                    />

                    <div className="flex items-center justify-end mt-2">
                        <a href="#" className="text-sm text-text-primary hover:underline dark:text-primary-500">
                            Forgot password?
                        </a>
                    </div>

                    <p className="text-sm text-center text-text-primary">
                        Don’t have an account yet?{" "}
                        <Link to="/sign-up" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};