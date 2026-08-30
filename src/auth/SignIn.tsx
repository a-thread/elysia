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
  const [isOAuthLoading, setIsOAuthLoading] = React.useState<string | null>(null);

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
        "Registration successful! A confirmation link has been sent to your email."
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
          <div className="mb-4">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              id="email"
              className={fieldClasses}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              id="password"
              className={fieldClasses}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>
          <div className="mb-2 text-right">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" isLoading={isLoggingIn} className="w-full" disabled={isLoggingIn || !isValid}>
              Sign In
            </Button>
            <Button
              btnType="secondary"
              isLoading={isRegistering}
              className="w-full"
              disabled={isRegistering || !isValid}
              onClick={handleSubmit(handleRegister)}
            >
              Register
            </Button>
          </div>
        </form>

        <div className="mt-6 mb-3 text-center text-sm text-gray-500 dark:text-gray-400">
          OR
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleOAuthLogin("google")}
            isLoading={isOAuthLoading === "google"}
          >
            <FaGoogle className="h-5 w-5" />
            Continue with Google
          </Button>
          <Button
            className="w-full flex items-center justify-center gap-2"
            onClick={() => handleOAuthLogin("github")}
            isLoading={isOAuthLoading === "github"}
          >
            <FaGithub className="h-5 w-5" />
            Continue with GitHub
          </Button>
        </div>
    </AuthLayout>
  );
};

export default SignIn;
