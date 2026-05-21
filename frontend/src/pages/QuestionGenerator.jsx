import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Star, Bookmark, Play, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const QuestionGenerator = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: 'Frontend',
    difficulty: 'Medium',
    experienceLevel: 'Entry Level',
    count: 5,
  });
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [savingMap, setSavingMap] = useState({});

  const roles = ['Frontend', 'Backend', 'Full Stack', 'Java', 'React', 'Python', 'Data Science', 'DevOps'];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const experienceLevels = ['Entry Level', 'Mid Level', 'Senior'];
  const counts = [3, 5, 8, 10];

  const handleGenerate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post('/questions/generate', formData);
      if (response.data.success) {
        setGeneratedQuestions(response.data.data || []);
        toast.success('Questions generated successfully!');
      } else {
        toast.error('Failed to generate questions');
      }
    } catch (error) {
      console.error('Question generation error:', error);
      toast.error('Server error generating questions');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveQuestion = async (questionText, index) => {
    try {
      setSavingMap((prev) => ({ ...prev, [index]: true }));
      const response = await api.post('/questions/save', {
        role: formData.role,
        difficulty: formData.difficulty,
        experienceLevel: formData.experienceLevel,
        questionText: questionText,
      });

      if (response.data.success) {
        toast.success('Question added to bookmarks!');
      } else {
        toast.error(response.data.message || 'Could not save question');
      }
    } catch (error) {
      console.error('Save question error:', error);
      toast.error(error.response?.data?.message || 'Question might be already saved');
    } finally {
      setSavingMap((prev) => ({ ...prev, [index]: false }));
    }
  };

  const startMockInterview = () => {
    if (generatedQuestions.length === 0) return;
    
    // Pass generated questions directly to the mock interview page via router state
    navigate('/interview', {
      state: {
        customQuestions: generatedQuestions,
        role: formData.role,
        difficulty: formData.difficulty,
        experienceLevel: formData.experienceLevel,
      },
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          AI Interview Question Generator
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Pick your role, experience level, and difficulty to generate custom questions, or bookmark them for future practice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Selector Filters */}
        <GlassCard hoverEffect={false} className="lg:col-span-1">
          <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 w-fit text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Filters Configuration</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-5">
            {/* Role selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 dark:focus:border-violet-500 focus:outline-none text-sm transition-all text-slate-800 dark:text-slate-150"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>

            {/* Experience level selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 dark:focus:border-violet-500 focus:outline-none text-sm transition-all text-slate-800 dark:text-slate-150"
              >
                {experienceLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
            </div>

            {/* Difficulty selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Difficulty Degree
              </label>
              <div className="grid grid-cols-3 gap-2">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: diff })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.difficulty === diff
                        ? 'bg-sky-500 border-sky-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Question count selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Question Count
              </label>
              <div className="grid grid-cols-4 gap-2">
                {counts.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setFormData({ ...formData, count: c })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      formData.count === c
                        ? 'bg-violet-500 border-violet-500 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:bg-slate-100/50'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center space-x-2 gradient-btn disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white rounded-full animate-spin border-t-transparent" />
              ) : (
                <>
                  <span>Generate Questions</span>
                  <Brain className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Generated Questions List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick link button to start interview */}
          {generatedQuestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/5 dark:to-teal-500/5 border border-emerald-500/20 text-slate-800 dark:text-slate-200 gap-4"
            >
              <div className="flex items-center space-x-3 text-center sm:text-left">
                <div className="p-2.5 rounded-xl bg-emerald-500 text-white shadow-sm">
                  <Play className="w-4 h-4 fill-current" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Launch Mock Session Now</h4>
                  <p className="text-xs text-slate-400">Answer these generated questions with voice recording</p>
                </div>
              </div>
              <button
                onClick={startMockInterview}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 shadow-md transition-all flex items-center space-x-1.5 self-stretch sm:self-auto justify-center"
              >
                <span>Start Mock Test</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {loading ? (
              // Skeletons
              <div className="space-y-4">
                {[...Array(formData.count)].map((_, i) => (
                  <div key={i} className="animate-pulse glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4"></div>
                    <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : generatedQuestions.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                {generatedQuestions.map((question, idx) => (
                  <GlassCard key={idx} hoverEffect={true} delay={idx * 0.05} className="flex justify-between items-start gap-4">
                    <div className="space-y-2 flex-grow">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400">
                        Question {idx + 1}
                      </span>
                      <p className="text-base font-bold text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
                        {question}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSaveQuestion(question, idx)}
                      disabled={savingMap[idx]}
                      className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 text-slate-400 hover:text-violet-500 dark:text-slate-500 transition-all flex-shrink-0"
                      title="Bookmark Question"
                    >
                      <Bookmark className={`w-4 h-4 ${savingMap[idx] ? 'animate-spin' : ''}`} />
                    </button>
                  </GlassCard>
                ))}
              </motion.div>
            ) : (
              // Empty State
              <GlassCard hoverEffect={false} className="flex flex-col items-center justify-center text-center py-12 text-slate-400 min-h-[350px]">
                <Brain className="w-14 h-14 text-slate-300 dark:text-slate-800 mb-4 animate-pulse-slow" />
                <h4 className="font-outfit text-lg font-bold text-slate-700 dark:text-slate-300">No questions generated yet</h4>
                <p className="text-sm text-slate-500 max-w-xs mt-1">
                  Configure the interview profile on the left panel and click Generate to query the AI interviewer.
                </p>
              </GlassCard>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
