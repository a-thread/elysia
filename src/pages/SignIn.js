import React, { useState } from "react";
import { supabase } from "../shared/services/supabase";
import { Button } from "../shared/components/Buttons";
import { useToast } from "../shared/services/toastManager";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { displayToast } = useToast();
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      displayToast(error.message, "error");
    } else {
      navigate("/");
    }
    setIsLoggingIn(false);
  };

  return (
    <div className="-mt-16 w-full h-screen fixed inset-0 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mb-2 text-right">
            <Link to="/forgot-password">Forgot password?</Link>
          </div>
          <div className="flex flex-col gap-2">
            <Button type="submit" isLoading={isLoggingIn} className="w-full">
              Sign In
            </Button>
            <Link to="/register">
              <Button btnType="secondary" className="w-full">
                Register
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
