'use client';

import React, { useEffect, useState } from 'react';
import { ProjectCard } from '@/components/ProjectCard';
import { Plus, FolderCode, Sparkles, ShieldCheck } from 'lucide-react';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    githubUrl: '',
    liveUrl: '',
    role: 'Lead Developer',
    teamSize: 3,
    technologies: 'Python, PyTorch, React, FastApi',
  });

  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.projects) setProjects(data.projects);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleReanalyze = async (id: string) => {
    await fetch(`/api/projects/${id}/reanalyze`, { method: 'POST' });
    fetchProjects();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    setError('');

    try {
      let uploadedFilesJson = '[]';

      if (uploadFile) {
        const fileFormData = new FormData();
        fileFormData.append('file', uploadFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: fileFormData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.error || 'File upload failed.');

        uploadedFilesJson = JSON.stringify([
          { filename: uploadData.filename, savedPath: uploadData.savedPath, sizeBytes: uploadData.sizeBytes },
        ]);
      }

      const techsArray = formData.technologies.split(',').map((t) => t.trim()).filter(Boolean);

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: techsArray,
          uploadedFiles: uploadedFilesJson,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Project submission failed.');

      setShowModal(false);
      fetchProjects();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-noise">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block">
            EVIDENCE-BASED REPOSITORIES
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif-editorial text-gray-900 leading-tight">
            Project Portfolio
          </h1>
          <p className="text-xs text-[#5A6963] max-w-lg pt-1 font-sans-editorial">
            Submit repositories or code archives. TeamMatch AI extracts technical evidence to build your verified skill profile.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-1.5 px-5 py-3 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-95 shrink-0 shadow-md"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Submit New Project</span>
        </button>
      </div>

      {/* Projects Feed */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 editorial-card">Loading project portfolio...</div>
      ) : projects.length === 0 ? (
        <div className="editorial-card p-12 text-center space-y-3">
          <h3 className="font-serif-editorial text-2xl text-gray-900">No Projects Submitted Yet</h3>
          <p className="text-xs text-[#5A6963]">Submit your first GitHub repo to trigger AI skill verification.</p>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 bg-[#0A2B22] text-[#B7F34A] font-bold text-xs rounded-xl"
          >
            + Submit Project
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {projects.map((proj) => (
            <ProjectCard key={proj.id} {...proj} onReanalyze={handleReanalyze} />
          ))}
        </div>
      )}

      {/* SUBMIT PROJECT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#F8F7F5] max-w-lg w-full rounded-2xl p-7 border border-gray-300 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto text-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22]">
                  GLBITM VERIFICATION
                </span>
                <h3 className="font-serif-editorial text-2xl text-gray-900">Submit Project</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-700 font-extrabold text-lg p-1"
              >
                ✕
              </button>
            </div>

            {error && <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-xl">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SIH 2026 Women Safety Platform"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain architecture, key features, and your technical contribution..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  GitHub Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl text-xs focus:outline-none focus:border-[#0A2B22]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Or Upload Code Archive (.zip)
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="w-full p-2 bg-white border border-gray-300 rounded-xl text-xs text-gray-600"
                />
              </div>

              <button
                type="submit"
                disabled={submitLoading}
                className="w-full py-3.5 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-all active:scale-98 flex items-center justify-center space-x-2"
              >
                <span>{submitLoading ? 'Analyzing Code...' : 'Submit & Trigger AI Skill Analysis'}</span>
                <Sparkles className="w-4 h-4 text-[#B7F34A]" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
