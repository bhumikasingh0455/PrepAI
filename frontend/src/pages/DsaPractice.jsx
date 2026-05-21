import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { CheckSquare, Square, ExternalLink, HelpCircle, BookOpen, Brain, Star } from 'lucide-react';
import GlassCard from '../components/GlassCard';

// Standard 30 Curriculum Coding Questions
const DSA_CURRICULUM = {
  'Arrays': [
    { id: 'two-sum', name: 'Two Sum', difficulty: 'Easy', link: 'https://leetcode.com/problems/two-sum/' },
    { id: 'buy-sell-stock', name: 'Best Time to Buy and Sell Stock', difficulty: 'Easy', link: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    { id: 'majority-element', name: 'Majority Element', difficulty: 'Easy', link: 'https://leetcode.com/problems/majority-element/' },
    { id: 'container-water', name: 'Container With Most Water', difficulty: 'Medium', link: 'https://leetcode.com/problems/container-with-most-water/' },
    { id: 'three-sum', name: '3Sum', difficulty: 'Medium', link: 'https://leetcode.com/problems/3sum/' },
    { id: 'merge-intervals', name: 'Merge Intervals', difficulty: 'Medium', link: 'https://leetcode.com/problems/merge-intervals/' },
  ],
  'Strings': [
    { id: 'valid-palindrome', name: 'Valid Palindrome', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-palindrome/' },
    { id: 'valid-anagram', name: 'Valid Anagram', difficulty: 'Easy', link: 'https://leetcode.com/problems/valid-anagram/' },
    { id: 'longest-substring', name: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
    { id: 'longest-palindromic-sub', name: 'Longest Palindromic Substring', difficulty: 'Medium', link: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    { id: 'group-anagrams', name: 'Group Anagrams', difficulty: 'Medium', link: 'https://leetcode.com/problems/group-anagrams/' },
    { id: 'atoi', name: 'String to Integer (atoi)', difficulty: 'Medium', link: 'https://leetcode.com/problems/string-to-integer-atoi/' },
  ],
  'Linked List': [
    { id: 'reverse-linked-list', name: 'Reverse Linked List', difficulty: 'Easy', link: 'https://leetcode.com/problems/reverse-linked-list/' },
    { id: 'merge-two-lists', name: 'Merge Two Sorted Lists', difficulty: 'Easy', link: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    { id: 'linked-list-cycle', name: 'Linked List Cycle', difficulty: 'Easy', link: 'https://leetcode.com/problems/linked-list-cycle/' },
    { id: 'remove-nth-end', name: 'Remove Nth Node From End of List', difficulty: 'Medium', link: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
    { id: 'add-two-numbers', name: 'Add Two Numbers', difficulty: 'Medium', link: 'https://leetcode.com/problems/add-two-numbers/' },
    { id: 'copy-list-random', name: 'Copy List with Random Pointer', difficulty: 'Medium', link: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
  ],
  'Trees': [
    { id: 'invert-binary-tree', name: 'Invert Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/invert-binary-tree/' },
    { id: 'max-depth-tree', name: 'Maximum Depth of Binary Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    { id: 'same-tree', name: 'Same Tree', difficulty: 'Easy', link: 'https://leetcode.com/problems/same-tree/' },
    { id: 'level-order-traversal', name: 'Binary Tree Level Order Traversal', difficulty: 'Medium', link: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
    { id: 'validate-bst', name: 'Validate Binary Search Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    { id: 'lowest-common-ancestor', name: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
  ],
  'Graphs': [
    { id: 'flood-fill', name: 'Flood Fill', difficulty: 'Easy', link: 'https://leetcode.com/problems/flood-fill/' },
    { id: 'clone-graph', name: 'Clone Graph', difficulty: 'Medium', link: 'https://leetcode.com/problems/clone-graph/' },
    { id: 'number-of-islands', name: 'Number of Islands', difficulty: 'Medium', link: 'https://leetcode.com/problems/number-of-islands/' },
    { id: 'course-schedule', name: 'Course Schedule', difficulty: 'Medium', link: 'https://leetcode.com/problems/course-schedule/' },
    { id: 'pacific-atlantic-flow', name: 'Pacific Atlantic Water Flow', difficulty: 'Medium', link: 'https://leetcode.com/problems/pacific-atlantic-water-flow/' },
    { id: 'word-ladder', name: 'Word Ladder', difficulty: 'Hard', link: 'https://leetcode.com/problems/word-ladder/' },
  ]
};

const DsaPractice = () => {
  const [completedList, setCompletedList] = useState([]);
  const [activeTopic, setActiveTopic] = useState('Arrays');
  const [loading, setLoading] = useState(true);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get('/dsa/progress');
      if (response.data.success) {
        setCompletedList(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
      toast.error('Failed to load progress logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleToggle = async (topic, problemId) => {
    try {
      // Optimistic Update
      const isCompleted = completedList.some(item => item.problemId === problemId && item.topic === topic);
      if (isCompleted) {
        setCompletedList(prev => prev.filter(item => !(item.problemId === problemId && item.topic === topic)));
      } else {
        setCompletedList(prev => [...prev, { topic, problemId }]);
      }

      const response = await api.post('/dsa/toggle', { topic, problemId });
      if (response.data.success) {
        setCompletedList(response.data.data);
      } else {
        toast.error('Failed to toggle status');
        fetchProgress(); // Rollback
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error updating problem progress');
      fetchProgress(); // Rollback
    }
  };

  // Helper calculation
  const getCompletedCountByTopic = (topic) => {
    return completedList.filter(item => item.topic === topic).length;
  };

  const getPercentageByTopic = (topic) => {
    const count = getCompletedCountByTopic(topic);
    const total = DSA_CURRICULUM[topic].length;
    return Math.round((count / total) * 100);
  };

  const totalCompleted = completedList.length;
  const overallPercentage = Math.round((totalCompleted / 30) * 100);

  if (loading && completedList.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center">
        <div className="w-12 h-12 border-4 border-violet-200 dark:border-slate-800 rounded-full animate-spin border-t-violet-500"></div>
        <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium">Loading curriculum checklists...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-outfit text-3xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
          DSA Practice Sheet
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Solve classic, high-yield DSA interview questions and check off completed items to track structural progress.
        </p>
      </div>

      {/* Progress Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {/* Overall progress gauge */}
        <GlassCard hoverEffect={false} className="md:col-span-1 flex flex-col justify-center items-center p-6 text-center">
          <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">Overall Mastery</h3>
          <div className="relative flex items-center justify-center mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="rgba(100,116,139,0.1)"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                stroke="url(#dsaProgressGradient)"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={326.56}
                strokeDashoffset={326.56 - (326.56 * overallPercentage) / 100}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="dsaProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#0ea5e9" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{overallPercentage}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Done</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">
            {totalCompleted} of 30 core algorithmic interview questions completed.
          </p>
        </GlassCard>

        {/* Topic-wise sub progress bars */}
        <GlassCard hoverEffect={false} className="md:col-span-2 space-y-4">
          <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Topic-wise Mastery</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(DSA_CURRICULUM).map((topic) => {
              const pct = getPercentageByTopic(topic);
              return (
                <button
                  key={topic}
                  onClick={() => setActiveTopic(topic)}
                  className={`text-left p-4 rounded-2xl border transition-all ${
                    activeTopic === topic
                      ? 'bg-sky-500/10 border-sky-500/35 text-sky-600 dark:text-sky-400'
                      : 'bg-white/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-900/20 text-slate-800 dark:text-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-center text-sm font-bold mb-2">
                    <span>{topic}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2">
                    <span>Target: 6 Questions</span>
                    <span>Completed: {getCompletedCountByTopic(topic)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* Main Checklist details split layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar Selector (Tablet/Desktop only) */}
        <div className="hidden lg:flex flex-col space-y-2 lg:col-span-1">
          {Object.keys(DSA_CURRICULUM).map((topic) => (
            <button
              key={topic}
              onClick={() => setActiveTopic(topic)}
              className={`text-left px-5 py-3.5 rounded-2xl text-sm font-bold border transition-all ${
                activeTopic === topic
                  ? 'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400'
                  : 'bg-white/50 dark:bg-slate-900/30 border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-900/20 text-slate-650 dark:text-slate-350'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>

        {/* Problem List */}
        <GlassCard hoverEffect={false} className="lg:col-span-3">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
            <h3 className="font-outfit text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-sky-500" />
              <span>{activeTopic} Checklist</span>
            </h3>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-500">
              {getPercentageByTopic(activeTopic)}% Complete
            </span>
          </div>

          <div className="space-y-3.5">
            {DSA_CURRICULUM[activeTopic].map((problem) => {
              const isChecked = completedList.some(item => item.problemId === problem.id && item.topic === activeTopic);
              return (
                <div
                  key={problem.id}
                  className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                    isChecked
                      ? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/0 text-slate-500'
                      : 'border-slate-150 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/10 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <button
                      onClick={() => handleToggle(activeTopic, problem.id)}
                      className="text-slate-400 hover:text-sky-500 transition-colors flex-shrink-0"
                    >
                      {isChecked ? (
                        <CheckSquare className="w-6 h-6 text-emerald-500 fill-emerald-500/10" />
                      ) : (
                        <Square className="w-6 h-6" />
                      )}
                    </button>
                    
                    <div className="min-w-0">
                      <h4 className={`text-base font-bold truncate ${isChecked ? 'line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                        {problem.name}
                      </h4>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 ${
                        problem.difficulty === 'Easy'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : problem.difficulty === 'Medium'
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {problem.difficulty}
                      </span>
                    </div>
                  </div>

                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-300 hover:bg-sky-50/50 dark:hover:bg-sky-950/20 text-slate-400 hover:text-sky-500 transition-all flex-shrink-0"
                    title="Solve on LeetCode"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default DsaPractice;
