import UserHeader from '@/components/UserHeader';
import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";

export const Route = createFileRoute('/accountSetting')({
  component: AccountSettings,
})

export default function AccountSettings() {
 // const navigate = useNavigate();
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handlePasswordChange = (field: string, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: string) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field as keyof typeof showPasswords] }));
  };

  const handleSavePassword = () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      alert('Please fill in all fields');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      alert('New passwords do not match');
      return;
    }
    // Add password change logic here
    console.log('Changing password...');
    alert('Password changed successfully!');
    setPasswords({ current: "", new: "", confirm: "" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <UserHeader />

      <main className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          {/* <button
            onClick={() => navigate({ to: '/profile' })}
            className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-4 transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span className="text-sm font-medium">Back to Profile</span>
          </button> */}
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Account Settings
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your account security and preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">lock</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Change Password</h2>
            </div>
            
            <div className="space-y-5">
              {[
                { field: "current", label: "Current Password", placeholder: "Enter your current password" },
                { field: "new", label: "New Password", placeholder: "Enter a new password" },
                { field: "confirm", label: "Confirm New Password", placeholder: "Confirm your new password" }
              ].map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <input
                      id={field}
                      type={showPasswords[field as keyof typeof showPasswords] ? "text" : "password"}
                      placeholder={placeholder}
                      value={passwords[field as keyof typeof passwords]}
                      onChange={(e) => handlePasswordChange(field, e.target.value)}
                      className="w-full h-12 rounded-lg text-slate-900 dark:text-white border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 px-4 pr-12 text-sm transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility(field)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      <span className="material-symbols-outlined text-xl">
                        {showPasswords[field as keyof typeof showPasswords] ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Password Requirements */}
            <div className="mt-5 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Password requirements:
              </p>
              <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Contains uppercase and lowercase letters
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Contains at least one number
                </li>
              </ul>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setPasswords({ current: "", new: "", confirm: "" })}
                className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePassword}
                className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20"
              >
                <span className="material-symbols-outlined text-lg">check</span>
                Change Password
              </button>
            </div>
          </div>

          {/* Account Information */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Account Information</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Email Address</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">jane.doe@example.com</p>
                </div>
                <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                  Change
                </button>
              </div>
              
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Account Created</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">January 15, 2024</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Account Status</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-0.5 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Active
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-800 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400">warning</span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danger Zone</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Delete Account</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                </div>
                <button className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 active:bg-red-800 transition-colors flex-shrink-0">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}