import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react';
import Header from '@/components/Header';

export const Route = createFileRoute('/')({
  component: HomePage,
})

export default function HomePage() {
  const [fileName, setFileName] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Here you would typically handle the file upload
      console.log('File selected:', file.name);
    }
  };

  const handleAnalyze = () => {
    if (fileName) {
      // Handle analysis logic here
      console.log('Analyzing file:', fileName);
    } else {
      // Trigger file input click
      document.getElementById('resume-upload')?.click();
    }
  };

  return (
    <div className="relative flex flex-col w-full min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <Header/>
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-20 px-4 md:px-10 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                  Optimize Your Resume &amp; Find Your <span className="text-blue-600">Dream Job</span>
                </h1>
                <p className="text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Get instant feedback on your CV, beat the ATS, and get matched with jobs that fit your unique skills perfectly using our advanced AI.
                </p>
              </div>
              
              <div className="w-full max-w-lg mx-auto lg:mx-0 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700">
                <label className="flex flex-col w-full h-16 relative cursor-pointer group">
                  <div className="absolute inset-0 flex items-center pl-4 pr-36 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-blue-600 transition-colors">
                    <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 mr-3">upload_file</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm truncate pr-2">
                      {fileName || 'Drop your resume (PDF, DOCX)'}
                    </span>
                  </div>
                  <input 
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="absolute right-2 top-2 bottom-2">
                    <button 
                      onClick={handleAnalyze}
                      className="h-full px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-bold shadow-md transition-all"
                    >
                      Analyze
                    </button>
                  </div>
                </label>
                <div className="flex items-center gap-2 mt-2 px-2 pb-1">
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Free Initial Scan</span>
                  <span className="material-symbols-outlined text-green-500 text-sm ml-2">check_circle</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">No Login Required</span>
                </div>
              </div>
            </div>
            
            <div className="w-full h-full flex justify-center lg:justify-end relative">
              <div className="relative z-10 w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-700">
                <img 
                  alt="Dashboard displaying resume analysis and job matching statistics" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5WCadfhZsa9g08MIq5t_K7fNyQ5iKfRboL_aw-0JxLBahzwUsRjGCn1gqAlLHN4mQHVATU7-mSegBSjsF2KvN3IwCs0_YQ6Fq-555bX6yvGNGPJXDECtQMODdCKbTL1a8UDXuJ1-QfMEhwgSRV49itLJ-P8-Kza-yzDznTjSrHr9c0dKVsy-2YLlakjGsZyOsQyJtYLMmfEsXL1W4QF7x1JPjMX-DR-x96S2jVM8sDlfowR131GI2EF-Eu5XTak9pSOgulu0TRI7k"
                />
                <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg flex items-center gap-4 max-w-[200px] animate-bounce" style={{ animationDuration: "3s" }}>
                  <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-full text-green-600 dark:text-green-400">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase">Resume Score</p>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">94/100</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl -z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl -z-0"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white dark:bg-slate-800">
          <div className="max-w-6xl mx-auto px-4 md:px-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose ResumeAI?</h2>
              <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                We use advanced natural language processing to read your resume exactly like a recruiter would.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group">
                <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">fact_check</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">ATS Scoring</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Identify if your resume is readable by Applicant Tracking Systems used by 99% of Fortune 500 companies.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group">
                <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">psychology</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Smart Keywords</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Get suggestions for high-impact action verbs and industry-specific keywords missing from your profile.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all border border-slate-100 dark:border-slate-700 group">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 dark:text-green-400 mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl">handshake</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Job Matching</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  We scan thousands of live job listings to match your optimized resume with roles that fit you perfectly.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="how-it-works" className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 md:px-10 relative">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider uppercase text-xs mb-3 block">Simple Process</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white mb-6">From Resume to Hired in 3 Steps</h2>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Stop guessing what recruiters want. Our AI-driven process guides you from your first upload to your final interview with data-backed precision.
              </p>
            </div>
            
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="hidden md:block absolute top-[60px] left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 -z-0"></div>
              
              {/* Step 1 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-slate-50 dark:border-slate-700 mb-8 group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-5xl text-blue-500">upload_file</span>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">1</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Upload Your Resume</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                  Drag &amp; drop your CV (PDF/DOCX). We instantly parse your skills and experience securely.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-slate-50 dark:border-slate-700 mb-8 group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-5xl text-purple-500">smart_toy</span>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">2</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI Analysis &amp; Scoring</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                  Our deep learning model evaluates 50+ data points to score your resume against ATS standards.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col items-center text-center group">
                <div className="relative z-10 w-32 h-32 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full shadow-xl border-4 border-slate-50 dark:border-slate-700 mb-8 group-hover:scale-105 transition-transform duration-300">
                  <span className="material-symbols-outlined text-5xl text-green-500">work_history</span>
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold shadow-md border-2 border-white dark:border-slate-800">3</div>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Get Matched &amp; Hired</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed px-4">
                  Unlock a personalized list of active job openings that perfectly match your optimized profile.
                </p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <button className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold hover:text-blue-700 dark:hover:text-blue-300 transition-colors border-b-2 border-blue-600/20 hover:border-blue-600 pb-0.5">
                See a sample analysis report
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white dark:bg-slate-800">
          <div className="max-w-6xl mx-auto px-4 md:px-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Success Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">star</span>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "I was applying for months with no response. After using ResumeAI to optimize my keywords, I got 3 callbacks in one week!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Sarah Jenkins</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Marketing Manager</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">star</span>
                  ))}
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "The job matching feature is incredible. It didn't just find random jobs, it found roles that actually fit my career trajectory."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">David Chen</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Software Engineer</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow hidden lg:block">
                <div className="flex gap-1 text-yellow-400 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-sm">star</span>
                  ))}
                  <span className="material-symbols-outlined text-sm">star_half</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "Simple, fast, and effective. The initial score was a wake-up call, but the actionable tips helped me fix it in minutes."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-lg">person</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Elena Rodriguez</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Product Designer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Land Your Dream Job?</h2>
            <p className="text-white/90 text-lg mb-8 max-w-xl mx-auto">
              Join 50,000+ job seekers who have optimized their resumes with AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => document.getElementById('resume-upload')?.click()}
                className="px-8 py-3 bg-white text-blue-600 font-bold rounded-lg hover:bg-slate-100 transition-colors shadow-lg"
              >
                Upload Resume Now
              </button>
              <button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white/10 transition-colors">
                View Sample Report
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4 text-white">
                <span className="material-symbols-outlined">smart_toy</span>
                <span className="font-bold text-lg">ResumeAI</span>
              </div>
              <p className="text-sm leading-relaxed">
                AI-powered tools to help you build a better resume and find the perfect job faster.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Resume Checker</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Job Matcher</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Cover Letter Gen</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Blog</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Career Advice</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Resume Examples</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs">© 2023 ResumeAI Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <Link to="#" className="text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </Link>
              <Link to="#" className="text-slate-400 hover:text-white transition-colors" aria-label="LinkedIn">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}