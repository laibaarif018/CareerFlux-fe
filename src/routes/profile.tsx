import UserHeader from '@/components/UserHeader';
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from "react";

export const Route = createFileRoute('/profile')({
  component: Profile,
})

export default function Profile() {
  const navigate = useNavigate();
  
  // Personal Info State
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, USA",
  });

  // Career Preferences State
  const [preferences, setPreferences] = useState({
    roles: ["Product Manager", "UX Designer"],
    industries: ["SaaS", "Fintech"],
    salary: 120000,
    locations: ["Remote", "New York, USA"],
  });

  // Resume options
  const [primaryResume, setPrimaryResume] = useState("Product_Manager_Resume_2024.pdf");

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceAdd = (category: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: Array.isArray(prev[category as keyof typeof prev]) 
        ? [...(prev[category as keyof typeof prev] as string[]), value]
        : prev[category as keyof typeof prev],
    }));
  };

  const handlePreferenceRemove = (category: string, value: string) => {
    setPreferences(prev => ({
      ...prev,
      [category]: Array.isArray(prev[category as keyof typeof prev])
        ? (prev[category as keyof typeof prev] as string[]).filter(v => v !== value)
        : prev[category as keyof typeof prev],
    }));
  };

  const handleSave = () => {
    // Save logic here
    console.log('Saving profile...', { personalInfo, preferences, primaryResume });
    navigate({ to: '/dashboard' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      {/* Header */}
      <UserHeader />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Personal Information</h3>
            <div className="space-y-6">
              {Object.entries(personalInfo).map(([key, value]) => (
                <label key={key} className="flex flex-col">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </p>
                  <div className="relative flex w-full flex-1 items-stretch">
                    <input
                      className="flex w-full min-w-0 flex-1 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 h-12 placeholder:text-slate-400 dark:placeholder:text-slate-500 px-4 pr-10 text-base transition-colors"
                      value={value}
                      onChange={(e) => handlePersonalChange(key, e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 dark:text-slate-500 pointer-events-none">
                      <span className="material-symbols-outlined text-xl">edit</span>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preferences & Resume */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* Career Preferences */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Career Preferences</h3>

            {/* Roles */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">Desired Roles</p>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[48px]">
                {preferences.roles.map((role) => (
                  <span key={role} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium text-sm px-3 py-1.5 rounded-full">
                    {role}
                    <button 
                      onClick={() => handlePreferenceRemove("roles", role)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${role}`}
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </span>
                ))}
                <input
                  className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Add a role..."
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handlePreferenceAdd("roles", e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Industries */}
            <div className="mb-6">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">Target Industries</p>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[48px]">
                {preferences.industries.map((ind) => (
                  <span key={ind} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium text-sm px-3 py-1.5 rounded-full">
                    {ind}
                    <button 
                      onClick={() => handlePreferenceRemove("industries", ind)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${ind}`}
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </span>
                ))}
                <input
                  className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Add an industry..."
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handlePreferenceAdd("industries", e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>

            {/* Salary */}
            <div className="mb-6">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="salary">
                Minimum Salary Expectation
              </label>
              <div className="flex items-center gap-4 mt-2">
                <input
                  id="salary"
                  type="range"
                  min={30000}
                  max={250000}
                  step={1000}
                  value={preferences.salary}
                  onChange={(e) => setPreferences({ ...preferences, salary: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-lg whitespace-nowrap min-w-[100px] text-right">
                  ${preferences.salary.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Locations */}
            <div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300 pb-2">Preferred Work Locations</p>
              <div className="flex flex-wrap gap-2 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-900 min-h-[48px]">
                {preferences.locations.map((loc) => (
                  <span key={loc} className="flex items-center gap-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 font-medium text-sm px-3 py-1.5 rounded-full">
                    {loc}
                    <button 
                      onClick={() => handlePreferenceRemove("locations", loc)}
                      className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                      aria-label={`Remove ${loc}`}
                    >
                      <span className="material-symbols-outlined text-base">close</span>
                    </button>
                  </span>
                ))}
                <input
                  className="flex-1 min-w-[120px] bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  placeholder="Add a location..."
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.currentTarget.value.trim()) {
                      handlePreferenceAdd("locations", e.currentTarget.value.trim());
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* Resume Management
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resume Management</h3>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300" htmlFor="primary-resume">
                Primary Resume
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Your primary resume is used for job matching.</p>
            </div>
            <div className="relative">
              <select
                id="primary-resume"
                value={primaryResume}
                onChange={(e) => setPrimaryResume(e.target.value)}
                className="w-full h-12 px-4 pr-10 text-base text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600/20 appearance-none cursor-pointer transition-colors"
              >
                <option>Product_Manager_Resume_2024.pdf</option>
                <option>UX_Designer_Portfolio_Resume.pdf</option>
                <option>General_Tech_Resume_v3.pdf</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined">unfold_more</span>
              </div>
            </div>
            <button 
              onClick={() => navigate({ to: '/resume' })}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline self-start transition-colors"
            >
              Manage all resumes
            </button> */}
            <div className="flex justify-end mt-2 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button 
                onClick={handleSave}
                className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-base hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-colors shadow-lg shadow-blue-600/20"
              >
                Save
              </button>
            </div>
          </div>
      </main>
        </div>
  );
}