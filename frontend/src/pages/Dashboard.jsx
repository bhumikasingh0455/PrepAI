import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Play, FileText, CheckSquare, Award, ArrowRight, Brain, Sparkles, TrendingUp } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const Dashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: 0,
    resumesUploaded: 0,
    dsaCompleted: 0,
  });
  const [recentSessions, setRecentSessions] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [dsaRadarData, setDsaRadarData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Concurrent requests for fast load
        const [interviewsRes, scoresRes, dsaRes, resumeRes] = await Promise.all([
          api.get('/interviews/history'),
          api.get('/interviews/scores'),
          api.get('/dsa/progress'),
          api.get('/resume/history'),
        ]);

        const sessions = interviewsRes.data.data || [];
        const scoreHistory = scoresRes.data.data || [];
        const completedDsa = dsaRes.data.data || [];
        const resumes = resumeRes.data.data || [];

        // Calculate Stats
        const total = sessions.length;
        const avg = total > 0 ? Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / total) : 0;
        
        setStats({
          totalInterviews: total,
          avgScore: avg,
          resumesUploaded: resumes.length,
          dsaCompleted: completedDsa.length,
        });

        // Set recent 3 sessions
        setRecentSessions(sessions.slice(0, 3));

        // Format Interview Progress Chart Data (Line/Area)
        if (scoreHistory.length > 0) {
          const formatted = scoreHistory.map((s, idx) => ({
            name: `Session ${idx + 1}`,
            score: s.score,
          }));
          setChartData(formatted);
        } else {
          // Placeholder to make dashboard look rich for new users
          setChartData([
            { name: 'Start', score: 0 },
          ]);
        }

        // Format DSA Topics for Radar Chart
        const dsaTopics = ['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs'];
        const radar = dsaTopics.map((topic) => {
          const count = completedDsa.filter((p) => p.topic === topic).length;
          // Assume 6 standard questions per topic for progress representation
          const percent = Math.min(Math.round((count / 6) * 100), 100);
          return {
            subject: topic,
            A: percent,
            fullMark: 100,
          };
        });
        setDsaRadarData(radar);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const dsaPercentage = Math.round((stats.dsaCompleted / 30) * 100); // 30 questions total (6 per topic)

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-sky-200 dark:border-slate-800 rounded-full animate-spin border-t-sky-500"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Aggregating platform metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-violet-600 p-8 text-white relative overflow-hidden shadow-lg border border-sky-400/20"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-[50px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 w-fit text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personalized Career Dashboard</span>
            </div>
            <h1 className="font-outfit text-3xl md:text-4xl font-bold">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sky-100 max-w-md text-sm md:text-base leading-relaxed">
              Unlock top scores by taking targeted mock interviews or optimizing your resume with ATS checks today.
            </p>
          </div>
          <Link
            to="/interview"
            className="flex items-center space-x-2 px-6 py-3.5 rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-50 shadow-md transition-all whitespace-nowrap"
          >
            <Play className="w-4 h-4 fill-current text-violet-600" />
            <span>Start Practice Session</span>
          </Link>
        </div>
      </motion.div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: 'Avg Interview Score', value: `${stats.avgScore}%`, icon: Award, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Interviews Taken', value: stats.totalInterviews, icon: Brain, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Resumes Analyzed', value: stats.resumesUploaded, icon: FileText, color: 'text-sky-500 bg-sky-500/10' },
          { label: 'DSA Completed', value: `${stats.dsaCompleted}/30`, icon: CheckSquare, color: 'text-emerald-500 bg-emerald-500/10' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <GlassCard key={idx} hoverEffect={true} delay={idx * 0.05} className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-slate-400 dark:text-slate-500">{item.label}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100">{item.value}</h3>
              </div>
              <div className={`p-3 rounded-xl ${item.color}`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score History Graph */}
        <GlassCard hoverEffect={false} className="lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">Performance Over Time</h3>
              <p className="text-xs text-slate-500">Your average mock interview evaluation scores</p>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Score Analytics</span>
            </div>
          </div>
          <div className="h-[280px]">
            {stats.totalInterviews > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                  <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex flex-col justify-center items-center text-slate-400 dark:text-slate-500 text-sm">
                <p>No interview history yet.</p>
                <Link to="/interview" className="text-sky-500 hover:underline mt-2 font-semibold">Take a practice session to load stats →</Link>
              </div>
            )}
          </div>
        </GlassCard>

        {/* DSA Radar Chart */}
        <GlassCard hoverEffect={false}>
          <div className="mb-6">
            <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">Topic-wise DSA Level</h3>
            <p className="text-xs text-slate-500">Mastery percentages across topics</p>
          </div>
          <div className="h-[280px] flex items-center justify-center">
            {stats.dsaCompleted > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" radius="70%" data={dsaRadarData}>
                  <PolarGrid stroke="rgba(100,116,139,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <Radar name="DSA Topic Progress" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-slate-400 dark:text-slate-500 text-sm">
                <p>No DSA progress logged yet.</p>
                <Link to="/dsa" className="text-violet-500 hover:underline mt-2 font-semibold inline-block">Toggle DSA checklist →</Link>
              </div>
            )}
          </div>
        </GlassCard>
      </div>

      {/* Recents and DSA overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Interviews list */}
        <GlassCard hoverEffect={false} className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">Recent Mock Sessions</h3>
            <Link to="/profile" className="text-xs font-bold text-sky-500 hover:underline flex items-center space-x-0.5">
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-4 flex-grow">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <div
                  key={session._id}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                      {session.role}
                    </span>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-1.5">
                      {session.difficulty} difficulty • {session.questions.length} questions
                    </h4>
                    <p className="text-xs text-slate-400">
                      {new Date(session.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-extrabold text-sky-500">{session.overallScore}%</span>
                    <Link
                      to={`/profile?session=${session._id}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      Report
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-8">
                <Brain className="w-10 h-10 text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-sm">You haven't completed any mock interviews yet.</p>
                <Link
                  to="/generator"
                  className="mt-3 px-4 py-2 rounded-xl text-xs font-bold gradient-btn flex items-center space-x-1.5"
                >
                  <span>Launch First Session</span>
                </Link>
              </div>
            )}
          </div>
        </GlassCard>

        {/* DSA Tracker overview */}
        <GlassCard hoverEffect={false} className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">DSA Progress Checklist</h3>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-500">
              Overall: {dsaPercentage}% Completed
            </span>
          </div>

          <div className="space-y-4 flex-grow">
            <p className="text-sm text-slate-500 leading-relaxed">
              Prepare step-by-step for FAANG/SaaS technical coding rounds. Review core concepts across basic and advanced structural topics:
            </p>

            <div className="space-y-3.5">
              {['Arrays', 'Strings', 'Linked List', 'Trees', 'Graphs'].map((topic, idx) => {
                // Let's mock counts out of 6
                return (
                  <div key={topic} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
                      <span>{topic} Sheet</span>
                      <span>Mastery Level</span>
                    </div>
                    {/* Progress slider bar */}
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${dsaRadarData[idx]?.A || 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            <Link
              to="/dsa"
              className="mt-6 w-full py-3 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 hover:bg-slate-100/50 dark:hover:bg-slate-900/35 text-center text-xs font-bold text-slate-500 dark:text-slate-400 block transition-all"
            >
              Open Topic Sheets & Mark Problems →
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Dashboard;
