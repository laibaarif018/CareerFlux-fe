import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company/candidateDetail')({
  component: CandidateDetails,
})

import { useState } from "react";

export default function CandidateDetails() {
  // ---- dynamic state (no hardcoding) ----
  const [candidate] = useState({
    name: "Liam Carter",
    email: "liam.carter@example.com",
    phone: "+1 (555) 123-4567",
    linkedin: "linkedin.com/in/liamcarter",
    role: "Senior Product Manager",
    matchScore: 95,
    atsScore: 88,
  });

  const [stage, setStage] = useState("Interviewing");
  const [notes, setNotes] = useState([
    {
      author: "You",
      time: "2 hours ago",
      text: "Great initial screen. Let's schedule a technical interview with the team.",
    },
  ]);

  const [newNote, setNewNote] = useState("");

  function addNote() {
    if (!newNote.trim()) return;
    setNotes([
      ...notes,
      { author: "You", time: "Just now", text: newNote },
    ]);
    setNewNote("");
  }

  return (
    <main className="min-h-screen bg-background-light dark:bg-background-dark p-8">
      <div className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {candidate.name}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Applying for <span className="font-semibold">{candidate.role}</span>
            </p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div className="text-slate-600 dark:text-slate-300">{candidate.email}</div>
              <div className="text-slate-600 dark:text-slate-300">{candidate.phone}</div>
              <div className="text-slate-600 dark:text-slate-300">{candidate.linkedin}</div>
            </div>
          </div>

          {/* Match Details */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Match Details</h2>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500">Match Score</span>
              <span className="text-lg font-bold text-green-600">
                {candidate.matchScore}%
              </span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${candidate.matchScore}%` }}
              />
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Internal Notes</h2>

            <div className="space-y-4">
              {notes.length === 0 && (
                <p className="text-sm text-slate-500">No notes yet</p>
              )}

              {notes.map((n, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {n.author}
                  </p>
                  <p className="text-xs text-slate-400">{n.time}</p>
                  <p className="mt-1 text-slate-600 dark:text-slate-300">
                    {n.text}
                  </p>
                </div>
              ))}
            </div>

            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add a note..."
              className="mt-4 w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              rows={3}
            />
            <button
              onClick={addNote}
              className="mt-2 h-9 px-4 rounded-lg bg-primary text-white text-sm font-bold"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-8">
          {/* Stage */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">Application Stage</h2>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="w-full rounded-lg border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option>New Applicant</option>
              <option>Reviewing</option>
              <option>Interviewing</option>
              <option>Offered</option>
              <option>Rejected</option>
            </select>

            <div className="mt-4 space-y-2">
              <button className="w-full h-10 rounded-lg bg-primary text-white font-bold">
                Move to Interview
              </button>
              <button className="w-full h-10 rounded-lg bg-red-600 text-white font-bold">
                Reject
              </button>
            </div>
          </div>

          {/* ATS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-2">ATS Score</h2>
            <p className="text-3xl font-bold text-primary">{candidate.atsScore}%</p>
            <p className="text-sm text-slate-500 mt-1">
              Resume matches job keywords well.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
