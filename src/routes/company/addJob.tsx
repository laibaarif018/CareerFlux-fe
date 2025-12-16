import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/addJob')({
  component: AddJob,
})

import { useState } from "react";

export default function AddJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    experience: "",
    type: "",
    salaryMin: "",
    salaryMax: "",
    skills: [],
    tags: [],
  });

  const [skillInput, setSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const addItem = (key: "skills" | "tags", value: string) => {
    if (!value.trim()) return;
    setForm({ ...form, [key]: [...form[key], value.trim()] });
  };

  const removeItem = (key: "skills" | "tags", value: string) => {
    setForm({ ...form, [key]: form[key].filter((v) => v !== value) });
  };

  return (
    <main className="p-8 max-w-4xl mx-auto bg-slate-50 dark:bg-slate-950 min-h-screen">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Add New Job Posting
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Fill out the form below to create a new job posting.
      </p>

      {/* Job Details */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Job Details</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <input
            placeholder="Job Title"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Company Name"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            placeholder="Location"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
        </div>
      </section>

      {/* Description */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Job Description</h2>
        <textarea
          placeholder="Enter job description..."
          className="w-full min-h-[200px] px-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 resize-y"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </section>

      {/* Additional Info */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 mb-8 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Additional Information</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <select
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
          >
            <option value="">Experience Level</option>
            <option>Entry-level</option>
            <option>Mid-level</option>
            <option>Senior-level</option>
          </select>
          <select
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="">Job Type</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
          </select>
          <input
            placeholder="Salary Min"
            type="number"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            value={form.salaryMin}
            onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
          />
          <input
            placeholder="Salary Max"
            type="number"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            value={form.salaryMax}
            onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
          />
        </div>
      </section>

      {/* Skills & Tags */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Skills & Tags</h2>

        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Skills
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 rounded-full text-sm font-medium">
                {s}
                <button 
                  onClick={() => removeItem("skills", s)}
                  className="ml-1 hover:text-blue-600 dark:hover:text-blue-200 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            placeholder="Add skill and press Enter"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem("skills", skillInput);
                setSkillInput("");
              }
            }}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {form.tags.map((t) => (
              <span key={t} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-full text-sm font-medium">
                {t}
                <button 
                  onClick={() => removeItem("tags", t)}
                  className="ml-1 hover:text-slate-600 dark:hover:text-slate-300 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <input
            placeholder="Add tag and press Enter"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addItem("tags", tagInput);
                setTagInput("");
              }
            }}
          />
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-4 mt-8">
        <button className="px-6 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors">
          Cancel
        </button>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm">
          Save Job
        </button>
      </div>
    </main>
  );
}
