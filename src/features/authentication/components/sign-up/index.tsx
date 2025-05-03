import {FC, FormEvent, useState} from "react";
import {AuthenticateApiClient} from "../../../../api/clients/authenticate-api-client.ts";
import {CreateUser} from "../../types/create-user.ts";
import {Link} from "react-router";
import {FaSignInAlt, FaUserPlus} from "react-icons/fa";
import {TitleWithIcon} from "../../../../shared/components/reusable/title-with-icon";
import {Button} from "../../../../shared/components/reusable/buttons/button";
import {FormField} from "../../../../shared/components/forms/form-field";

export const SignUp: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newUser: CreateUser = {
            email,
            password
        }
        await AuthenticateApiClient.createUser(newUser);
    };

    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-5rem)] pt-20'}>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-accent-1">
                    <TitleWithIcon
                        icon={FaUserPlus}
                        text="Sign Up"
                    />
                    <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                        <FormField
                            value={email}
                            setValue={setEmail}
                            labelText={'Your email'}
                            type="email"
                            name="email"
                            id="email"
                            placeholder="name@company.com"
                        />
                        <FormField
                            value={password}
                            setValue={setPassword}
                            labelText={'Password'}
                            type="password"
                            name="password"
                            id="password"
                            placeholder=". . . . . . . ."
                        />
                        <div className="flex items-center justify-between">
                            <a href="#" className="ml-auto text-sm font-medium text-text-primary hover:underline dark:text-primary-500">Forgot password?</a>
                        </div>
                        <Button fullWidth>
                            Sign Up
                        </Button>
                        <p className="text-sm font-light text-text-primary">
                            Already have an account? <Link to={'/login'} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Log In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};