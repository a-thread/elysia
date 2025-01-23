import React, { useState, FormEvent, ChangeEvent } from "react";
import { supabase } from "@shared/services/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@shared/components/Toast";
import { Button } from "@shared/components/Buttons";

const ResetPassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const toast = useToast();
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsResetting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsResetting(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated successfully! You can now sign in.");
      navigate("/sign-in");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-row justify-center m-2">
          <img
            src="https://bbosgvxsamxhzjgzxiuz.supabase.co/storage/v1/object/public/elysia_recipe_photo/echlorotica_nature-removebg-preview_1737171542691_7626.png"
            className="h-28"
            alt="Elysia Chloratica"
          />
        </div>
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
        <form onSubmit={handlePasswordUpdate}>
          {/* New Password Input */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="new-password"
              id="new-password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={newPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              required
            />
            <label
              htmlFor="new-password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              New Password
            </label>
          </div>

          {/* Confirm Password Input */}
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-hidden focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              value={confirmPassword}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              required
            />
            <label
              htmlFor="confirm-password"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:rtl:translate-x-1/4 peer-focus:rtl:left-auto peer-focus:text-blue-600 dark:peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Confirm Password
            </label>
          </div>

          {/* Display Validation Errors */}
          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          {/* Reset Password Button */}
          <Button type="submit" isLoading={isResetting} className="w-full">
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
