'use client';

import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useAirData } from '../../context/AirDataContext';
import {
  MessageSquare,
  ThumbsUp,
  MapPin,
  Tag,
  Plus,
  ShieldCheck,
  Search,
  AlertTriangle,
  Car,
  Home,
  CheckCircle2,
  X,
} from 'lucide-react';

export default function CommunityPage() {
  const { user, isAuthenticated } = useAuth();
  const { airData, selectedCity } = useAirData();

  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // New tip modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState('indoor_hack');
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    { id: 'all', label: 'All Community Posts' },
    { id: 'smog_alert', label: 'Smog Alerts' },
    { id: 'indoor_hack', label: 'Indoor DIY & Hacks' },
    { id: 'carpooling', label: 'Carpooling' },
    { id: 'clean_commute', label: 'Clean Transit' },
    { id: 'general_advice', label: 'Health Tips' },
  ];

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/community/posts', {
        params: {
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchTerm.trim() || undefined,
        },
      });
      if (res.data.success) {
        setPosts(res.data.posts);
      }
    } catch (err) {
      console.warn('Failed to load community posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts();
  };

  const handleUpvote = async (id) => {
    try {
      const res = await api.post(`/community/posts/${id}/upvote`);
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, upvotes: res.data.upvotes } : p))
        );
      }
    } catch (err) {
      console.warn('Upvote error:', err);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);

    try {
      const res = await api.post('/community/posts', {
        title: newTitle,
        content: newContent,
        category: newCategory,
        location: airData?.city || selectedCity,
        authorName: user?.name || 'Community Neighbor',
      });

      if (res.data.success) {
        setPosts((prev) => [res.data.post, ...prev]);
        setModalOpen(false);
        setNewTitle('');
        setNewContent('');
      }
    } catch (err) {
      console.warn('Post creation error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-700">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Community Smog Awareness & Sustainability Board
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Crowdsourced winter air pollution alerts, verified DIY purifier blueprints, and green commute initiatives.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Share Environmental Tip</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-full font-semibold border transition-all shrink-0 ${
                selectedCategory === c.id
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative md:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search alerts, tips, areas..."
            className="w-full pl-9 pr-3 py-2 bg-white rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-2xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>
      </div>

      {/* Posts Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && posts.length === 0 ? (
          [1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white p-6 rounded-3xl border border-slate-200 h-56 animate-pulse flex flex-col justify-between">
              <div className="h-4 bg-slate-200 rounded w-1/4" />
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-4/5" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-2/3" />
              </div>
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))
        ) : (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                {/* Category & Badge */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                    {post.category.replace('_', ' ')}
                  </span>
                  {post.verifiedTip && (
                    <span className="flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>Verified Tip</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-extrabold text-slate-900 text-base leading-snug">{post.title}</h3>

                {/* Content */}
                <p className="text-xs text-slate-600 leading-relaxed">{post.content}</p>
              </div>

              {/* Bottom Meta & Upvoting */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div>
                  <div className="font-semibold text-slate-700 text-[11px]">{post.authorName}</div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{post.location}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleUpvote(post._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border border-slate-200 hover:border-purple-200 transition-colors font-bold text-xs"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.upvotes}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {posts.length === 0 && !loading && (
        <div className="p-12 text-center text-slate-400 text-xs">
          No community posts matching this filter. Be the first to share an alert!
        </div>
      )}

      {/* New Tip Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Share an Environmental Tip or Alert</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                >
                  <option value="indoor_hack">Indoor DIY & Purification Hack</option>
                  <option value="smog_alert">Localized Smog / Inversion Spike Alert</option>
                  <option value="carpooling">Carpooling Opportunity</option>
                  <option value="clean_commute">Public Transit & Clean Commute</option>
                  <option value="general_advice">General Environmental Health</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Free DIY window draft seals with rolled towels..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Details & Instructions</label>
                <textarea
                  rows={4}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Explain what to do, why it works, and how your neighbors can replicate it..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish Tip'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
