import React, { useState } from "react";
import { supabase } from "../shared/services/supabase";
import { Button } from "../shared/components/Buttons";
import { useToast } from "../shared/services/toastManager";
import { Link } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const { displayToast } = useToast();

  const handlePasswordReset = async (e) => {
    e.preventDefault(); // ✅ Prevent form submission reload
    if (!email) {
      displayToast("Please enter your email.", "error");
      return;
    }

    setIsResetting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/elysia/reset-password`,
    });
    setIsResetting(false);

    if (error) {
      displayToast(error.message, "error");
    } else {
      displayToast("Password reset link sent to your email!", "success");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <form onSubmit={handlePasswordReset}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" isLoading={isResetting} className="w-full">
              {isResetting ? "Sending..." : "Send Reset Link"}
            </Button>
            <Link to="/sign-in">
              <Button btnType="secondary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
