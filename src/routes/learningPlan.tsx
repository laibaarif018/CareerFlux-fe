import { createFileRoute } from '@tanstack/react-router'
import UserHeader from '@/components/UserHeader'
import { useState } from "react";

export const Route = createFileRoute('/learningPlan')({
  component: LearningPlan,
})

interface Skill {
  id: string;
  title: string;
  status: "Completed" | "In Progress" | "Not Started";
  completionDate?: string;
  dueDate?: string;
  resources: { type: "Article" | "Course" | "Video"; title: string; url?: string }[];
}

const sampleSkills: Skill[] = [
  {
    id: "1",
    title: "Advanced Python for Data Science",
    status: "Completed",
    completionDate: "Sep 15, 2024",
    resources: [
      { type: "Article", title: "Top 10 Python Libraries for Data Scientists", url: "#" },
      { type: "Course", title: "Coursera: Applied Data Science with Python", url: "#" },
    ],
  },
  {
    id: "2",
    title: "Machine Learning Fundamentals",
    status: "In Progress",
    dueDate: "Nov 30, 2024",
    resources: [
      { type: "Video", title: "YouTube: Intro to Machine Learning", url: "#" },
      { type: "Course", title: "Stanford's Machine Learning on Coursera", url: "#" },
    ],
  },
  {
    id: "3",
    title: "SQL for Data Analysis",
    status: "Not Started",
    dueDate: "Dec 31, 2024",
    resources: [
      { type: "Course", title: "Mode Analytics SQL Tutorial", url: "#" },
      { type: "Article", title: "SQL Best Practices Guide", url: "#" },
    ],
  },
];

export default function LearningPlan() {
  const [skills, setSkills] = useState(sampleSkills);

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800";
      case "In Progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800";
      case "Not Started":
        return "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-600";
      default:
        return "";
    }
  };

  const getIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return "check_circle";
      case "In Progress":
        return "schedule";
      case "Not Started":
        return "radio_button_unchecked";
      default:
        return "radio_button_unchecked";
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 dark:text-green-400";
      case "In Progress":
        return "text-blue-600 dark:text-blue-400";
      case "Not Started":
        return "text-slate-400 dark:text-slate-500";
      default:
        return "text-slate-400";
    }
  };

  const handleSkillAction = (skillId: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        if (skill.status === "Not Started") {
          return { ...skill, status: "In Progress" as const };
        } else if (skill.status === "In Progress") {
          return { 
            ...skill, 
            status: "Completed" as const,
            completionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          };
        }
      }
      return skill;
    }));
  };

  const completedCount = skills.filter(s => s.status === "Completed").length;
  const progressPercent = Math.round((completedCount / skills.length) * 100);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <UserHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col gap-8">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Your Learning Roadmap
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-400">
              An AI-powered plan to help you land your next job. Track your progress and master the skills you need.
            </p>
          </div>

          {/* Progress Card */}
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">analytics</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Overall Progress</h2>
            </div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {completedCount} of {skills.length} skills completed
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{progressPercent}%</p>
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-3 overflow-hidden">
              <div 
                className="h-3 rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Skills Timeline */}
          <div className="grid grid-cols-[auto_1fr] gap-x-4 sm:gap-x-6">
            {skills.map((skill, index) => (
              <div key={skill.id} className="contents">
                {/* Timeline indicator */}
                <div className="flex flex-col items-center pt-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    skill.status === "Completed" 
                      ? "bg-green-100 dark:bg-green-900/30" 
                      : skill.status === "In Progress"
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "bg-slate-100 dark:bg-slate-700"
                  }`}>
                    <span className={`material-symbols-outlined text-xl ${getIconColor(skill.status)}`}>
                      {getIcon(skill.status)}
                    </span>
                  </div>
                  {index < skills.length - 1 && (
                    <div className="w-[2px] bg-slate-200 dark:bg-slate-700 flex-1 min-h-[80px]" />
                  )}
                </div>

                {/* Skill content */}
                <div className="pb-8">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white flex-1">
                        {skill.title}
                      </h3>
                      <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${getStatusClasses(skill.status)}`}>
                        {skill.status}
                      </span>
                    </div>

                    {skill.status === "Completed" && skill.completionDate && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-base">event_available</span>
                        Completed on {skill.completionDate}
                      </p>
                    )}
                    {skill.status !== "Completed" && skill.dueDate && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-base">schedule</span>
                        Target date: {skill.dueDate}
                      </p>
                    )}

                    {/* Resources */}
                    <details className="group mb-4">
                      <summary className="flex cursor-pointer items-center justify-between gap-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors list-none">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="material-symbols-outlined text-base">menu_book</span>
                          Recommended Resources ({skill.resources.length})
                        </span>
                        <span className="material-symbols-outlined text-slate-600 dark:text-slate-400 group-open:rotate-180 transition-transform">
                          expand_more
                        </span>
                      </summary>
                      <div className="mt-3 space-y-2 pl-3">
                        {skill.resources.length > 0 ? (
                          skill.resources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group/item"
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                res.type === "Article" 
                                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                                  : res.type === "Course"
                                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                  : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              }`}>
                                <span className="material-symbols-outlined text-base">
                                  {res.type === "Article" ? "article" : res.type === "Course" ? "school" : "play_circle"}
                                </span>
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                                  {res.type}
                                </p>
                                <p className="text-sm text-slate-900 dark:text-white group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400">
                                  {res.title}
                                </p>
                              </div>
                              <span className="material-symbols-outlined text-slate-400 text-base opacity-0 group-hover/item:opacity-100 transition-opacity">
                                arrow_forward
                              </span>
                            </a>
                          ))
                        ) : (
                          <p className="text-sm text-slate-500 dark:text-slate-400 p-3">
                            Resources will be available once you start this skill.
                          </p>
                        )}
                      </div>
                    </details>

                    {/* Action Button */}
                    <button 
                      onClick={() => handleSkillAction(skill.id)}
                      disabled={skill.status === "Completed"}
                      className={`inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg text-sm font-bold transition-all ${
                        skill.status === "Completed"
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 cursor-default"
                          : skill.status === "In Progress"
                          ? "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm"
                          : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm"
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {skill.status === "Completed" ? "check" : skill.status === "In Progress" ? "task_alt" : "play_arrow"}
                      </span>
                      <span>
                        {skill.status === "Completed" 
                          ? "Completed" 
                          : skill.status === "In Progress" 
                          ? "Mark Complete" 
                          : "Start Learning"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}