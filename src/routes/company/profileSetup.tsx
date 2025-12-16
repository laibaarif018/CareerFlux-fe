import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef } from "react";
import Header from '@/components/Header'

export const Route = createFileRoute('/company/profileSetup')({
  component: CompanyProfileSetup,
})

export default function CompanyProfileSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    size: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    // Add validation
    if (!form.companyName || !form.contactEmail) {
      alert('Please fill in required fields');
      return;
    }
    // Add save logic here
    console.log('Saving company profile...', form);
    navigate({ to: '/company/dashboard' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      {/* Header */}
      <Header />

      {/* Content */}
      <main className="flex justify-center px-4 py-8">
        <div className="w-full max-w-4xl flex flex-col gap-6">
          {/* Page Intro */}
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Company Profile Setup
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Provide your company details to get started. This information will be visible to candidates.
            </p>
          </div>

          {/* Company Info */}
          <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">business</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Company Information
              </h2>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                  Company Logo
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed rounded-xl px-6 py-10 text-center border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50"
                >
                  {logoPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-contain rounded-lg" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Click to change logo
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-center mb-3">
                        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-3xl">upload</span>
                        </div>
                      </div>
                      <p className="text-base font-semibold text-slate-900 dark:text-white mb-1">Upload Company Logo</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Drag & drop or click to upload (PNG, JPG up to 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    placeholder="Enter company name"
                    value={form.companyName}
                    onChange={(e) => updateField("companyName", e.target.value)}
                    required
                    className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Website URL
                  </label>
                  <input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={form.website}
                    onChange={(e) => updateField("website", e.target.value)}
                    className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Industry
                  </label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  >
                    <option value="">Select Industry</option>
                    <option value="technology">Technology</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Finance</option>
                    <option value="education">Education</option>
                    <option value="retail">Retail</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="size" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company Size
                  </label>
                  <select
                    id="size"
                    value={form.size}
                    onChange={(e) => updateField("size", e.target.value)}
                    className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201-500">201–500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Description
                </label>
                <textarea
                  id="description"
                  placeholder="Tell us about your company, mission, and culture..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors resize-none"
                />
              </div>
            </div>
          </section>

          {/* Primary Contact */}
          <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">person</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Primary Contact
              </h2>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Name
                </label>
                <input
                  id="contactName"
                  type="text"
                  placeholder="John Doe"
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contactPhone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Phone
                </label>
                <input
                  id="contactPhone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.contactPhone}
                  onChange={(e) => updateField("contactPhone", e.target.value)}
                  className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Email *
                </label>
                <input
                  id="contactEmail"
                  type="email"
                  placeholder="contact@company.com"
                  value={form.contactEmail}
                  onChange={(e) => updateField("contactEmail", e.target.value)}
                  required
                  className="w-full h-11 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-colors"
                />
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pb-8">
            <button 
              onClick={() => navigate({ to: '/auth/roles' })}
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20"
            >
              <span className="material-symbols-outlined text-lg">check</span>
              Save Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}