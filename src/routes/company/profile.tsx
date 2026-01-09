import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useRef, useEffect } from "react";
import CompanySidebar from '@/components/companysidebar';
import { useCompanyProfile, useUpdateCompanyProfile } from '@/hooks/useCompany'
import { CompanyProfileData } from '@/services/company.service'
import { z } from 'zod'

export const Route = createFileRoute('/company/profile')({
  component: CompanyProfileSetup,
})

const companyProfileSchema = z.object({
  companyName: z.string().min(1, "Company name is required").min(2, "Company name must be at least 2 characters"),
  websiteUrl: z.string().min(1, "Website URL is required").url("Please enter a valid URL"),
  industry: z.string().min(1, "Industry is required"),
  companySize: z.string().min(1, "Company size is required"),
  description: z.string().min(1, "Company description is required").min(10, "Description must be at least 10 characters"),
  contactName: z.string().min(1, "Contact name is required").min(2, "Contact name must be at least 2 characters"),
  contactEmail: z.string().min(1, "Contact email is required").email("Please enter a valid email address"),
  contactNumber: z.string().min(1, "Contact phone is required").regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, "Please enter a valid phone number"),
});

type ValidationErrors = {
  [K in keyof z.infer<typeof companyProfileSchema>]?: string;
};

export default function CompanyProfileSetup() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>("");
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [logoError, setLogoError] = useState<string>("");
  const [form, setForm] = useState({
    companyName: "",
    websiteUrl: "",
    industry: "",
    companySize: "",
    description: "",
    contactName: "",
    contactEmail: "",
    contactNumber: "",
  });

  const { data: profileData, isLoading } = useCompanyProfile();
  const updateProfileMutation = useUpdateCompanyProfile();

  useEffect(() => {
    if (profileData?.payload) {
      const profile = profileData.payload;
      setForm({
        companyName: profile.companyName || "",
        websiteUrl: profile.websiteUrl || "",
        industry: profile.industry || "",
        companySize: profile.companySize || "",
        description: profile.description || "",
        contactName: profile.contactName || "",
        contactEmail: profile.contactEmail || "",
        contactNumber: profile.contactNumber || "",
      });
      
      if (profile.logoUrl) {
        setLogoPreview(profile.logoUrl);
      }
    }
  }, [profileData]);

  // Debug: Log logoFile state whenever it changes
  useEffect(() => {
    console.log('🔍 Logo file state changed:', {
      hasFile: !!logoFile,
      fileName: logoFile?.name,
      fileSize: logoFile?.size,
      fileType: logoFile?.type,
    });
  }, [logoFile]);

  function updateField(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('📁 File input changed');
    const file = e.target.files?.[0];
    
    if (!file) {
      console.log('❌ No file selected');
      return;
    }

    console.log('📄 File selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
    });

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.log('❌ File too large:', file.size);
      setLogoError('File size must be less than 5MB');
      setLogoFile(null);
      return;
    }
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('❌ Invalid file type:', file.type);
      setLogoError('Please upload a valid image file');
      setLogoFile(null);
      return;
    }
    
    console.log('✅ File validation passed');
    setLogoError("");
    setLogoFile(file); // Store the actual File object
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('🖼️ Preview created');
      setLogoPreview(reader.result as string);
    };
    reader.onerror = () => {
      console.error('❌ Failed to create preview');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    console.log('💾 Save button clicked');
    console.log('📋 Current form data:', form);
    console.log('🖼️ Current logo file:', logoFile ? {
      name: logoFile.name,
      size: logoFile.size,
      type: logoFile.type,
    } : 'No file');

    // Validate form using Zod
    const result = companyProfileSchema.safeParse(form);
    
    if (!result.success) {
      console.log('❌ Form validation failed:', result.error.issues);
      const formattedErrors: ValidationErrors = {};
      result.error.issues.forEach((error) => {
        const field = error.path[0] as keyof ValidationErrors;
        formattedErrors[field] = error.message;
      });
      setErrors(formattedErrors);
      
      const firstErrorField = Object.keys(formattedErrors)[0];
      document.getElementById(firstErrorField)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    console.log('✅ Form validation passed');
    setErrors({});

    const profileData: CompanyProfileData = {
      companyName: form.companyName,
      websiteUrl: form.websiteUrl,
      industry: form.industry,
      companySize: form.companySize,
      description: form.description,
      contactName: form.contactName,
      contactEmail: form.contactEmail,
      contactNumber: form.contactNumber,
    };

    console.log('📤 Preparing to send:', {
      profileData,
      hasLogoFile: !!logoFile,
      logoFileName: logoFile?.name,
    });

    try {
      const mutationData = {
        data: profileData,
        logoFile: logoFile || undefined,
      };

      console.log('🚀 Calling mutation with:', {
        hasData: !!mutationData.data,
        hasLogoFile: !!mutationData.logoFile,
        logoFileDetails: mutationData.logoFile ? {
          name: mutationData.logoFile.name,
          size: mutationData.logoFile.size,
          type: mutationData.logoFile.type,
        } : null,
      });

      const result = await updateProfileMutation.mutateAsync(mutationData);
      
      console.log('✅ Profile updated successfully:', result);
      navigate({ to: '/company/dashboard' });
    } catch (error) {
      console.error('❌ Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <CompanySidebar />
        <main className="flex-1 ml-64 flex justify-center items-center px-4 py-8">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600 dark:text-slate-400">Loading profile...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <CompanySidebar />
      
      <main className="flex-1 ml-64 px-4 py-8">
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Company Profile Setup
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Provide your company details to get started. This information will be visible to candidates.
            </p>
          </div>

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
                  Company Logo {logoFile && <span className="text-green-600">({logoFile.name})</span>}
                </label>
                <div 
                  onClick={() => {
                    console.log('📂 Logo upload area clicked');
                    fileInputRef.current?.click();
                  }}
                  className={`border-2 border-dashed rounded-xl px-6 py-10 text-center transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50 ${
                    logoError 
                      ? 'border-red-500 dark:border-red-400' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400'
                  }`}
                >
                  {logoPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={logoPreview} alt="Logo preview" className="w-24 h-24 object-contain rounded-lg" />
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        Click to change logo
                      </p>
                      {logoFile && (
                        <p className="text-xs text-slate-500">
                          {(logoFile.size / 1024).toFixed(2)} KB
                        </p>
                      )}
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
                {logoError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">error</span>
                    {logoError}
                  </p>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  onClick={(e) => {
                    // Reset the input value to allow uploading the same file again
                    (e.target as HTMLInputElement).value = '';
                  }}
                />
              </div>

              {/* Form fields - same as before */}
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
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.companyName
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                    }`}
                  />
                  {errors.companyName && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">error</span>
                      {errors.companyName}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Website URL *
                  </label>
                  <input
                    id="websiteUrl"
                    type="url"
                    placeholder="https://example.com"
                    value={form.websiteUrl}
                    onChange={(e) => updateField("websiteUrl", e.target.value)}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                      errors.websiteUrl
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                    }`}
                  />
                  {errors.websiteUrl && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">error</span>
                      {errors.websiteUrl}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="industry" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Industry *
                  </label>
                  <select
                    id="industry"
                    value={form.industry}
                    onChange={(e) => updateField("industry", e.target.value)}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                      errors.industry
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                    }`}
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                  </select>
                  {errors.industry && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">error</span>
                      {errors.industry}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="companySize" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Company Size *
                  </label>
                  <select
                    id="companySize"
                    value={form.companySize}
                    onChange={(e) => updateField("companySize", e.target.value)}
                    className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 transition-colors ${
                      errors.companySize
                        ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                        : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                    }`}
                  >
                    <option value="">Select Company Size</option>
                    <option value="1-10">1–10 employees</option>
                    <option value="11-50">11–50 employees</option>
                    <option value="51-200">51–200 employees</option>
                    <option value="201-500">201–500 employees</option>
                    <option value="501+">501+ employees</option>
                  </select>
                  {errors.companySize && (
                    <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">error</span>
                      {errors.companySize}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Company Description *
                </label>
                <textarea
                  id="description"
                  placeholder="Tell us about your company, mission, and culture..."
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={4}
                  className={`w-full rounded-lg border bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors resize-none ${
                    errors.description
                      ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">error</span>
                    {errors.description}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Primary Contact section - same as before */}
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
                  Contact Name *
                </label>
                <input
                  id="contactName"
                  type="text"
                  placeholder="John Doe"
                  value={form.contactName}
                  onChange={(e) => updateField("contactName", e.target.value)}
                  className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.contactName
                      ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                  }`}
                />
                {errors.contactName && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">error</span>
                    {errors.contactName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="contactNumber" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Contact Phone *
                </label>
                <input
                  id="contactNumber"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={form.contactNumber}
                  onChange={(e) => updateField("contactNumber", e.target.value)}
                  className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.contactNumber
                      ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                  }`}
                />
                {errors.contactNumber && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">error</span>
                    {errors.contactNumber}
                  </p>
                )}
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
                  className={`w-full h-11 rounded-lg border bg-white dark:bg-slate-900 px-4 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-colors ${
                    errors.contactEmail
                      ? 'border-red-500 dark:border-red-400 focus:ring-red-600/20 focus:border-red-600'
                      : 'border-slate-300 dark:border-slate-600 focus:ring-blue-600/20 focus:border-blue-600'
                  }`}
                />
                {errors.contactEmail && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-base">error</span>
                    {errors.contactEmail}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Actions */}
          <div className="flex justify-end gap-3 pb-8">
            <button 
              onClick={() => navigate({ to: '/auth/roles' })}
              className="inline-flex items-center justify-center h-11 px-6 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              disabled={updateProfileMutation.isPending}
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={updateProfileMutation.isPending}
              className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateProfileMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">check</span>
                  Save Profile
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}