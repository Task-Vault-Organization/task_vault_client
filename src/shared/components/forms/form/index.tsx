import { useState, ReactNode } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { Button } from "../../reusable/buttons/button";
import { FormField } from "../form-field";
import { TextAreaField } from "../text-area-field";
import { SelectField } from "../select-field";

type SupportedFieldType = "text" | "password" | "textarea" | "select" | "custom";

export interface FormFieldConfig {
    name: string;
    label: string;
    type?: SupportedFieldType;
    placeholder?: string;
    autoComplete?: string;
    options?: { id: number | string; name: string }[]; // Only for select
    validation?: object;
    customRender?: () => ReactNode;
    autoFocus?: boolean
}

interface FormProps<T extends FieldValues> {
    fields: FormFieldConfig[];
    onSubmit: SubmitHandler<T>;
    loading?: boolean;
    submitLabel?: string;
    defaultValues?: Partial<T>;
    enableHoneypot?: boolean;
    enableCooldown?: boolean;
    cooldownMs?: number;
    children?: ReactNode;
}

export const Form = <T extends FieldValues>({
    fields,
    onSubmit,
    loading = false,
    submitLabel = "Submit",
    defaultValues = {},
    enableHoneypot = true,
    enableCooldown = true,
    cooldownMs = 1000,
    children,
}: FormProps<T>) => {
    const [cooldown, setCooldown] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<T>({ defaultValues });

    const onValidSubmit: SubmitHandler<T> = (data) => {
        if (enableHoneypot && (data as any).honeypot) return;
        if (enableCooldown && cooldown) return;

        if (enableCooldown) {
            setCooldown(true);
            setTimeout(() => setCooldown(false), cooldownMs);
        }

        onSubmit(data);
    };

    return (
        <form className="space-y-6" onSubmit={handleSubmit(onValidSubmit)}>
            {enableHoneypot && (
                <input
                    type="text"
                    style={{ display: "none" }}
                    tabIndex={-1}
                    autoComplete="off"
                    {...register("honeypot" as any)}
                />
            )}

            {fields.map((field) => {
                const value = watch(field.name);
                const commonProps = {
                    labelText: field.label,
                    value,
                    setValue: (val: any) => setValue(field.name, val),
                    placeholder: field.placeholder,
                    error: errors[field.name],
                    autoFocus: field.autoFocus | false
                };

                switch (field.type) {
                    case "textarea":
                        return (
                            <TextAreaField
                                key={field.name}
                                rows={3}
                                {...commonProps}
                                {...register(field.name as any, field.validation)}
                            />
                        );
                    case "select":
                        return (
                            <SelectField
                                key={field.name}
                                options={field.options || []}
                                {...commonProps}
                                {...register(field.name as any, field.validation)}
                            />
                        );
                    case "password":
                        return (
                            <FormField
                                key={field.name}
                                type="password"
                                autoComplete={field.autoComplete}
                                name={field.name}
                                id={field.name}
                                {...commonProps}
                                {...register(field.name as any, field.validation)}
                            />
                        );
                    case "custom":
                        return <div key={field.name}>{field.customRender?.()}</div>;
                    case "text":
                    default:
                        return (
                            <FormField
                                key={field.name}
                                type="text"
                                autoComplete={field.autoComplete}
                                name={field.name}
                                id={field.name}
                                {...commonProps}
                                {...register(field.name as any, field.validation)}
                            />
                        );
                }
            })}

            {children}

            <div className="pt-4">
                <Button
                    type="submit"
                    fullWidth
                    loading={loading || isSubmitting}
                    disabled={isSubmitting || cooldown}
                >
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
};