import { FC, useState } from "react";
import { Link, useNavigate } from "react-router";
import { FaUserPlus, FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { TitleWithIcon } from "../../../../shared/components/reusable/title-with-icon";
import { AuthenticationService } from "../../services/authentication-service.ts";
import { Form } from "../../../../shared/components/forms/form";

interface IFormInput {
    email: string;
    password: string;
    fullName: string;
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
        name: "fullName",
        label: "Full name",
        type: "text",
        placeholder: "Full name",
        autoComplete: "off",
        icon: FaUser,
        validation: {
            required: "Full name is required",
            pattern: {
                value: /^[a-zA-Z\s'-]+$/,
                message: "The name contains unsupported characters",
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
                message: "Password must be at least 8 characters",
            },
        },
    },
];

export const SignUp: FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const onSubmit = async (data: IFormInput) => {
        setLoading(true);
        try {
            await AuthenticationService.createUser(data);
            navigate("/login");
        } catch (e) {
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)] px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 sm:p-8 space-y-6 bg-accent-1">
                    <TitleWithIcon icon={FaUserPlus} text="Sign Up" />

                    <Form<IFormInput>
                        fields={fieldConfigs}
                        onSubmit={onSubmit}
                        loading={loading}
                        submitLabel="Sign Up"
                    />

                    <p className="text-sm text-center text-text-primary">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};