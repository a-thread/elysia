import React from 'react';
import ResetPasswordForm from "../shared/components/ResetPasswordForm";
import TitleDescHeader from '@shared/components/TitleDescHeader';
import Card from '@shared/components/Card';

const ProfilePage: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto p-6 flex flex-col">
            <TitleDescHeader
                classes="mb-4"
                title="Profile"
            />

            <Card>
                <h2 className="text-xl font-semibold text-leaf-green-800 dark:text-leaf-green-100 mb-3">
                    Reset Password
                </h2>
                <ResetPasswordForm />
            </Card>
        </div>
    );
};

export default ProfilePage;
