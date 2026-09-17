'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ShieldCheck, ArrowRight, CheckCircle2, RefreshCw, Sparkles } from 'lucide-react';

export default function OnboardingRegisterPage() {
  const router = useRouter();

  // Multi-step Onboarding Step state: 1 to 5
  // Step 1: Email + OTP
  // Step 2: Basic Profile (Branch, Year, Bio)
  // Step 3: Social Links (LinkedIn, GitHub)
  // Step 4: Add First Project (GitHub / ZIP)
  // Step 5: AI Analysis & Ready
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpPreview, setOtpPreview] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const [branch, setBranch] = useState('CSE');
  const [year, setYear] = useState('3rd Year');
  const [bio, setBio] = useState('');

  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const [projectTitle, setProjectTitle] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [projectGithub, setProjectGithub] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  // AI Pipeline State
  const [analyzing, setAnalyzing] = useState(false);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 Handler: Request OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed.');

      if (data.otpPreview) setOtpPreview(data.otpPreview);
      setOtpSent(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1 Handler: Verify OTP & Advance
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, branch, year }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verification failed.');

      setCurrentStep(2);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Step 4 Handler: Submit Project & Trigger AI Analysis Pipeline
  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let fileJson = '[]';
      if (uploadedFile) {
        const formData = new FormData();
        formData.append('file', uploadedFile);
        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'File upload failed');
        fileJson = JSON.stringify([uploadData.file]);
      }

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: projectTitle || 'GLBITM Innovation Project',
          description: projectDesc || 'Project submitted during onboarding.',
          githubUrl: projectGithub || githubUrl,
          uploadedFilesJson: fileJson,
          branch,
          year,
          bio,
          linkedinUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Project creation failed');

      if (data.project?.id) {
        setCreatedProjectId(data.project.id);
        setCurrentStep(5);
        startRealAnalysisPolling(data.project.id);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Step 5: Real Polling of AI analysis status
  const startRealAnalysisPolling = (projId: string) => {
    setAnalyzing(true);
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/projects/${projId}`);
        const data = await res.json();
        const status = data.project?.analysis?.status;

        if (status === 'completed' || status === 'failed') {
          clearInterval(interval);
          setAnalyzing(false);
        }
      } catch {
        // Continue polling until completed or failed
      }
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-noise">
      
      {/* Editorial Step Progress Header */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center shadow-xs">
        <div className="flex items-center justify-between text-[10px] font-extrabold tracking-widest text-[#5A6963] uppercase">
          <span className={currentStep === 1 ? 'text-[#0A2B22] underline underline-offset-4' : ''}>01 EMAIL</span>
          <span>·</span>
          <span className={currentStep === 2 ? 'text-[#0A2B22] underline underline-offset-4' : ''}>02 PROFILE</span>
          <span>·</span>
          <span className={currentStep === 3 ? 'text-[#0A2B22] underline underline-offset-4' : ''}>03 LINKS</span>
          <span>·</span>
          <span className={currentStep === 4 ? 'text-[#0A2B22] underline underline-offset-4' : ''}>04 PROJECT</span>
          <span>·</span>
          <span className={currentStep === 5 ? 'text-[#0A2B22] underline underline-offset-4' : ''}>05 READY</span>
        </div>
      </div>

      <div className="editorial-card p-8 space-y-6">
        
        {/* Step 1: GLBITM Verification */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#0A2B22] text-[#B7F34A] border border-[#B7F34A]/30 inline-block mb-1">
                Step 1 of 5
              </span>
              <h1 className="font-serif-editorial text-3xl text-gray-900">GLBITM Student Verification</h1>
              <p className="text-xs text-[#5A6963] font-sans-editorial">
                Enter your official student email (@glbitm.ac.in) to receive verification code.
              </p>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">{error}</div>}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">GLBITM Student Email</label>
                  <input
                    type="email"
                    required
                    placeholder="student.name.cse24@glbitm.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center space-x-2 shadow-md"
                >
                  <span>{loading ? 'Sending Code...' : 'Send OTP Verification Code'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {otpPreview && (
                  <div className="p-3 bg-[#0A2B22] text-[#B7F34A] text-xs font-semibold rounded-xl border border-[#B7F34A]/30 text-center">
                    🔑 Verification Code: <span className="font-mono text-sm underline">{otpPreview}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">6-Digit OTP Code</label>
                  <input
                    type="text"
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-center font-mono text-base text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98"
                >
                  {loading ? 'Verifying...' : 'Verify OTP & Continue'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step 2: Basic Profile */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-stone-100 text-stone-800 border border-stone-200 inline-block mb-1">
                Step 2 of 5
              </span>
              <h1 className="font-serif-editorial text-3xl text-gray-900">Academic Profile</h1>
              <p className="text-xs text-[#5A6963] font-sans-editorial">Select your branch, year, and a brief intro.</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  >
                    <option value="CSE">CSE</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="AI/DS">AI/DS</option>
                    <option value="ME">ME</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Year</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs font-semibold text-gray-900"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Short Bio</label>
                <textarea
                  rows={3}
                  placeholder="Passionate about AI/ML, building backend microservices for SIH 2026..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <button
                onClick={() => setCurrentStep(3)}
                className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Continue to Developer Profiles</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Links */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-stone-100 text-stone-800 border border-stone-200 inline-block mb-1">
                Step 3 of 5
              </span>
              <h1 className="font-serif-editorial text-3xl text-gray-900">Developer Profiles</h1>
              <p className="text-xs text-[#5A6963] font-sans-editorial">Link your GitHub and LinkedIn for evidence verification.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">GitHub Profile URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">LinkedIn Profile URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/your-profile"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <button
                onClick={() => setCurrentStep(4)}
                className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center space-x-2 shadow-md"
              >
                <span>Continue to Project Submission</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Add First Project */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-stone-100 text-stone-800 border border-stone-200 inline-block mb-1">
                Step 4 of 5
              </span>
              <h1 className="font-serif-editorial text-3xl text-gray-900">Submit Project Evidence</h1>
              <p className="text-xs text-[#5A6963] font-sans-editorial">Provide a GitHub repository link or source code archive.</p>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">{error}</div>}

            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI-Based Traffic Optimization System"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Project Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Built for SIH 2026 problem statement using Python and PyTorch..."
                  value={projectDesc}
                  onChange={(e) => setProjectDesc(e.target.value)}
                  className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">GitHub Repository URL (Recommended)</label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/your-repo"
                  value={projectGithub}
                  onChange={(e) => setProjectGithub(e.target.value)}
                  className="w-full p-3 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Or Upload Code Archive (.zip / .tar.gz)</label>
                <input
                  type="file"
                  accept=".zip,.gz,.tar"
                  onChange={(e) => setUploadedFile(e.target.files?.[0] || null)}
                  className="w-full p-2.5 bg-[#F8F7F5] border border-gray-200 rounded-xl text-xs text-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center space-x-2 shadow-md"
              >
                <span>{loading ? 'Submitting...' : 'Analyze Project & Generate Verified Profile'}</span>
                <Sparkles className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </form>
          </div>
        )}

        {/* Step 5: AI Pipeline & Complete */}
        {currentStep === 5 && (
          <div className="space-y-6 text-center py-4">
            {analyzing ? (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-[#0A2B22] text-[#B7F34A] flex items-center justify-center mx-auto border border-[#B7F34A]/30 animate-spin">
                  <RefreshCw className="w-6 h-6" />
                </div>
                <h2 className="font-serif-editorial text-2xl text-gray-900">Analyzing Project Evidence...</h2>
                <div className="space-y-1.5 text-xs text-[#5A6963] max-w-sm mx-auto font-sans-editorial">
                  <p>✓ Extracting technologies from commit history</p>
                  <p>✓ Assessing technical ownership & AI assistance level</p>
                  <p>✓ Registering evidence-backed Verified Skills</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#0A2B22] text-[#B7F34A] flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 className="w-8 h-8 text-[#B7F34A]" />
                </div>
                <h2 className="font-serif-editorial text-3xl text-gray-900">Verified Profile Ready!</h2>
                <p className="text-xs text-[#5A6963] max-w-md mx-auto leading-relaxed font-sans-editorial">
                  Your GLBITM student profile has been created with evidence-backed skills derived from your submitted code.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-95 shadow-md"
                  >
                    Go to Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/students')}
                    className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-gray-800 font-bold text-xs rounded-xl transition-all active:scale-95"
                  >
                    Find Teammates
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
