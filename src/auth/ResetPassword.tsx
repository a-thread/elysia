import React from "react";
import ResetPasswordForm from "@shared/components/ResetPasswordForm";
import AuthLayout from "@shared/components/AuthLayout";

const ResetPassword: React.FC = () => {
  return (
    <AuthLayout title="Reset Password">
      <ResetPasswordForm />
    </AuthLayout>
  );
};

export default ResetPassword;
