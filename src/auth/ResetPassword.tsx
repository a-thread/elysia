import React from "react";
import ResetPasswordForm from "@shared/components/ResetPasswordForm";
import { BiArrowBack } from "react-icons/bi";

const ResetPassword: React.FC = () => {
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
        <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
        <ResetPasswordForm />
      </div>
    </div>
  );
};

export default ResetPassword;
