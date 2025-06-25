import { FC, useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { TitleWithIcon } from "../../../../shared/components/reusable/title-with-icon";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { showAlert } from "../../../../shared/helpers/alerts-helpers.ts";
import { AuthenticateApiClient } from "../../../../api/clients/authenticate-api-client.ts";
import { Button } from "../../../../shared/components/reusable/buttons/button";

export const EmailConfirmationPage: FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [code, setCode] = useState(["", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [hasRequest, setHasRequest] = useState(false);
    const [sendingRequest, setSendingRequest] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [checked, setChecked] = useState(false);
    const [error, setError] = useState("");
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const checkRequest = async () => {
            if (!userId) return;
            setLoading(true);
            try {
                const res = await AuthenticateApiClient.checkEmailConfirmationRequests(userId);
                setHasRequest(res.emailConfirmationRequestsExist);
            } catch {
                setError("Could not check email confirmation status.");
            }
            setLoading(false);
            setChecked(true);
        };
        checkRequest();
    }, [userId]);

    const verifyCode = async () => {
        if (!userId) return;
        setVerifying(true);
        try {
            const codeStr = code.join("");
            await AuthenticateApiClient.verifyEmailConfirmationCode(userId, codeStr);
            showAlert("success", "Email verified successfully");
            navigate("/login");
        } catch {
        }
        setVerifying(false);
    };

    const sendRequest = async () => {
        if (!userId) return;
        setSendingRequest(true);
        try {
            await AuthenticateApiClient.createEmailConfirmationRequest(userId);
            setHasRequest(true);
            showAlert("success", "Verification email sent");
        } catch {
            showAlert("error", "Could not send confirmation email");
        }
        setSendingRequest(false);
    };

    const handleChange = (value: string, index: number) => {
        if (/^[a-zA-Z0-9]?$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);
            if (value && index < 4) {
                inputsRef.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && code[index] === "" && index > 0) {
            const newCode = [...code];
            newCode[index - 1] = "";
            setCode(newCode);
            inputsRef.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8 pt-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow dark:border dark:bg-gray-800 dark:border-gray-700">
                <div className="p-6 sm:p-8 space-y-6 bg-accent-1">
                    <TitleWithIcon icon={FaEnvelopeOpenText} text="Confirm Your Email" />
                    {error && <p className="text-center text-sm text-red-500">{error}</p>}
                    {!checked && (
                        <p className="text-center text-sm text-text-primary dark:text-white">
                            Checking confirmation status...
                        </p>
                    )}
                    {checked && !hasRequest && (
                        <div className="space-y-4">
                            <p className="text-center text-sm text-text-primary dark:text-white">
                                No confirmation request found. Do you want us to send one to your email?
                            </p>
                            <Button fullWidth onClick={sendRequest} loading={sendingRequest}>
                                Send Email
                            </Button>
                        </div>
                    )}
                    {checked && hasRequest && (
                        <div className="space-y-4">
                            <div className="flex justify-between gap-2">
                                {code.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) => (inputsRef.current[idx] = el)}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(e.target.value, idx)}
                                        onKeyDown={(e) => handleKeyDown(e, idx)}
                                        disabled={loading || verifying}
                                        className="w-12 h-14 text-center text-xl tracking-widest border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ))}
                            </div>
                            <Button fullWidth onClick={verifyCode} loading={verifying}>
                                Verify Code
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
