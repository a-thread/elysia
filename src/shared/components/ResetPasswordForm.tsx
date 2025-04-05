import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@shared/components/Buttons";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { UserService } from "@shared/services/UserService";

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
            <div className="relative z-0 w-full mb-5 group mt-2">
                <input
                    type="password"
                    id="new-password"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("newPassword", {
                        required: "New password is required.",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long.",
                        },
                    })}
                />
                <label
                    htmlFor="new-password"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    New Password
                </label>
                {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
                )}
            </div>

            {/* Confirm Password Input */}
            <div className="relative z-0 w-full mb-5 group">
                <input
                    type="password"
                    id="confirm-password"
                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    {...register("confirmPassword", {
                        required: "Please confirm your password.",
                        validate: (value) =>
                            value === newPassword || "Passwords do not match.",
                    })}
                />
                <label
                    htmlFor="confirm-password"
                    className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                    Confirm Password
                </label>
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