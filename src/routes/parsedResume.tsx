import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react';
export const Route = createFileRoute('/parsedResume')({
component: ParsedResumeDetailsPage,
})
export default function ParsedResumeDetailsPage() {
  // State for Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    fullName: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedIn: 'linkedin.com/in/janedoe',
  });

  // State for Skills
  const [skills, setSkills] = useState([
    'JavaScript',
    'React',
    'Node.js',
    'UI/UX Design',
    'Figma',
  ]);

  // State for Work Experience
  const [workExperience, setWorkExperience] = useState([
    {
      jobTitle: 'Senior Product Designer',
      company: 'Tech Innovations Inc.',
      startDate: 'Jan 2020',
      endDate: 'Present',
      description:
        "Led the redesign of the company's flagship product, resulting in a 25% increase in user engagement.",
    },
  ]);

  // State for Education
  const [education, setEducation] = useState([
    {
      institution: 'University of Design',
      degree: 'B.S. in Human-Computer Interaction',
      graduationDate: 'May 2019',
    },
  ]);

  // State for new skill input
  const [newSkill, setNewSkill] = useState('');

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display">
      <div className="mx-auto max-w-[960px] px-4 sm:px-8 py-8">
        {/* Header */}
        <header className="sticky top-5 z-10 flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3 text-gray-900 dark:text-white">
            <div className="size-6 text-primary">
              <svg viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Parsed Resume Details</h1>
          </div>

          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 h-10 text-sm font-bold text-white hover:bg-primary/90">
            <span className="material-symbols-outlined">auto_awesome</span>
            Run AI Analysis
          </button>
        </header>

        <main className="mt-8 flex flex-col gap-8">
          {/* Personal Info */}
          <Section title="Personal Info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(personalInfo).map(([key, value]) => (
                <Input
                  key={key}
                  label={formatLabel(key)}
                  value={value}
                  onChange={(val:any) =>
                    setPersonalInfo({ ...personalInfo, [key]: val })
                  }
                  span={key === 'linkedIn'}
                />
              ))}
            </div>
          </Section>

          {/* Skills */}
          <Section title="Skills">
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 rounded-full bg-primary/20 px-3 py-1 text-sm font-medium text-primary dark:bg-blue-900/40 dark:text-blue-300"
                >
                  {skill}
                  <button
                    className="opacity-70 hover:opacity-100"
                    onClick={() =>
                      setSkills(skills.filter((s) => s !== skill))
                    }
                  >
                    <span className="material-symbols-outlined text-base">
                      close
                    </span>
                  </button>
                </span>
              ))}
              <input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newSkill.trim()) {
                    setSkills([...skills, newSkill.trim()]);
                    setNewSkill('');
                  }
                }}
                className="h-8 min-w-[120px] flex-1 bg-transparent outline-none text-gray-900 dark:text-white"
              />
            </div>
          </Section>

          {/* Work Experience */}
          <Section title="Work Experience">
            {workExperience.map((exp, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700 pb-6"
              >
                <Input
                  label="Job Title"
                  value={exp.jobTitle}
                  onChange={(val:any) =>
                    updateWorkExperience(idx, 'jobTitle', val)
                  }
                />
                <Input
                  label="Company"
                  value={exp.company}
                  onChange={(val:any) => updateWorkExperience(idx, 'company', val)}
                />
                <Input
                  label="Start Date"
                  value={exp.startDate}
                  onChange={(val:any) =>
                    updateWorkExperience(idx, 'startDate', val)
                  }
                />
                <Input
                  label="End Date"
                  value={exp.endDate}
                  onChange={(val:any) => updateWorkExperience(idx, 'endDate', val)}
                />
                <Textarea
                  label="Description"
                  value={exp.description}
                  onChange={(val:any) =>
                    updateWorkExperience(idx, 'description', val)
                  }
                  span
                />
              </div>
            ))}
            <AddButton
              onClick={() =>
                setWorkExperience([
                  ...workExperience,
                  {
                    jobTitle: '',
                    company: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                  },
                ])
              }
            >
              Add Experience
            </AddButton>
          </Section>

          {/* Education */}
          <Section title="Education">
            {education.map((edu, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-200 dark:border-gray-700 pb-6"
              >
                <Input
                  label="Institution"
                  value={edu.institution}
                  onChange={(val:any) => updateEducation(idx, 'institution', val)}
                />
                <Input
                  label="Degree"
                  value={edu.degree}
                  onChange={(val:any) => updateEducation(idx, 'degree', val)}
                />
                <Input
                  label="Graduation Date"
                  value={edu.graduationDate}
                  onChange={(val:any) =>
                    updateEducation(idx, 'graduationDate', val)
                  }
                  span
                />
              </div>
            ))}
            <AddButton
              onClick={() =>
                setEducation([
                  ...education,
                  { institution: '', degree: '', graduationDate: '' },
                ])
              }
            >
              Add Education
            </AddButton>
          </Section>
        </main>
      </div>
    </div>
  );

  // Helper functions
  function updateWorkExperience(index: number, key: string, value: string) {
    const updated = [...workExperience];
    updated[index] = { ...updated[index], [key]: value };
    setWorkExperience(updated);
  }

  function updateEducation(index: number, key: string, value: string) {
    const updated = [...education];
    updated[index] = { ...updated[index], [key]: value };
    setEducation(updated);
  }

  function formatLabel(key: string) {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  }
}

function Section({ title, children }: any) {
  return (
    <section className="rounded-lg bg-white dark:bg-gray-800/50 p-6 shadow-sm">
      <h2 className="mb-4 border-b border-gray-200 dark:border-gray-700 pb-3 text-[22px] font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Input({ label, value, onChange, span = false }: any) {
  return (
    <label className={`flex flex-col gap-2 ${span ? 'md:col-span-2' : ''}`}>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {label}
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}

function Textarea({ label, value, onChange, span = false }: any) {
  return (
    <label className={`flex flex-col gap-2 ${span ? 'md:col-span-2' : ''}`}>
      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[120px] resize-y rounded-lg border border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}

function AddButton({ children, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary/10 dark:bg-primary/20 px-4 h-10 text-sm font-bold text-primary dark:text-blue-300 hover:bg-primary/20 dark:hover:bg-primary/30"
    >
      <span className="material-symbols-outlined">add</span>
      {children}
    </button>
  );
}
