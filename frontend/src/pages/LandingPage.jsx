import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  BrainCircuit, Cpu, ShieldCheck, BarChart3, Mic, Terminal, 
  ChevronRight, Star, MessageSquare, CheckSquare, Award, 
  Play, Users, Zap, Sparkles, BookOpen, Check 
} from 'lucide-react';
import Particles, { ParticlesProvider } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { useTheme } from '../context/ThemeContext';
import GlassCard from '../components/GlassCard';

// Animated Counter Component
const AnimatedCounter = ({ value, target, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(target.replace(/[^0-9]/g, ''));
    if (isNaN(end)) return;
    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 20);

    const timer = setInterval(() => {
      start += Math.ceil(end / (duration / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [target, duration]);

  const isPercent = target.includes('%');
  const isPlus = target.includes('+');

  return (
    <span>
      {count.toLocaleString()}
      {isPercent && '%'}
      {isPlus && '+'}
    </span>
  );
};

const LandingPage = () => {
  const { theme } = useTheme();

  // Initialize tsParticles engine once
  const initFn = async (engine) => {
    await loadSlim(engine);
  };

  // 3D Tilt Effect for Terminal
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const handleTerminalMouseMove = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;

    const rX = -(mouseY / height) * 15;
    const rY = (mouseX / width) * 15;

    setRotate({ x: rX, y: rY });
  };

  const handleTerminalMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Typing simulator for Terminal
  const [step, setStep] = useState(0);
  const [cmd1Text, setCmd1Text] = useState('');
  const [cmd2Text, setCmd2Text] = useState('');

  const cmd1Full = 'run analyze-resume --file resume.pdf';
  const cmd2Full = 'start mock-interview --role "Frontend"';

  useEffect(() => {
    let timer;

    if (step === 0) {
      setCmd1Text('');
      setCmd2Text('');
      setStep(1);
    } else if (step === 1) {
      let charIndex = 0;
      const interval = setInterval(() => {
        setCmd1Text(cmd1Full.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= cmd1Full.length) {
          clearInterval(interval);
          setStep(2);
        }
      }, 50);
      return () => clearInterval(interval);
    } else if (step === 2) {
      timer = setTimeout(() => setStep(3), 600);
    } else if (step === 3) {
      timer = setTimeout(() => setStep(4), 600);
    } else if (step === 4) {
      let charIndex = 0;
      const interval = setInterval(() => {
        setCmd2Text(cmd2Full.slice(0, charIndex + 1));
        charIndex++;
        if (charIndex >= cmd2Full.length) {
          clearInterval(interval);
          setStep(5);
        }
      }, 50);
      return () => clearInterval(interval);
    } else if (step === 5) {
      timer = setTimeout(() => setStep(6), 650);
    } else if (step === 6) {
      timer = setTimeout(() => setStep(7), 800);
    } else if (step === 7) {
      timer = setTimeout(() => setStep(0), 4500);
    }

    return () => clearTimeout(timer);
  }, [step]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 90, damping: 15 }
    }
  };

  // Features list
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Mock Interviews',
      desc: 'Simulate high-fidelity video/voice technical rounds. Receive realistic follow-up questions tailored to your responses.',
      color: 'from-sky-400 to-sky-600'
    },
    {
      icon: ShieldCheck,
      title: 'ATS Resume Analyzer',
      desc: 'Check your resume scoring metrics against real recruiter benchmarks. Detect structural flaws and missing skills instantly.',
      color: 'from-violet-400 to-violet-600'
    },
    {
      icon: Mic,
      title: 'Speech-to-Text Answers',
      desc: 'Answer questions naturally using raw audio inputs. Test communication flow, pace, and vocal filler ratios.',
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      icon: Terminal,
      title: 'DSA Progress Tracker',
      desc: 'Navigate curated sheets covering algorithms and data structures. Monitor topic mastery scores continuously.',
      color: 'from-cyan-400 to-cyan-600'
    },
    {
      icon: BrainCircuit,
      title: 'AI Feedback Engine',
      desc: 'Get specialized analysis grading technical accuracy, grammar, vocabulary, confidence, and overall structure.',
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      desc: 'Track metrics history over time. Identify clear weakness sectors and measure optimization trajectories.',
      color: 'from-rose-400 to-rose-600'
    }
  ];

  // tsParticles Configuration options
  const particlesOptions = {
    fullScreen: {
      enable: true,
      zIndex: -1
    },
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      detectsOn: "window",
      events: {
        onHover: {
          enable: true,
          mode: "grab",
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: theme === 'dark' ? 0.15 : 0.22,
          },
        },
      },
    },
    particles: {
      color: {
        value: theme === 'dark' ? '#38bdf8' : '#6366f1',
      },
      links: {
        color: theme === 'dark' ? '#8b5cf6' : '#4f46e5',
        distance: 125,
        enable: true,
        opacity: theme === 'dark' ? 0.08 : 0.14,
        width: 1,
      },
      move: {
        direction: "none",
        enable: true,
        outModes: {
          default: "out",
        },
        random: true,
        speed: 0.8,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: 65,
      },
      opacity: {
        value: theme === 'dark' ? 0.25 : 0.4,
      },
      shape: {
        type: "circle",
      },
      size: {
        value: { min: 1, max: 2.2 },
      },
    },
    detectRetina: true,
  };

  return (
    <div className="relative w-full py-6 md:py-12 flex flex-col space-y-24">
      {/* tsParticles background layer */}
      <ParticlesProvider init={initFn}>
        <Particles
          id="tsparticles"
          options={particlesOptions}
          className="absolute inset-0 pointer-events-none -z-10"
        />
      </ParticlesProvider>

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row items-center justify-between gap-12 pt-4 relative"
      >
        {/* Glow Spheres */}
        <div className="absolute top-[-50px] left-[-50px] w-96 h-96 rounded-full bg-sky-500/10 blur-[100px] pointer-events-none -z-20 dark:block hidden" />
        <div className="absolute bottom-[-100px] right-[-50px] w-96 h-96 rounded-full bg-violet-500/10 blur-[120px] pointer-events-none -z-20 dark:block hidden" />

        {/* Hero Left Content */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sky-500/10 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-pulse" />
            <span>The Premium AI SaaS Interview Engine</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
          >
            Turn Preparation Into <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-indigo-500 to-violet-500 bg-[length:200%_auto] animate-pulse font-bold">Offers</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed"
          >
            Practice AI-powered mock interviews, optimize your resume for ATS, track DSA progress, and receive personalized feedback designed to help you land top tech roles.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link to="/signup" className="px-6 py-3.5 rounded-xl font-bold flex items-center space-x-2 gradient-btn group transition-all duration-300 transform hover:scale-[1.02]">
              <span>Start Free Trial</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-6 py-3.5 rounded-xl font-bold text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all flex items-center space-x-2">
              <Play className="w-4 h-4 text-violet-500 fill-current" />
              <span>Watch Demo</span>
            </button>
          </motion.div>
        </div>

        {/* Hero Right Graphic - 3D Interactive Terminal Panel */}
        <motion.div 
          variants={itemVariants}
          className="flex-1 w-full max-w-lg lg:max-w-none relative flex justify-center pt-6 lg:pt-0"
        >
          <div 
            onMouseMove={handleTerminalMouseMove}
            onMouseLeave={handleTerminalMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease-out',
            }}
            className="relative w-full max-w-md p-1 border border-slate-200/30 dark:border-slate-800/50 rounded-3xl bg-slate-100/50 dark:bg-slate-900/40 backdrop-blur-md shadow-2xl transition-shadow duration-300 hover:shadow-sky-500/10"
          >
            {/* Terminal Inner Frame */}
            <div 
              style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
              className="bg-slate-950 rounded-[22px] overflow-hidden p-6 space-y-4 text-slate-100 text-left font-mono text-sm leading-relaxed border border-white/5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/50">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[10px] text-slate-500 pl-2">prep-eval-shell.sh</span>
                </div>
                <div className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-ping" />
              </div>
              
              <div className="min-h-[72px]">
                <span className="text-sky-400">$</span> {cmd1Text}
                {step === 1 && <span className="inline-block w-1.5 h-4 ml-1 bg-sky-400 animate-pulse">|</span>}
                <br />
                {step >= 2 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-400 block text-xs"
                  >
                    ✓ Extracted Skills: React, Node.js, MongoDB
                  </motion.span>
                )}
                {step >= 3 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-violet-400 block text-xs"
                  >
                    ★ ATS Match Score: 94%
                  </motion.span>
                )}
              </div>
              
              <div className="pt-2 min-h-[72px] border-t border-slate-800/50">
                {step >= 3 && (
                  <>
                    <span className="text-sky-400">$</span> {cmd2Text}
                    {step === 4 && <span className="inline-block w-1.5 h-4 ml-1 bg-sky-400 animate-pulse">|</span>}
                    <br />
                  </>
                )}
                {step >= 5 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-amber-400 block text-xs"
                  >
                    🤖 Question: Explain React fiber architecture.
                  </motion.span>
                )}
                {step >= 6 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-slate-400 block text-xs animate-pulse"
                  >
                    🎤 Analyzing answer structures...
                  </motion.span>
                )}
              </div>
              
              <div className="pt-2 border-t border-slate-900 text-[10px] text-sky-400/80 transition-all duration-300">
                {step >= 6 ? '// Feedback engine parsed successfully.' : '// Waiting for interview parameters...'}
              </div>
            </div>
            
            {/* Float Element Left - ATS Success */}
            <div 
              style={{ transform: 'translateZ(45px)' }}
              className="absolute -bottom-6 -left-6 md:-left-8 glass-card border border-slate-200/50 dark:border-slate-800/80 p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[200px] hover:scale-105 transition-transform"
            >
              <div className="p-2 rounded-xl bg-gradient-to-tr from-sky-400 to-sky-600 text-white shadow-md">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">ATS Score Rate</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">+42% Higher</p>
              </div>
            </div>

            {/* Float Element Right - AI Score */}
            <div 
              style={{ transform: 'translateZ(35px)' }}
              className="absolute -top-6 -right-6 glass-card border border-slate-200/50 dark:border-slate-800/80 p-3.5 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[180px] hover:scale-105 transition-transform"
            >
              <div className="p-2 rounded-xl bg-gradient-to-tr from-violet-500 to-indigo-600 text-white shadow-md">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">AI Evaluation</p>
                <p className="text-base font-bold text-slate-800 dark:text-slate-100">Top Tier</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section */}
      <section className="relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { target: '10,000+', label: 'Interviews Conducted', color: 'text-sky-500' },
            { target: '95%', label: 'Success Rate', color: 'text-violet-500' },
            { target: '5,000+', label: 'Active Students', color: 'text-indigo-500' },
            { target: '4.9/5', label: 'User Satisfaction Rating', color: 'text-emerald-500' }
          ].map((stat, i) => (
            <GlassCard key={i} className="text-center p-6 border border-slate-200/55 dark:border-slate-850 bg-white/40 dark:bg-slate-900/20">
              <h3 className={`font-outfit text-3xl sm:text-4xl font-extrabold ${stat.color}`}>
                {stat.target.includes('/') ? (
                  stat.target
                ) : (
                  <AnimatedCounter value={stat.target} target={stat.target} />
                )}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-outfit text-3xl md:text-4xl font-extrabold">
            Engineered for <span className="gradient-text">Interview Mastery</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Everything you need to transform your technical preparation from unstructured cramming to a data-backed career booster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <GlassCard key={idx} hoverEffect={true} delay={idx * 0.05} className="group border border-slate-200/60 dark:border-slate-800/80 bg-white/60 dark:bg-slate-900/10">
                <div className={`p-3 rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-md w-fit group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="mt-4 font-outfit text-xl font-bold text-slate-800 dark:text-slate-100">
                  {feat.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {feat.desc}
                </p>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="space-y-16 py-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-outfit text-3xl md:text-4xl font-extrabold">
            How <span className="gradient-text">PrepAI Works</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Four simple steps designed to take you from a messy draft resume to landing your dream technical role.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            {
              step: '01',
              title: 'Upload Profile',
              desc: 'Import your resume PDF. Our ATS system scans and flags matches, structures, and keywords.',
              color: 'border-sky-500/25 dark:border-sky-400/20'
            },
            {
              step: '02',
              title: 'Configure AI Session',
              desc: 'Select your target roles, companies, and difficulty. Get custom behavioral and tech prompts.',
              color: 'border-violet-500/25 dark:border-violet-400/20'
            },
            {
              step: '03',
              title: 'Simulate Mock Round',
              desc: 'Speak your answers directly. PrepAI processes voice and transcripts in real-time.',
              color: 'border-indigo-500/25 dark:border-indigo-400/20'
            },
            {
              step: '04',
              title: 'Iterate & Upgrade',
              desc: 'Analyze score grids, review sample answers, track progress records, and improve your delivery.',
              color: 'border-emerald-500/25 dark:border-emerald-400/20'
            }
          ].map((item, idx) => (
            <div key={idx} className={`relative flex flex-col p-6 rounded-2xl border ${item.color} bg-white/40 dark:bg-slate-900/10 shadow-sm overflow-hidden`}>
              <div className="absolute top-0 right-0 font-outfit text-6xl font-black text-slate-100 dark:text-slate-900/60 pointer-events-none -z-10 select-none translate-x-4 -translate-y-2">
                {item.step}
              </div>
              <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-violet-500 text-white font-bold flex items-center justify-center text-xs shadow-sm mb-4">
                {idx + 1}
              </span>
              <h3 className="font-outfit text-lg font-bold text-slate-800 dark:text-slate-100">
                {item.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-outfit text-3xl md:text-4xl font-extrabold">
            Success Stories from <span className="gradient-text">Real Students</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Hundreds of software development students and professionals have landed roles using PrepAI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Rohan Sharma',
              role: 'Frontend Engineer @ Google',
              comment: 'The speech recognition is highly accurate. Talking aloud while answering technical questions boosted my confidence before the final rounds.',
              rating: 5
            },
            {
              name: 'Aishwarya Patel',
              role: 'Full Stack Dev @ Cred',
              comment: 'The resume ATS analyzer gave me concrete pointers. I updated my key experience sections and got shortlists within 2 weeks!',
              rating: 5
            },
            {
              name: 'Michael Chen',
              role: 'Java Developer @ Amazon',
              comment: 'Saved questions and the DSA sheets are extremely handy. I could trace my progress and focus on weaker topics like Graphs and Trees.',
              rating: 5
            }
          ].map((test, idx) => (
            <GlassCard key={idx} hoverEffect={false} className="flex flex-col justify-between h-full bg-white/70 dark:bg-slate-900/10 border border-slate-200/50 dark:border-slate-800/50">
              <div className="space-y-4">
                <div className="flex items-center space-x-0.5 text-amber-450">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{test.comment}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold font-outfit text-xs">
                  {test.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{test.name}</h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{test.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="space-y-12 py-8">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="font-outfit text-3xl md:text-4xl font-extrabold">
            Simple, Transparent <span className="gradient-text">Pricing</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Start preparing for free and upgrade as you scale up your job applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <GlassCard className="p-8 border border-slate-250 dark:border-slate-800 flex flex-col justify-between bg-white/70 dark:bg-slate-900/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Free Tier</span>
              <h3 className="font-outfit text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
                $0 <span className="text-sm font-normal text-slate-500">/ forever</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Perfect for software development students getting started with basic concepts.
              </p>
              
              <ul className="mt-6 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                {[
                  '3 AI-generated question sets per day',
                  'Basic ATS Resume reviews (2 uploads/mo)',
                  'Web Speech transcription practice',
                  'Standard DSA checklist tracking',
                  'Community feedback logs'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link to="/signup" className="w-full text-center py-3 rounded-xl font-bold mt-8 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all border border-slate-200/50 dark:border-slate-700">
              Get Started Free
            </Link>
          </GlassCard>

          {/* Premium Tier */}
          <GlassCard className="p-8 border-2 border-sky-500 relative flex flex-col justify-between bg-white/90 dark:bg-slate-900/20 shadow-sky-500/5">
            <div className="absolute top-0 right-6 -translate-y-1/2 px-3 py-1 rounded-full text-[10px] font-bold bg-sky-500 text-white tracking-wide uppercase">
              Most Popular
            </div>
            
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-500">Premium Pro</span>
              <h3 className="font-outfit text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-2">
                $19 <span className="text-sm font-normal text-slate-500">/ month</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Accelerate your career search with infinite mock evaluations and detailed insights.
              </p>
              
              <ul className="mt-6 space-y-3.5 text-xs text-slate-600 dark:text-slate-300">
                {[
                  'Infinite AI-generated question sessions',
                  'Unlimited ATS Resume scanning and recommendations',
                  'Full audio transcriptions + filler word reports',
                  'Curated DSA Sheets covering 300+ problems',
                  'Detailed GPT-4o-Mini feedback & suggestions',
                  'Compare performance stats with top placement metrics'
                ].map((item, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <Link to="/signup" className="w-full text-center py-3 rounded-xl font-bold mt-8 gradient-btn transition-all shadow-md transform hover:scale-[1.02]">
              Start Free Trial
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="w-full rounded-3xl bg-gradient-to-tr from-sky-950 via-slate-900 to-violet-950 border border-slate-800/60 p-8 md:p-12 text-center text-white relative overflow-hidden"
      >
        {/* Glow Element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-violet-600/20 blur-[80px]" />
        
        <div className="relative space-y-6 max-w-2xl mx-auto">
          <h2 className="font-outfit text-3xl md:text-5xl font-extrabold tracking-tight">
            Ready to Accelerate Your Prep?
          </h2>
          <p className="text-sm md:text-base text-slate-300 max-w-md mx-auto leading-relaxed">
            Create an account in minutes and get access to custom mock interviews, live voice evaluation, and ATS feedback.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link to="/signup" className="px-8 py-3.5 rounded-xl font-bold bg-white text-slate-950 hover:bg-slate-100 transition-colors shadow-lg">
              Get Started for Free
            </Link>
            <Link to="/login" className="px-8 py-3.5 rounded-xl font-bold text-white border border-slate-700 hover:bg-white/5 transition-all">
              Login to Account
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
