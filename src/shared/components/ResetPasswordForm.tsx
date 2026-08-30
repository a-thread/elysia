import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@shared/components/Buttons";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { UserService } from "@shared/services/UserService";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";

interface FormInputs {
    newPassword: string;
    confirmPassword: string;
}

const ResetPasswordForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
      } = useForm<FormInputs>({
        mode: "onChange", // or "onTouched" / "all"
      });

    const toast = useToast();
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<FormInputs> = async (data) => {
        try {
            await UserService.updatePassword(data.newPassword);
            toast.success("Password updated successfully! You can now sign in.");
            await UserService.signOut();
            navigate("/sign-in");
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const newPassword = watch("newPassword");

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* New Password Input */}
            <div className="mb-4 mt-2">
                <FieldLabel htmlFor="new-password">New Password</FieldLabel>
                <input
                    type="password"
                    id="new-password"
                    className={fieldClasses}
                    {...register("newPassword", {
                        required: "New password is required.",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long.",
                        },
                    })}
                />
                {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                )}
            </div>

            {/* Confirm Password Input */}
            <div className="mb-4">
                <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                <input
                    type="password"
                    id="confirm-password"
                    className={fieldClasses}
                    {...register("confirmPassword", {
                        required: "Please confirm your password.",
                        validate: (value) =>
                            value === newPassword || "Passwords do not match.",
                    })}
                />
                {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
            </div>

            {/* Reset Password Button */}
            <Button
                type="submit"
                isLoading={isSubmitting}
                className="w-full"
                disabled={isSubmitting || !isValid}
            >
                Reset Password
            </Button>
        </form>
    );
};

export default ResetPasswordForm;