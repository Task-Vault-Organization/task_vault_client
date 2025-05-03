import {FC, FormEvent, useState} from "react";
import {AuthenticateUser} from "../../types/authenticate-user.ts";
import {AuthenticationService} from "../../services/authentication-service.ts";
import {Link} from "react-router";
import {FaSignInAlt} from "react-icons/fa";
import {TitleWithIcon} from "../../../../shared/components/reusable/title-with-icon";
import {Button} from "../../../../shared/components/reusable/buttons/button";
import {FormField} from "../../../../shared/components/forms/form-field";
import {InputValidatorFactory, InputValidatorTypes} from "../../../../shared/helpers/validation-helpers.ts";

export const Login: FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const authenticateUser: AuthenticateUser = {
            email,
            password
        };
        await AuthenticationService.authenticateUser(authenticateUser);
    };

    return (
        <div className={'flex justify-center items-center min-h-[calc(100vh-5rem)] pt-20'}>
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8 bg-accent-1">
                    <TitleWithIcon
                        icon={FaSignInAlt}
                        text="Log in to your account"
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
                            validator={InputValidatorFactory.create(InputValidatorTypes.Email)}
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
                        <Button
                            type={'submit'}
                            fullWidth
                        >
                            Log In
                        </Button>
                        <p className="text-sm font-light text-text-primary">
                            Don’t have an account yet? <Link to="/sign-up" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};