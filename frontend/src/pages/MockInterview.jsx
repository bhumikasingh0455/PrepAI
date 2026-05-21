import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { Mic, MicOff, Play, Pause, RotateCcw, AlertTriangle, ArrowRight, CheckCircle, RefreshCw, Star, Sparkles, Trophy, Brain } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const MockInterview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Route State variables
  const stateData = location.state || {};
  const [sessionSetup, setSessionSetup] = useState(!stateData.customQuestions);
  
  // Selection States (if starting directly on page)
  const [role, setRole] = useState(stateData.role || 'Frontend');
  const [difficulty, setDifficulty] = useState(stateData.difficulty || 'Medium');
  const [experienceLevel, setExperienceLevel] = useState(stateData.experienceLevel || 'Entry Level');

  // Interview Questions States
  const [questions, setQuestions] = useState(stateData.customQuestions || []);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  
  // Interview Timer States
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef(null);

  // Speech Recognition States
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Submission States
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Update active answer text
        setAnswers((prev) => {
          const updated = [...prev];
          const currentText = updated[currentIdx] || '';
          // Append final transcript segment
          updated[currentIdx] = currentText + (currentText ? ' ' : '') + finalTranscript;
          return updated;
        });
      };

      rec.onerror = (e) => {
        console.error('Speech recognition error:', e.error);
        if (e.error === 'not-allowed') {
          toast.error('Microphone permission blocked. Please check browser settings.');
          setIsRecording(false);
        }
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = rec;
    }
  }, [currentIdx]);

  // Set up timer countdown
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
      toast.error("Time's up for this question!");
      handleNextQuestion();
    }

    return () => clearInterval(timerRef.current);
  }, [timerActive, timeLeft]);

  // Initialize answers list when questions load
  useEffect(() => {
    if (questions.length > 0) {
      setAnswers(new Array(questions.length).fill(''));
      setTimeLeft(120);
      setTimerActive(true);
    }
  }, [questions]);

  // Generate Questions (if page visited directly)
  const handleStartSetup = async (e) => {
    e.preventDefault();
    try {
      setEvaluating(true);
      const response = await api.post('/questions/generate', {
        role,
        difficulty,
        experienceLevel,
        count: 4,
      });

      if (response.data.success) {
        setQuestions(response.data.data);
        setSessionSetup(false);
      } else {
        toast.error('Failed to generate mock interview questions');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error setting up interview questions');
    } finally {
      setEvaluating(false);
    }
  };

  // Timer controls
  const toggleTimer = () => setTimerActive(!timerActive);
  const resetTimer = () => setTimeLeft(120);

  // Recorder controls
  const startRecording = () => {
    if (!recognitionRef.current) {
      toast.error('Web Speech API is not supported in this browser. Please type your answer.');
      return;
    }
    try {
      setIsRecording(true);
      recognitionRef.current.start();
      setTimerActive(true);
      toast.success('Listening... Speak your answer now.');
    } catch (e) {
      console.error(e);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped.');
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIdx] = text;
      return updated;
    });
  };

  const handleNextQuestion = () => {
    if (isRecording) stopRecording();
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      resetTimer();
      setTimerActive(true);
    }
  };

  const handlePrevQuestion = () => {
    if (isRecording) stopRecording();
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      resetTimer();
      setTimerActive(true);
    }
  };

  // Submit interview responses
  const handleSubmitInterview = async () => {
    if (isRecording) stopRecording();
    
    // Structure questions/answers payloads
    const payloadQuestions = questions.map((q, idx) => ({
      questionText: q,
      userAnswer: answers[idx] || '',
    }));

    // Verify at least some answers are present
    const emptyAnswersCount = payloadQuestions.filter(q => q.userAnswer.trim() === '').length;
    if (emptyAnswersCount === questions.length) {
      toast.error('Please record or type an answer to at least one question before submitting.');
      return;
    }

    try {
      setEvaluating(true);
      const response = await api.post('/interviews/submit', {
        role,
        difficulty,
        experienceLevel,
        questions: payloadQuestions,
      });

      if (response.data.success) {
        toast.success('Interview evaluation complete!');
        setEvaluationResult(response.data.data);
      } else {
        toast.error('Evaluation processing failed.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Server error evaluating interview responses');
    } finally {
      setEvaluating(false);
    }
  };

  // Render Setup selection screen
  if (sessionSetup) {
    return (
      <div className="max-w-md mx-auto py-12">
        <GlassCard hoverEffect={false} className="shadow-lg">
          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-tr from-sky-400 to-violet-600 text-white shadow-md">
              <Mic className="w-8 h-8" />
            </div>
            <h2 className="font-outfit text-2xl font-bold">Configure Mock Interview</h2>
            <p className="text-sm text-slate-500">Pick your parameters to generate voice-based questions</p>
          </div>

          <form onSubmit={handleStartSetup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
              >
                <option value="Frontend">Frontend Dev</option>
                <option value="Backend">Backend Dev</option>
                <option value="Full Stack">Full Stack Dev</option>
                <option value="React">React Developer</option>
                <option value="Java">Java Developer</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm focus:outline-none"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <button type="submit" className="w-full py-3.5 rounded-xl font-bold gradient-btn flex items-center justify-center space-x-1.5 pt-4">
              <span>Generate & Start Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </GlassCard>
      </div>
    );
  }

  // Render Loader overlay
  if (evaluating) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-violet-100 dark:border-slate-800 rounded-full animate-spin border-t-violet-600"></div>
          <Sparkles className="w-6 h-6 text-sky-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h3 className="font-outfit text-2xl font-bold text-slate-800 dark:text-slate-100">Analyzing Responses</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
            AI is scoring technical correctness, fluency patterns, and generating structural communication recommendations...
          </p>
        </div>
      </div>
    );
  }

  // Render AI Evaluation Results Page (once completed)
  if (evaluationResult) {
    const radarData = evaluationResult.questions.map((q, idx) => ({
      subject: `Q${idx + 1}`,
      Score: q.score,
      fullMark: 100,
    }));

    return (
      <div className="space-y-8 pb-12 max-w-4xl mx-auto">
        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-to-tr from-sky-950 via-slate-900 to-violet-950 border border-slate-800 p-8 text-white text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-sky-500/10 blur-[80px]" />
          <div className="relative z-10 space-y-4">
            <Trophy className="w-16 h-16 mx-auto text-amber-400 animate-bounce" />
            <h2 className="font-outfit text-3xl md:text-4xl font-extrabold tracking-tight">Interview Evaluation Complete</h2>
            <p className="text-sm text-slate-300 max-w-md mx-auto">
              Your overall capability rating based on OpenAI GPT evaluation templates.
            </p>
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-2xl text-2xl font-black text-sky-300">
              <span>Overall Score:</span>
              <span className="text-white">{evaluationResult.overallScore}%</span>
            </div>
          </div>
        </motion.div>

        {/* Detailed Feedback Panel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Radar Chart */}
          <GlassCard hoverEffect={false} className="md:col-span-1 flex flex-col justify-center items-center min-h-[300px]">
            <h4 className="font-outfit font-bold text-slate-800 dark:text-slate-100 text-center mb-4">Question Score Grid</h4>
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart cx="50%" cy="50%" radius="70%" data={radarData}>
                <PolarGrid stroke="rgba(100,116,139,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Radar name="Question Score" dataKey="Score" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
              </RadarChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-2 text-xs text-slate-400">
              {evaluationResult.questions.map((_, i) => (
                <span key={i}>Q{i + 1}: {evaluationResult.questions[i].score}%</span>
              ))}
            </div>
          </GlassCard>

          {/* Feedback Bullet Lists */}
          <GlassCard hoverEffect={false} className="md:col-span-2 space-y-4">
            <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">AI Evaluation Feedback</h3>
            
            <div className="space-y-4 text-sm leading-relaxed">
              <div>
                <h4 className="font-bold text-violet-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Communication Review
                </h4>
                <p className="text-slate-600 dark:text-slate-350 mt-1">{evaluationResult.commFeedback}</p>
              </div>

              <div>
                <h4 className="font-bold text-sky-500 flex items-center gap-1.5">
                  <Brain className="w-4 h-4" />
                  Technical Assessment
                </h4>
                <p className="text-slate-600 dark:text-slate-350 mt-1">{evaluationResult.techFeedback}</p>
              </div>

              <div>
                <h4 className="font-bold text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" />
                  Improvement Checklist
                </h4>
                <p className="text-slate-600 dark:text-slate-350 mt-1">{evaluationResult.suggestions}</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Answer Breakdown Details */}
        <div className="space-y-4">
          <h3 className="font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">Answer-by-Answer Analysis</h3>
          {evaluationResult.questions.map((q, idx) => (
            <GlassCard key={idx} hoverEffect={false} className="space-y-3.5">
              <div className="flex justify-between items-start gap-4">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  Question {idx + 1}
                </span>
                <span className="text-sm font-extrabold text-sky-500">{q.score}% Score</span>
              </div>
              
              <p className="text-base font-bold text-slate-700 dark:text-slate-200">
                {q.questionText}
              </p>

              <div className="p-3.5 rounded-xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Your Answer</p>
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap italic">
                  {q.userAnswer ? `"${q.userAnswer}"` : '(No response recorded)'}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-violet-50/20 dark:bg-violet-950/5 border border-violet-100/10">
                <p className="text-xs font-bold text-violet-400 uppercase tracking-wider mb-1">AI Evaluator Comments</p>
                <p className="text-sm text-slate-650 dark:text-slate-400">
                  {q.feedback}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 pt-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all text-sm"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              setEvaluationResult(null);
              setSessionSetup(true);
              setQuestions([]);
            }}
            className="px-6 py-3 rounded-xl font-bold text-sm gradient-btn"
          >
            Start Another Session
          </button>
        </div>
      </div>
    );
  }

  // Active Interview panel
  const currentQuestionText = questions[currentIdx];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Status Bar */}
      <div className="flex justify-between items-center bg-slate-100/60 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/50 p-4 rounded-2xl">
        <div className="space-y-0.5">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Session</p>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {role} • Question {currentIdx + 1} of {questions.length}
          </h4>
        </div>

        {/* Timer Box */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 font-mono text-sm font-bold">
            <span>{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}</span>
          </div>
          
          <button
            onClick={toggleTimer}
            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-350"
            title={timerActive ? 'Pause Timer' : 'Resume Timer'}
          >
            {timerActive ? <Pause className="w-4.5 h-4.5" /> : <Play className="w-4.5 h-4.5 fill-current" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-350"
            title="Reset Timer"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Main Question Display */}
      <GlassCard hoverEffect={false} className="p-8 space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-500">
            Current Question
          </span>
          <h2 className="font-outfit text-xl sm:text-2xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 pt-2">
            {currentQuestionText}
          </h2>
        </div>

        {/* Speech / Recording Controller */}
        <div className="flex flex-col items-center justify-center py-6 border-y border-slate-200/50 dark:border-slate-800/50 gap-4">
          <div className={`flex items-center justify-center space-x-1 h-8 ${isRecording ? 'recording' : ''}`}>
            <span className="wave-bar" />
            <span className="wave-bar" />
            <span className="wave-bar" />
            <span className="wave-bar" />
          </div>

          <div className="flex items-center space-x-4">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="px-6 py-3.5 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold shadow-lg transition-colors flex items-center space-x-2 animate-pulse"
              >
                <MicOff className="w-5 h-5" />
                <span>Stop Recording</span>
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="px-6 py-3.5 rounded-full bg-violet-500 hover:bg-violet-600 text-white font-bold shadow-lg transition-colors flex items-center space-x-2"
              >
                <Mic className="w-5 h-5" />
                <span>Record Answer (Voice)</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 text-center max-w-xs leading-relaxed">
            For best results, speak clearly into your mic. You can also manually edit or type your response in the box below.
          </p>
        </div>

        {/* Answer input field (Manual fallback) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Your Response Transcript
          </label>
          <textarea
            value={answers[currentIdx] || ''}
            onChange={handleTextChange}
            placeholder="Type your response or begin speaking above to populate your answer transcripts..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-sky-500 dark:focus:border-violet-500 focus:outline-none text-sm transition-all text-slate-800 dark:text-slate-100 leading-relaxed font-sans"
          />
        </div>

        {/* Bottom controls */}
        <div className="flex justify-between items-center pt-2">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIdx === 0}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/30 text-slate-500 dark:text-slate-450 transition-colors text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous Question
          </button>

          {currentIdx === questions.length - 1 ? (
            <button
              onClick={handleSubmitInterview}
              className="px-6 py-2.5 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-md transition-colors text-sm flex items-center space-x-1.5"
            >
              <span>Submit Session</span>
              <CheckCircle className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2.5 rounded-xl font-bold gradient-btn text-sm flex items-center space-x-1.5"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </GlassCard>
      
      {/* Notice info */}
      <div className="flex items-start space-x-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p className="text-xs leading-relaxed font-medium">
          Do not close or reload the browser. Doing so will reset your active session. Make sure to complete and submit answers for proper AI tracking.
        </p>
      </div>
    </div>
  );
};

export default MockInterview;
