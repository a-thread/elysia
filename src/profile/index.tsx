import React from 'react';
import ResetPasswordForm from "../shared/components/ResetPasswordForm";
import TitleDescHeader from '@shared/components/TitleDescHeader';

const ProfilePage: React.FC = () => {
    return (
        <div className="max-w-5xl mx-auto p-6 flex flex-col">
            <TitleDescHeader
                classes="mb-4"
                title="Profile"
            />

            <section className="mt-3 mb-3">
                <h2>Reset Password</h2>
                <ResetPasswordForm />
            </section>
        </div>
    );
};

export default ProfilePage;