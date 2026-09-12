import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Button } from "@shared/components/Buttons";
import { UserService } from "@shared/services/UserService";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import AuthLayout from "@shared/components/AuthLayout";
import { FieldLabel, fieldClasses } from "@shared/components/FormField";

interface FormInputs {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormInputs>({
    mode: "onChange",
  });

  const [isLoggingIn, setIsLoggingIn] = React.useState<boolean>(false);
  const [isRegistering, setIsRegistering] = React.useState<boolean>(false);
  const [isOAuthLoading, setIsOAuthLoading] = React.useState<string | null>(
    null,
  );

  const toast = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (data: FormInputs) => {
    try {
      setIsLoggingIn(true);
      await UserService.signIn(data.email, data.password);
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (data: FormInputs) => {
    try {
      setIsRegistering(true);
      await UserService.signUp(data.email, data.password);
      toast.success(
        "Registration successful! A confirmation link has been sent to your email.",
      );
      navigate("/");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsRegistering(false);
    }
  };

  const handleOAuthLogin = async (provider: "google" | "github") => {
    try {
      setIsOAuthLoading(provider);
      await UserService.signInWithProvider(provider);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsOAuthLoading(null);
    }
  };

  return (
    <AuthLayout title="Sign In">
      <form onSubmit={handleSubmit(handleSignIn)}>
        <div className="mb-3">
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            id="email"
            className={fieldClasses}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div className="mb-3">
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            id="password"
            className={fieldClasses}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
        <div className="mb-2 text-right">
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            isLoading={isLoggingIn}
            className="flex-1"
            disabled={isLoggingIn || !isValid}
          >
            Sign In
          </Button>
          <Button
            btnType="secondary"
            isLoading={isRegistering}
            className="flex-1"
            disabled={isRegistering || !isValid}
            onClick={handleSubmit(handleRegister)}
          >
            Register
          </Button>
        </div>
      </form>

      <div className="flex items-center gap-3 mt-4 mb-4">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          or continue with
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      </div>

      <div className="flex gap-2">
        <Button
          btnType="secondary"
          className="flex-1 flex items-center justify-center"
          onClick={() => handleOAuthLogin("google")}
          isLoading={isOAuthLoading === "google"}
          aria-label="Continue with Google"
        >
          <FaGoogle className="h-5 w-5" />
        </Button>
        <Button
          btnType="secondary"
          className="flex-1 flex items-center justify-center"
          onClick={() => handleOAuthLogin("github")}
          isLoading={isOAuthLoading === "github"}
          aria-label="Continue with GitHub"
        >
          <FaGithub className="h-5 w-5" />
        </Button>
      </div>
    </AuthLayout>
  );
};

export default SignIn;
