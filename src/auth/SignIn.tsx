import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Button } from "@shared/components/Buttons";
import { UserService } from "@shared/services/UserService";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { BiArrowBack } from "react-icons/bi";
import { useForm } from "react-hook-form";

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
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center font-medium text-leaf-green-600 dark:text-leaf-green-100">
          <BiArrowBack className="size-6" title="back" onClick={() => window.history.back()} />
        </div>
        <div className="flex flex-row justify-center m-2">
          <img
            src="https://bbosgvxsamxhzjgzxiuz.supabase.co/storage/v1/object/public/elysia_recipe_photo/echlorotica_nature-removebg-preview_1737171542691_7626.png"
            className="h-28"
            alt="Elysia Chloratica"
          />
        </div>
        <h2 className="text-xl font-bold text-leaf-green-600 dark:text-white mb-4 text-center">
          Sign In
        </h2>
        <form onSubmit={handleSubmit(handleSignIn)}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              id="password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
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
      </div>
    </div>
  );
};

export default SignIn;
