import { FC, useState } from "react";
import {BaseModal} from "../base-modal";
import { Button } from "../../reusable/buttons/button";

interface Props {
    onClose: () => void;
    itemTitle: string;
}

export const SubmitPopup: FC<Props> = ({ onClose, itemTitle }) => {
    const [answer, setAnswer] = useState<string>("");

    const handleSubmit = () => {
        console.log("Submitted answer:", answer);
        onClose();
    };

    return (
        <BaseModal
            isOpen={true}
            onClose={onClose}
            title={`Submit Answer – ${itemTitle}`}
            footer={
                <>
                    <Button onClick={onClose} variant="secondary" className="bg-gray-600 hover:bg-gray-700">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
                        Submit
                    </Button>
                </>
            }
        >
            <label htmlFor="answer" className="block text-sm font-medium text-gray-200 mb-2">
                Your Answer
            </label>
            <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={6}
                className="w-full rounded-md bg-accent-1 border border-gray-600 text-sm text-white p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write your answer here..."
            />
        </BaseModal>
    );
};