'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function NewOpportunityPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    type: 'SIH',
    description: '',
    requiredSkills: 'Python, React, FastApi',
    preferredExperience: 'Prior project evidence',
    membersNeeded: 5,
    deadline: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const skillsArray = formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);
      const res = await fetch('/api/opportunities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          requiredSkills: skillsArray,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create opportunity.');

      router.push(`/opportunities/${data.opportunity.id}`);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  const skillsList = formData.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <button onClick={() => router.back()} className="inline-flex items-center space-x-1 text-xs font-bold text-gray-600 hover:text-gray-900">
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Opportunities</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Column */}
        <div className="lg:col-span-7 editorial-card p-7 space-y-6">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#0A2B22] block mb-1">
              POST OPPORTUNITY
            </span>
            <h1 className="font-serif-editorial text-3xl text-gray-900">Announce Project Team</h1>
            <p className="text-xs text-[#5A6963] mt-1 font-sans-editorial">
              Post your SIH 2026 or hackathon team requirements to find verified student candidate matches.
            </p>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs font-semibold">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Opportunity Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2.5 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs font-semibold text-gray-900"
              >
                <option value="SIH">Smart India Hackathon (SIH 2026)</option>
                <option value="Hackathon">External Hackathon</option>
                <option value="College Project">College Academic Project</option>
                <option value="Research">Research & Paper</option>
                <option value="Startup">Startup / Venture</option>
                <option value="Personal Project">Personal Technical Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Project Title</label>
              <input
                type="text"
                required
                placeholder="e.g. SIH 2026 — AI Women Safety & Geo-Alert Engine"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2.5 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Project Description</label>
              <textarea
                required
                rows={3}
                placeholder="Describe problem statement, objectives, and role requirements..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2.5 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Required Skills (Comma-separated)</label>
              <input
                type="text"
                required
                placeholder="Python, PyTorch, React, FastApi, IoT"
                value={formData.requiredSkills}
                onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                className="w-full p-2.5 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:border-[#0A2B22]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Members Needed</label>
                <input
                  type="number"
                  min={2}
                  max={10}
                  value={formData.membersNeeded}
                  onChange={(e) => setFormData({ ...formData, membersNeeded: Number(e.target.value) })}
                  className="w-full p-2.5 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full p-2.5 bg-[#F8F7F5] border border-gray-200 rounded-lg text-xs text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0A2B22] hover:bg-[#051A14] text-[#B7F34A] font-extrabold text-xs rounded-xl transition-colors shadow-md"
            >
              {loading ? 'Publishing...' : 'Publish Announcement'}
            </button>
          </form>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#5A6963] block">
            LIVE PREVIEW
          </span>

          <div className="editorial-card p-6 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-800 border border-stone-200">
                {formData.type === 'SIH' ? 'SIH 2026' : formData.type}
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {formData.deadline ? formData.deadline : 'Open'}
              </span>
            </div>

            <h3 className="font-serif-editorial text-xl text-gray-900 leading-snug">
              {formData.title || 'Untitled Opportunity'}
            </h3>

            <p className="text-xs text-[#5A6963] line-clamp-3 leading-relaxed font-sans-editorial">
              {formData.description || 'Description will appear here as you type...'}
            </p>

            <div className="pt-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">
                LOOKING FOR
              </span>
              <div className="flex flex-wrap gap-1">
                {skillsList.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#F8F7F5] text-gray-800 border border-gray-200">
                    {sk}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
