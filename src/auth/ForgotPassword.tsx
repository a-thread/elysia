import React, { useState, FormEvent, ChangeEvent } from "react";
import { useToast } from "@shared/components/Toast";
import { Button } from "@shared/components/Buttons";
import { UserService } from "@shared/services/UserService";
import { BiArrowBack } from "react-icons/bi";

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
        <h2 className="text-xl font-bold mb-4 text-center text-leaf-green-600 dark:text-white">
          Reset Password
        </h2>
        <form onSubmit={handlePasswordReset}>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email
            </label>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" isLoading={isResetting} className="w-full">
              {isResetting ? "Sending..." : "Send Reset Link"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
