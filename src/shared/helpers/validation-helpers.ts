export interface InputValidator {
    isInputValid: (input: string) => boolean
}

export enum InputValidatorTypes {
    Email
}

export class InputValidatorFactory {
    static create(type: InputValidatorTypes) : InputValidator {
        switch (type) {
            case InputValidatorTypes.Email:
                return new EmailValidator()
            default:
                return null;
        }
    }
}

class EmailValidator implements InputValidator {
    isInputValid(input: string): boolean {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return emailRegex.test(input);
    }
}