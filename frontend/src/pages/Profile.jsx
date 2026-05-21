import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FileText, BarChart3, Award, Trash2, ExternalLink, Calendar, Plus, X, Star, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const location = useLocation();

  // Active tab state
  const [activeTab, setActiveTab] = useState('settings');
  const [loading, setLoading] = useState(false);

  // Edit states
  const [name, setName] = useState(user?.name || '');
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // History states
  const [interviews, setInterviews] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  
  // Selected single session details
  const [selectedSession, setSelectedSession] = useState(null);

  // Parse hash routing
  useEffect(() => {
    if (location.hash === '#leaderboard') {
      setActiveTab('leaderboard');
    } else if (location.hash === '#history') {
      setActiveTab('interviews');
    }
  }, [location.hash]);

  // Load backend details
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [interviewsRes, resumesRes, leaderboardRes] = await Promise.all([
          api.get('/interviews/history'),
          api.get('/resume/history'),
          api.get('/dsa/leaderboard'),
        ]);

        setInterviews(interviewsRes.data.data || []);
        setResumes(resumesRes.data.data || []);
        setLeaderboard(leaderboardRes.data.data || []);
      } catch (error) {
        console.error('Error fetching profile history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  // Update profile handler
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/auth/profile', { name, skills });
      if (response.data.success) {
        toast.success('Profile updated successfully!');
        await refreshUser();
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update profile settings');
    }
  };

  // Skill management helper
  const handleAddSkill = (e) => {
    e.preventDefault();
    const formatted = newSkill.trim().toUpperCase();
    if (formatted && !skills.includes(formatted)) {
      setSkills((prev) => [...prev, formatted]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills((prev) => prev.filter((s) => s !== skillToRemove));
  };

  const loadSessionDetail = async (id) => {
    try {
      const response = await api.get(`/interviews/session/${id}`);
      if (response.data.success) {
        setSelectedSession(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve session details');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          User Settings & Records
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your career skills, view mock history evaluations, inspect resume ATS scores, or check leaderboard rankings.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800/80 gap-2">
        {[
          { id: 'settings', label: 'Profile & Skills', icon: User },
          { id: 'interviews', label: 'Mock History', icon: BarChart3 },
          { id: 'resumes', label: 'Resume Analyzer Log', icon: FileText },
          { id: 'leaderboard', label: 'Global Leaderboard', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3.5 border-b-2 text-sm font-semibold transition-all -mb-px ${
                activeTab === tab.id
                  ? 'border-sky-500 text-sky-600 dark:text-sky-400'
                  : 'border-transparent text-slate-550 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tabs Content */}
      <div className="min-h-[400px]">
        {loading && interviews.length === 0 && resumes.length === 0 ? (
          <div className="py-12 text-center text-slate-400">Loading profile data...</div>
        ) : (
          <div>
            {/* 1. Settings & Skills */}
            {activeTab === 'settings' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <GlassCard hoverEffect={false} className="lg:col-span-2">
                  <h3 className="font-outfit text-xl font-bold mb-4">Edit Profile</h3>
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                      <input
                        type="text"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 text-sm text-slate-400 cursor-not-allowed"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none focus:border-sky-500"
                        required
                      />
                    </div>

                    <div className="pt-2">
                      <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-sm gradient-btn">
                        Save Profile Changes
                      </button>
                    </div>
                  </form>
                </GlassCard>

                {/* Skills Manager */}
                <GlassCard hoverEffect={false} className="lg:col-span-1 space-y-4">
                  <h3 className="font-outfit text-xl font-bold">Skills Inventory</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Skills here are automatically extracted when you upload resumes, or can be managed manually.
                  </p>

                  <form onSubmit={handleAddSkill} className="flex gap-2">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="e.g. DOCKER"
                      className="flex-grow px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
                    />
                    <button type="submit" className="p-2 rounded-xl bg-sky-500 text-white hover:bg-sky-600 transition-colors">
                      <Plus className="w-5 h-5" />
                    </button>
                  </form>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {skills.length > 0 ? (
                      skills.map((skill) => (
                        <span
                          key={skill}
                          className="flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-slate-800 text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-slate-700/50"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No skills registered yet.</p>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}

            {/* 2. Mock Interviews History */}
            {activeTab === 'interviews' && (
              <GlassCard hoverEffect={false}>
                <h3 className="font-outfit text-xl font-bold mb-4">Past Sessions Logs</h3>
                {interviews.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-650 dark:text-slate-350">
                      <thead className="text-xs text-slate-450 uppercase border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4">Role</th>
                          <th className="py-3 px-4">Difficulty</th>
                          <th className="py-3 px-4">Level</th>
                          <th className="py-3 px-4">Questions</th>
                          <th className="py-3 px-4">Overall Score</th>
                          <th className="py-3 px-4">Date</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                        {interviews.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-100/35 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200">{item.role}</td>
                            <td className="py-4 px-4">{item.difficulty}</td>
                            <td className="py-4 px-4 text-xs">{item.experienceLevel}</td>
                            <td className="py-4 px-4">{item.questions.length}</td>
                            <td className="py-4 px-4">
                              <span className="font-extrabold text-sky-500">{item.overallScore}%</span>
                            </td>
                            <td className="py-4 px-4 text-xs">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <button
                                onClick={() => loadSessionDetail(item._id)}
                                className="text-xs font-bold text-sky-500 hover:underline"
                              >
                                View Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400">No mock interview attempts recorded yet.</div>
                )}
              </GlassCard>
            )}

            {/* 3. Resume History */}
            {activeTab === 'resumes' && (
              <GlassCard hoverEffect={false}>
                <h3 className="font-outfit text-xl font-bold mb-4">ATS Analysis Records</h3>
                {resumes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-650 dark:text-slate-350">
                      <thead className="text-xs text-slate-450 uppercase border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="py-3 px-4">File Name</th>
                          <th className="py-3 px-4">ATS Rating</th>
                          <th className="py-3 px-4">Skills Extracted</th>
                          <th className="py-3 px-4">Date Uploaded</th>
                          <th className="py-3 px-4 text-right">File</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                        {resumes.map((item) => (
                          <tr key={item._id} className="hover:bg-slate-100/35 dark:hover:bg-slate-900/10 transition-colors">
                            <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200 truncate max-w-xs">{item.fileName}</td>
                            <td className="py-4 px-4">
                              <span className="font-extrabold text-violet-500">{item.atsScore}%</span>
                            </td>
                            <td className="py-4 px-4 text-xs truncate max-w-xs">{item.skills.join(', ') || 'N/A'}</td>
                            <td className="py-4 px-4 text-xs">
                              {new Date(item.uploadedAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-right">
                              <a
                                href={`http://localhost:5000/${item.filePath}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-sky-500 hover:underline flex items-center justify-end space-x-1"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400">No resumes analyzed yet.</div>
                )}
              </GlassCard>
            )}

            {/* 4. Global Leaderboard */}
            {activeTab === 'leaderboard' && (
              <GlassCard hoverEffect={false}>
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
                  <div>
                    <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Award className="w-5 h-5 text-amber-500" />
                      <span>PrepAI Champions Leaderboard</span>
                    </h3>
                    <p className="text-xs text-slate-400">Leaderboard points: DSA problem toggles (10pts) + avg interview score (5pts).</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {leaderboard.length > 0 ? (
                    leaderboard.map((player, idx) => {
                      const isCurrentUser = player.userId === user?._id;
                      const placeIcon = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : null;
                      return (
                        <div
                          key={player.userId}
                          className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                            isCurrentUser
                              ? 'border-sky-500/30 bg-sky-500/5 dark:bg-sky-500/0 font-bold'
                              : 'border-slate-150 dark:border-slate-800 bg-white/20 dark:bg-slate-900/10'
                          }`}
                        >
                          <div className="flex items-center space-x-4 min-w-0">
                            {/* Ranking Place Indicator */}
                            <span className="w-8 text-center text-base font-extrabold text-slate-400">
                              {placeIcon || `#${idx + 1}`}
                            </span>

                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1.5">
                                <span>{player.name}</span>
                                {isCurrentUser && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500 text-white uppercase tracking-wider">
                                    You
                                  </span>
                                )}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1 max-w-[200px] sm:max-w-md truncate">
                                {player.skills.join(', ') || 'General CS Enthusiast'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center space-x-6 sm:space-x-12">
                            {/* DSA completed info */}
                            <div className="text-center">
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">DSA Items</p>
                              <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">{player.dsaCount}</p>
                            </div>
                            
                            {/* Interview Score info */}
                            <div className="text-center">
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Avg Score</p>
                              <p className="text-sm font-extrabold text-slate-700 dark:text-slate-300">{player.avgInterviewScore}%</p>
                            </div>

                            {/* Total points */}
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Points</p>
                              <p className="text-base font-black text-sky-500">{player.totalPoints}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-8 text-center text-slate-400">Leaderboard database is initializing...</div>
                  )}
                </div>
              </GlassCard>
            )}
          </div>
        )}
      </div>

      {/* Session Details Modal Overlay */}
      <AnimatePresence>
        {selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              {/* Modal header */}
              <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="font-outfit text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Session Score: {selectedSession.overallScore}%
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {selectedSession.role} • {selectedSession.difficulty} • Generated {new Date(selectedSession.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-350 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Feedbacks Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-1">
                  <h4 className="font-bold text-sky-500 flex items-center gap-1"><Sparkles className="w-4 h-4" /> Technical Feedback</h4>
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-xs">{selectedSession.techFeedback}</p>
                </div>
                <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/10 space-y-1">
                  <h4 className="font-bold text-violet-500 flex items-center gap-1"><User className="w-4 h-4" /> Communication Feedback</h4>
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-xs">{selectedSession.commFeedback}</p>
                </div>
                <div className="p-4 md:col-span-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-1">
                  <h4 className="font-bold text-emerald-500 flex items-center gap-1"><Award className="w-4 h-4" /> Recommended Next Steps</h4>
                  <p className="text-slate-600 dark:text-slate-350 leading-relaxed text-xs">{selectedSession.suggestions}</p>
                </div>
              </div>

              {/* Individual Question break downs */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Responses Breakdown</h4>
                {selectedSession.questions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/15 space-y-3"
                  >
                    <div className="flex justify-between items-start gap-4 text-xs font-semibold">
                      <span className="text-slate-400">Q{idx + 1}</span>
                      <span className="text-sky-500">{q.score}% Score</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">{q.questionText}</p>
                    <div className="text-xs italic text-slate-500 dark:text-slate-400">
                      Answer: "{q.userAnswer || 'No response recorded'}"
                    </div>
                    <div className="text-xs text-slate-650 dark:text-slate-450 border-t border-slate-200/40 dark:border-slate-800/40 pt-2">
                      Review: {q.feedback}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
