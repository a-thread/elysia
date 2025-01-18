import React, { useState } from 'react';
import { supabase } from '../shared/services/supabase';
import { Button } from '../shared/components/Buttons';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../shared/services/toastManager';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { displayToast } = useToast();
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsResetting(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsResetting(false);

    if (error) {
      displayToast(error.message, 'error');
    } else {
      displayToast('Password updated successfully! You can now sign in.', 'success');
      navigate('/sign-in');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Reset Password</h2>
      <form onSubmit={handlePasswordUpdate}>
        {/* New Password Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="new-password"
            id="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
            placeholder=" "
          />
          <label htmlFor="new-password" className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100">
            New Password
          </label>
        </div>

        {/* Confirm Password Input */}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600 peer"
            placeholder=" "
          />
          <label htmlFor="confirm-password" className="absolute text-sm text-gray-500 transform -translate-y-6 scale-75 top-3 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100">
            Confirm Password
          </label>
        </div>

        {/* Display Validation Errors */}
        {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}

        {/* Reset Password Button */}
        <Button type="submit" isLoading={isResetting} className="w-full">
          Reset Password
        </Button>
      </form>
    </div>
  );
}

export default ResetPassword;
