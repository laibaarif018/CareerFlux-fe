import { createFileRoute } from '@tanstack/react-router'
import { useState } from "react";

export const Route = createFileRoute('/jobDetailWithSkillGap')({
  component: JobDetailsWithSkillGap,
})


interface Skill {
  name: string;
  impact?: "High" | "Medium" | "Low";
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string; // e.g., "Full-time"
  salary?: string;
  category?: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  strongSkills: string[];
  skillsToImprove: Skill[];
  matchScore: number; // 0-100
}

const sampleJobs: Job[] = [
  {
    id: "1",
    title: "Senior Product Designer",
    company: "Stripe",
    location: "San Francisco, CA (Remote)",
    type: "Full-time",
    salary: "$150k - $220k",
    category: "Design",
    description:
      "Stripe is looking for a Senior Product Designer to join our team. You'll work on complex challenges and craft elegant solutions.",
    responsibilities: [
      "Define user models, user flows, and UI for new and existing products.",
      "Create wireframes, storyboards, and prototypes.",
      "Collaborate with product managers, engineers, and researchers.",
      "Maintain our design system.",
    ],
    qualifications: [
      "5+ years of experience in product design.",
      "Strong portfolio showcasing web and mobile apps.",
      "Proficiency in Figma, Sketch, or other design tools.",
      "Excellent communication and collaboration skills.",
    ],
    strongSkills: ["Product Design", "UI/UX", "Figma", "Prototyping", "Collaboration"],
    skillsToImprove: [
      { name: "Sketch", impact: "High" },
      { name: "Design Systems", impact: "Medium" },
    ],
    matchScore: 85,
  },
  {
    id: "2",
    title: "Senior Product Manager",
    company: "TechCorp Inc.",
    location: "New York, NY",
    type: "Full-time",
    description: "Manage product strategy and execution for our SaaS platform.",
    responsibilities: ["Define roadmap", "Collaborate with cross-functional teams"],
    qualifications: ["3+ years experience in Product Management"],
    strongSkills: ["Agile Methodologies", "Roadmap Planning"],
    skillsToImprove: [
      { name: "Data Analysis", impact: "High" },
      { name: "SQL", impact: "Low" },
    ],
    matchScore: 78,
  },
];

export default function JobDetailsWithSkillGap() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const getImpactClasses = (impact?: string) => {
    switch (impact) {
      case "High":
        return "text-red-500 bg-red-500/10 dark:bg-red-500/20";
      case "Medium":
        return "text-amber-500 bg-amber-500/10 dark:bg-amber-500/20";
      case "Low":
        return "text-green-500 bg-green-500/10 dark:bg-green-500/20";
      default:
        return "text-gray-500 bg-gray-200 dark:bg-gray-700/20";
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background-light dark:bg-background-dark font-display">
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-3 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-4 text-[#0d121b] dark:text-slate-200">
          <div className="size-6 text-primary">
            <svg fill="none" viewBox="0 0 48 48">
              <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
            </svg>
          </div>
          <h2 className="text-lg font-bold">ResumeAnalyzer</h2>
        </div>
      </header>

      <main className="p-4 md:p-10 space-y-8 max-w-7xl mx-auto">
        {/* Job List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {sampleJobs.map((job) => (
            <div
              key={job.id}
              className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:shadow-lg"
              onClick={() => setSelectedJob(job)}
            >
              <p className="text-lg font-bold text-[#0d121b] dark:text-slate-50">{job.title}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{job.company}</p>
              <p className="text-sm text-slate-400 dark:text-slate-500">{job.location}</p>
            </div>
          ))}
        </div>

        {/* Job Details + Skill Gap */}
        {selectedJob && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Job Info */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex flex-col gap-4 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between flex-wrap gap-4">
                  <div className="flex flex-col gap-2 min-w-72">
                    <p className="text-4xl font-black text-[#0d121b] dark:text-slate-50">{selectedJob.title}</p>
                    <p className="text-base text-slate-500 dark:text-slate-400">{selectedJob.company} - {selectedJob.location}</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap pt-2">
                  <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">{selectedJob.type}</span>
                  {selectedJob.salary && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">{selectedJob.salary}</span>
                  )}
                  {selectedJob.category && (
                    <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300">{selectedJob.category}</span>
                  )}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-xl font-bold text-[#0d121b] dark:text-slate-50 mb-4">Job Description</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{selectedJob.description}</p>

                <h4 className="font-bold text-[#0d121b] dark:text-slate-50 mt-4">Responsibilities</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {selectedJob.responsibilities.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>

                <h4 className="font-bold text-[#0d121b] dark:text-slate-50 mt-4">Qualifications</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {selectedJob.qualifications.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Skill Gap */}
            <div className="flex flex-col gap-6">
              {/* Match Score */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-center">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Your Match Score</p>
                <div className="relative w-48 h-48 mx-auto">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200 dark:text-slate-700"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={3}
                    ></path>
                    <path
                      className="text-primary"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${selectedJob.matchScore}, 100`}
                      strokeLinecap="round"
                      strokeWidth={3}
                    ></path>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-black text-[#0d121b] dark:text-slate-50">{selectedJob.matchScore}%</span>
                  </div>
                </div>
              </div>

              {/* Strong Skills */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#0d121b] dark:text-slate-50 mb-3">Strong Skills</h3>
                {selectedJob.strongSkills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 text-primary">
                      <span className="material-symbols-outlined text-lg">check_circle</span>
                    </div>
                    <p className="text-sm font-medium text-[#0d121b] dark:text-slate-200">{skill}</p>
                  </div>
                ))}
              </div>

              {/* Skills to Improve */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
                <h3 className="text-lg font-bold text-[#0d121b] dark:text-slate-50 mb-3">Skills to Improve</h3>
                {selectedJob.skillsToImprove.map((skill, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 dark:bg-amber-500/20 text-amber-500">
                        <span className="material-symbols-outlined text-lg">report</span>
                      </div>
                      <p className="text-sm font-medium text-[#0d121b] dark:text-slate-200">{skill.name}</p>
                    </div>
                    {skill.impact && (
                      <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${getImpactClasses(skill.impact)}`}>
                        {skill.impact} Impact
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


