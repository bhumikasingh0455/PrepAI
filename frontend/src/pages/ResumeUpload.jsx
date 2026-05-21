import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle, AlertCircle, ArrowRight, RefreshCw, Star, Sparkles } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const ResumeUpload = () => {
  const { refreshUser } = useAuth();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('Software Engineer');
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  // Status message rotation for loading state
  useEffect(() => {
    let interval;
    if (uploading) {
      const messages = [
        'Uploading PDF to cloud sandbox...',
        'Parsing PDF file contents...',
        'Extracting key skills and technology stacks...',
        'Comparing formatting against ATS standards...',
        'Querying OpenAI model for expert recommendations...',
        'Calculating simulated ATS matching scores...'
      ];
      let counter = 0;
      setStatusMessage(messages[0]);
      
      interval = setInterval(() => {
        counter = (counter + 1) % messages.length;
        setStatusMessage(messages[counter]);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [uploading]);

  // Fetch resume upload history
  const fetchHistory = async () => {
    try {
      setFetchingHistory(true);
      const response = await api.get('/resume/history');
      if (response.data.success) {
        setHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('History fetch error:', error);
    } finally {
      setFetchingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (selected.type !== 'application/pdf') {
        toast.error('Only PDF files are supported');
        return;
      }
      if (selected.size > 5 * 1024 * 1024) {
        toast.error('Maximum file size is 5MB');
        return;
      }
      setFile(selected);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a PDF file first');
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('role', role);

    try {
      setUploading(true);
      const response = await api.post('/resume/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        toast.success('Resume analyzed successfully!');
        setAnalysisResult(response.data.data);
        await refreshUser(); // Update skills in Auth Context
        fetchHistory(); // Refresh history table
      } else {
        toast.error(response.data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Server error during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          Resume ATS Analyzer
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload your PDF resume to check ATS compliance, extract skills, and view layout improvements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload Card */}
        <GlassCard hoverEffect={false} className="lg:col-span-1">
          <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Analyze New Resume</h3>
          
          <form onSubmit={handleUpload} className="space-y-5">
            {/* Target Role input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Target Role / Job Position
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. React Developer"
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 dark:focus:border-violet-500 focus:outline-none text-sm transition-all"
                required
              />
            </div>

            {/* File drag-drop box */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                PDF Resume File
              </label>
              <div className="relative border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-sky-500 dark:hover:border-violet-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-white/20 dark:bg-slate-900/10">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                
                {file ? (
                  <div className="space-y-2">
                    <FileText className="w-10 h-10 mx-auto text-sky-500" />
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-350 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB • PDF Format
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="w-10 h-10 mx-auto text-slate-400" />
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      Drag & drop your PDF or click to browse
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports PDF up to 5MB
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={uploading || !file}
              className="w-full py-3 rounded-xl font-bold flex items-center justify-center space-x-2 gradient-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Analyzing Document...</span>
                </div>
              ) : (
                <>
                  <span>Analyze ATS Score</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Loading status message */}
          {uploading && (
            <div className="mt-4 p-3 rounded-xl bg-sky-500/10 dark:bg-sky-500/5 border border-sky-500/10 text-center">
              <p className="text-xs text-sky-600 dark:text-sky-400 font-medium animate-pulse">
                {statusMessage}
              </p>
            </div>
          )}
        </GlassCard>

        {/* Results / Feedback Section */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {analysisResult ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <GlassCard hoverEffect={false}>
                  {/* ATS Rating Score Box */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="space-y-1.5 text-center sm:text-left">
                      <div className="flex items-center justify-center sm:justify-start space-x-2 px-3 py-1 rounded-full bg-violet-500/10 text-violet-500 w-fit text-xs font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>ATS Analysis Completed</span>
                      </div>
                      <h3 className="font-outfit text-2xl font-bold text-slate-800 dark:text-slate-100">
                        {analysisResult.fileName}
                      </h3>
                      <p className="text-xs text-slate-400">
                        Evaluated for: <span className="font-bold text-slate-700 dark:text-slate-350">{role}</span>
                      </p>
                    </div>

                    {/* Radial Score Gauge */}
                    <div className="relative flex items-center justify-center">
                      <svg className="w-24 h-24 transform -rotate-90">
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="rgba(100,116,139,0.1)"
                          strokeWidth="8"
                          fill="transparent"
                        />
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="url(#atsScoreGradient)"
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray={251.2}
                          strokeDashoffset={251.2 - (251.2 * analysisResult.atsScore) / 100}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="atsScoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute text-xl font-extrabold text-slate-800 dark:text-slate-100">
                        {analysisResult.atsScore}%
                      </span>
                    </div>
                  </div>

                  {/* Extracted Skills */}
                  <div className="py-6 border-b border-slate-200/50 dark:border-slate-800/50 space-y-3">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Extracted Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.skills && analysisResult.skills.length > 0 ? (
                        analysisResult.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 rounded-xl text-xs font-semibold bg-sky-50 dark:bg-slate-800/50 text-sky-600 dark:text-sky-400 border border-sky-100/50 dark:border-slate-700/50"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-sm text-slate-400">No core technical skills could be extracted.</p>
                      )}
                    </div>
                  </div>

                  {/* ATS Feedback Suggestions */}
                  <div className="pt-6 space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      ATS Format & Compliance Suggestions
                    </h4>
                    <ul className="space-y-3.5">
                      {analysisResult.feedback && analysisResult.feedback.length > 0 ? (
                        analysisResult.feedback.map((item, idx) => (
                          <li key={idx} className="flex items-start space-x-3 text-sm text-slate-600 dark:text-slate-350">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="flex items-start space-x-3 text-sm text-slate-600 dark:text-slate-350">
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span>Structure complies fully with SaaS standards. Keep refining keyword metrics.</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              // Empty State
              <GlassCard hoverEffect={false} className="flex flex-col items-center justify-center text-center py-12 text-slate-400 min-h-[350px]">
                <FileText className="w-14 h-14 text-slate-300 dark:text-slate-800 mb-4 animate-pulse-slow" />
                <h4 className="font-outfit text-lg font-bold text-slate-700 dark:text-slate-300">No active analysis report</h4>
                <p className="text-sm text-slate-500 max-w-xs mt-1">
                  Upload your resume PDF in the left panel to trigger the AI-based ATS check.
                </p>
              </GlassCard>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Upload History Table */}
      <GlassCard hoverEffect={false}>
        <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Analysis History</h3>
        
        {fetchingHistory ? (
          <div className="py-8 text-center text-slate-400">Loading history...</div>
        ) : history.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-350">
              <thead className="text-xs text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">ATS Score</th>
                  <th className="py-3 px-4">Extracted Skills</th>
                  <th className="py-3 px-4">Uploaded At</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                {history.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/20 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-800 dark:text-slate-200 max-w-xs truncate">
                      {item.fileName}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        item.atsScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : item.atsScore >= 60
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {item.atsScore}%
                      </span>
                    </td>
                    <td className="py-4 px-4 max-w-xs truncate">
                      {item.skills.join(', ') || 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      {new Date(item.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => setAnalysisResult(item)}
                        className="text-xs font-bold text-sky-500 hover:underline"
                      >
                        Load Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400">No previous resume uploads found.</div>
        )}
      </GlassCard>
    </div>
  );
};

export default ResumeUpload;
