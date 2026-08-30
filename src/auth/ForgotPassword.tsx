import React, { useState, FormEvent, ChangeEvent } from "react";
import { useToast } from "@shared/components/Toast";
import { Button } from "@shared/components/Buttons";
import { UserService } from "@shared/services/UserService";
import AuthLayout from "@shared/components/AuthLayout";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const toast = useToast();

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email.");
      return;
    }
    try {
      setIsResetting(true);
      await UserService.resetPassword(
        email,
        `${window.location.origin}/elysia/reset-password`
      );
      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <AuthLayout title="Reset Password">
      <form onSubmit={handlePasswordReset}>
        <div className="mb-4">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            type="email"
            name="email"
            id="email"
            className={fieldClasses}
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
          />
        </div>
        <div className="flex flex-col gap-2">
          <Button type="submit" isLoading={isResetting} className="w-full">
            {isResetting ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
