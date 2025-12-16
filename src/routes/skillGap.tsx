import { createFileRoute,useNavigate } from '@tanstack/react-router'
import UserHeader from '@/components/UserHeader';

interface Skill {
  name: string;
  impact?: "High" | "Medium" | "Low";
}

interface SkillGapReportProps {
  jobTitle: string;
  company: string;
  resumeName: string;
  matchScore: number; // 0-100
  strongSkills: string[];
  skillsToImprove: Skill[];
}

function SkillGapRouteComponent() {
  const defaultProps: SkillGapReportProps = {
    jobTitle: 'Software Engineer',
    company: 'Tech Company',
    resumeName: 'My Resume',
    matchScore: 85,
    strongSkills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Git'],
    skillsToImprove: [
      { name: 'DevOps', impact: 'High' },
      { name: 'System Design', impact: 'High' },
      { name: 'AWS', impact: 'Medium' },
      { name: 'Docker', impact: 'Medium' }
    ]
  };

  return <SkillGapReport {...defaultProps} />;
}

export const Route = createFileRoute('/skillGap')({
  component: SkillGapRouteComponent
})

export default function SkillGapReport({
  jobTitle,
  company,
  resumeName,
  matchScore,
  strongSkills,
  skillsToImprove,
}: SkillGapReportProps) {
  const getImpactClasses = (impact?: string) => {
    switch (impact) {
      case "High":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800";
      case "Medium":
        return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800";
      case "Low":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800";
      default:
        return "text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700/20 border border-slate-200 dark:border-slate-700";
    }
  };
  const navigate =useNavigate();

  // const handleFindCourses = () => {
  //   navigate('/learningPlan')
  //   console.log('Finding courses...');
  //   // Add navigation or modal logic here
  // };

  const handleDownloadReport = () => {
    console.log('Downloading report...');
    // Add download logic here
  };

  const getScoreColor = () => {
    if (matchScore >= 80) return 'text-green-600 dark:text-green-400';
    if (matchScore >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getProgressColor = () => {
    if (matchScore >= 80) return 'bg-green-600 dark:bg-green-500';
    if (matchScore >= 60) return 'bg-amber-600 dark:bg-amber-500';
    return 'bg-red-600 dark:bg-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans transition-colors">
      <UserHeader />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Skill Gap Report
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Analyze your skills against job requirements and identify areas for improvement
          </p>
        </div>

        <div className="space-y-6">
          {/* Job & Resume Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 rounded-xl overflow-hidden">
            <div className="bg-white dark:bg-slate-800 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">work</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Target Position</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {jobTitle}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                    @ {company}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">description</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Analyzed Resume</p>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">
                    {resumeName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">analytics</span>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Match Score</h2>
              </div>
              <p className={`text-3xl font-bold ${getScoreColor()}`}>
                {matchScore}%
              </p>
            </div>
            <div className="rounded-full bg-slate-200 dark:bg-slate-700 h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              Based on the job requirements and your resume analysis.
            </p>
          </div>

          {/* Strong Skills */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">check_circle</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Your Strong Skills</h2>
              <span className="ml-auto text-sm font-medium text-slate-500 dark:text-slate-400">
                {strongSkills.length} skills
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {strongSkills.map((skill, i) => (
                <div 
                  key={i} 
                  className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined text-base">done</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{skill}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills to Improve */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400">trending_up</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Skills to Improve</h2>
              <span className="ml-auto text-sm font-medium text-slate-500 dark:text-slate-400">
                {skillsToImprove.length} skills
              </span>
            </div>
            <div className="space-y-3">
              {skillsToImprove.map((skill, i) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between gap-3 p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                      <span className="material-symbols-outlined text-base">school</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">{skill.name}</p>
                  </div>
                  {skill.impact && (
                    <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${getImpactClasses(skill.impact)}`}>
                      {skill.impact}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            <button 
              onClick={()=>{navigate({to:'/learningPlan'})}}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-blue-600 text-white font-bold text-sm px-6 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-lg shadow-blue-600/20"
            >
              <span className="material-symbols-outlined text-lg">school</span>
              <span>Find Courses to Fill Gaps</span>
            </button>
            <button 
              onClick={handleDownloadReport}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white font-bold text-sm px-6 hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">download</span>
              <span>Download Report</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}