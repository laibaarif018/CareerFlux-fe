import { createFileRoute, useNavigate } from '@tanstack/react-router'
import UserHeader from '@/components/UserHeader'
import { useState } from 'react'

export const Route = createFileRoute('/jobDetails')({
  component: JobDetails,
})

interface SkillCategory {
  name: string;
  skills: string[];
  color: "green" | "blue" | "gray";
}

export default function JobDetails() {
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  const jobTitle = "Senior Product Designer";
  const company = "Stripe";
  const location = "San Francisco, CA (Remote)";
  const matchScore = 85;
  const matchLabel = "Excellent Match";
  const jobType = "Full-time";
  const salary = "$150k - $220k";
  const department = "Design";
  const description = `Stripe is looking for a Senior Product Designer to join our team. 
  You'll work on complex challenges and craft elegant solutions that make it easier for millions of businesses to start, run, and scale their operations online. 
  You will be involved in every aspect of the product development process, from brainstorming the next great product innovation to tweaking pixels right before launch.`;

  const responsibilities = [
    "Define user models, user flows, and UI for new and existing products.",
    "Create wireframes, storyboards, and prototypes to effectively communicate interaction and design ideas.",
    "Work closely with product managers, engineers, and researchers to deliver high-quality design solutions.",
    "Contribute to and maintain our design system.",
  ];

  const qualifications = [
    "5+ years of experience in product design.",
    "A strong portfolio showcasing your work on web and mobile applications.",
    "Proficiency in Figma, Sketch, or other design tools.",
    "Excellent communication and collaboration skills.",
  ];

  const skillCategories: SkillCategory[] = [
    { name: "Strong Skills (5)", skills: ["Product Design", "UI/UX", "Figma", "Prototyping", "Collaboration"], color: "green" },
    { name: "Moderate Skills (2)", skills: ["Design Systems", "User Research"], color: "blue" },
    { name: "Missing Skills (1)", skills: ["Sketch"], color: "gray" },
  ];

  const getMatchColor = () => {
    if (matchScore >= 80) return 'text-green-600 dark:text-green-400';
    if (matchScore >= 60) return 'text-blue-600 dark:text-blue-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  const getProgressColor = () => {
    if (matchScore >= 80) return 'stroke-green-600 dark:stroke-green-500';
    if (matchScore >= 60) return 'stroke-blue-600 dark:stroke-blue-500';
    return 'stroke-amber-600 dark:stroke-amber-500';
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 font-sans min-h-screen transition-colors">
      {/* Header */}
      <UserHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button 
          onClick={() => navigate({ to: '/jobs' })}
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm font-medium">Back to Jobs</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Job Header */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                      {jobTitle}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <span className="material-symbols-outlined text-base">business</span>
                        {company}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        {location}
                      </span>
                    </div>
                  </div>
                  
                  {/* Company Logo Placeholder */}
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                    S
                  </div>
                </div>

                {/* Job Badges */}
                <div className="flex gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {jobType}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <span className="material-symbols-outlined text-sm">payments</span>
                    {salary}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                    <span className="material-symbols-outlined text-sm">category</span>
                    {department}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={() => setIsSaved(!isSaved)}
                    className={`inline-flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors ${
                      isSaved
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {isSaved ? 'bookmark' : 'bookmark_add'}
                    </span>
                    {isSaved ? 'Saved' : 'Save Job'}
                  </button>
                  <button className="inline-flex items-center gap-2 h-10 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 text-sm font-bold transition-colors shadow-sm flex-1 sm:flex-none">
                    Apply Now
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </button>
                  <button className="inline-flex items-center justify-center h-10 w-10 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    <span className="material-symbols-outlined text-lg">open_in_new</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">description</span>
                Job Description
              </h2>
              <div className="space-y-6 text-slate-600 dark:text-slate-300">
                <p className="leading-relaxed">{description}</p>
                
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">Responsibilities</h3>
                  <ul className="space-y-2">
                    {responsibilities.map((r, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-base mt-0.5 flex-shrink-0">
                          check_circle
                        </span>
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3 text-lg">Qualifications</h3>
                  <ul className="space-y-2">
                    {qualifications.map((q, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-base mt-0.5 flex-shrink-0">
                          verified
                        </span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-6">
              {/* Match Score */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center shadow-sm">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">Your Match Score</p>
                <div className="relative w-40 h-40 mx-auto">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path 
                      className="text-slate-200 dark:text-slate-700" 
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth={3}
                    />
                    <path 
                      className={getProgressColor()}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeDasharray={`${matchScore}, 100`} 
                      strokeLinecap="round" 
                      strokeWidth={3}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-4xl font-bold ${getMatchColor()}`}>{matchScore}%</span>
                  </div>
                </div>
                <p className="text-lg font-semibold text-slate-900 dark:text-white mt-4">{matchLabel}</p>
              </div>

              {/* Why This Job */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-500 text-xl">auto_awesome</span>
                  Why this job matches
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  Your extensive experience in product design, proficiency with modern design tools like Figma, and a portfolio showcasing complex web applications align strongly with the key requirements of this role.
                </p>
              </div>

              {/* Skill Overlap */}
              <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-xl">psychology</span>
                  Skill Analysis
                </h3>
                <div className="space-y-5">
                  {skillCategories.map((cat, i) => (
                    <div key={i}>
                      <p className={`text-sm font-bold mb-2 ${
                        cat.color === "green" ? "text-green-600 dark:text-green-400" :
                        cat.color === "blue" ? "text-blue-600 dark:text-blue-400" :
                        "text-slate-500 dark:text-slate-400"
                      }`}>{cat.name}</p>
                      <div className="flex gap-2 flex-wrap">
                        {cat.skills.map((skill, j) => (
                          <span key={j} className={`px-3 py-1 text-xs font-medium rounded-full ${
                            cat.color === "green" ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800" :
                            cat.color === "blue" ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800" :
                            "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600"
                          }`}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}