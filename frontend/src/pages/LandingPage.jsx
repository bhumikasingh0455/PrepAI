import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, ShieldCheck, BarChart3, Mic, Terminal, ChevronRight, Star } from 'lucide-react';
import GlassCard from '../components/GlassCard';

const LandingPage = () => {
  // Canvas Particles synchronized with mouse
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (canvas) {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
      }
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 65;
    const mouse = { x: null, y: null, radius: 180 };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        size: Math.random() * 2 + 1,
        color: i % 2 === 0 ? 'rgba(14, 165, 233, 0.45)' : 'rgba(139, 92, 246, 0.45)', // sky-500 or violet-500
      });
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw and update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interaction with mouse (100% sync)
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            // Draw line from particle to mouse in 100% sync
            const opacity = (1 - dist / mouse.radius) * 0.35;
            ctx.strokeStyle = p.color.replace('0.45', opacity.toString());
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Pull particle slightly
            const force = (mouse.radius - dist) / mouse.radius;
            p.x += (dx / dist) * force * 1.5;
            p.y += (dy / dist) * force * 1.5;
          }
        }

        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect particles to each other
        for (let j = 0; j < particles.length; j++) {
          const p2 = particles[j];
          if (p === p2) continue;
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const opacity = (1 - dist / 100) * 0.12;
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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
      }, 55);
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
      }, 55);
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 15 }
    }
  };

  const features = [
    {
      icon: Cpu,
      title: 'AI Question Generator',
      desc: 'Get highly tailored technical interview questions based on role, stack, and difficulty level.'
    },
    {
      icon: Mic,
      title: 'Speech-to-Text Answers',
      desc: 'Answer questions naturally using Web Speech recognition. Practice oral clarity.'
    },
    {
      icon: ShieldCheck,
      title: 'ATS Resume Reviewer',
      desc: 'Upload your PDF resume to receive ATS scores, skill extractions, and actionable optimization feedback.'
    },
    {
      icon: BarChart3,
      title: 'Granular AI Evaluation',
      desc: 'Get precise scores, communication review, technical feedback, and suggestions for improvement.'
    },
    {
      icon: Terminal,
      title: 'DSA Practice Sheets',
      desc: 'Track Arrays, Strings, Linked Lists, Trees, and Graphs completion percentages in real-time.'
    },
    {
      icon: BrainCircuit,
      title: 'AI Chatbot Assistant',
      desc: 'Interact with an intelligent, conversational agent to clarify computer science concepts on the fly.'
    }
  ];

  const testimonials = [
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
  ];

  return (
    <div className="relative overflow-hidden w-full py-12 md:py-20 flex flex-col space-y-24">
      {/* Interactive Background Particle Canvas (100% sync with mouse) */}
      <div className="absolute inset-0 pointer-events-none -z-20 overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Decorative Blur Spheres */}
      <div className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-sky-500/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full bg-violet-500/10 blur-[150px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-2xl">
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 text-xs font-semibold"
          >
            <span>✨ Powered by OpenAI GPT-4o-Mini</span>
          </motion.div>
          
          <motion.h1 
            variants={itemVariants}
            className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1]"
          >
            Nail Your Tech Interviews with <span className="gradient-text">PrepAI</span>
          </motion.h1>

          <motion.p 
            variants={itemVariants}
            className="text-base sm:text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed"
          >
            The ultimate AI-powered preparation platform. Generate tailor-made questions, record speech-to-text answers, analyze your resume for ATS optimization, and master DSA tracking in one single premium platform.
          </motion.p>

          <motion.div 
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
          >
            <Link to="/signup" className="px-6 py-3.5 rounded-xl font-semibold flex items-center space-x-2 gradient-btn group">
              <span>Start Free Trial</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="px-6 py-3.5 rounded-xl font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all">
              Try Demo Interview
            </Link>
          </motion.div>
        </div>

        {/* Hero Interactive App Graphic */}
        <motion.div 
          variants={itemVariants}
          className="flex-1 w-full max-w-lg lg:max-w-none relative flex justify-center"
        >
          <div 
            onMouseMove={handleTerminalMouseMove}
            onMouseLeave={handleTerminalMouseLeave}
            style={{
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
              transformStyle: 'preserve-3d',
              transition: 'transform 0.1s ease-out',
            }}
            className="relative w-full max-w-md p-1.5 rounded-3xl bg-gradient-to-tr from-sky-400 via-indigo-500 to-violet-600 shadow-2xl transition-shadow duration-300 hover:shadow-sky-500/20"
          >
            <div 
              style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
              className="bg-slate-900 rounded-[22px] overflow-hidden p-6 space-y-4 text-slate-100 text-left font-mono text-sm leading-relaxed border border-white/10"
            >
              <div className="flex items-center space-x-1.5 pb-2 border-b border-slate-800">
                <span className="w-3 h-3 rounded-full bg-rose-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500 pl-2">ai-evaluation-terminal.sh</span>
              </div>
              <div className="min-h-[72px]">
                <span className="text-sky-400">$</span> {cmd1Text}
                {step === 1 && <span className="inline-block w-2 h-4 ml-1 bg-sky-400 animate-pulse">|</span>}
                <br />
                {step >= 2 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-emerald-400 block"
                  >
                    ✓ Extracted Skills: React, Express, MongoDB
                  </motion.span>
                )}
                {step >= 3 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-violet-400 block"
                  >
                    ★ ATS Score computed: 88%
                  </motion.span>
                )}
              </div>
              <div className="pt-2 min-h-[72px] border-t border-slate-800/50">
                {step >= 3 && (
                  <>
                    <span className="text-sky-400">$</span> {cmd2Text}
                    {step === 4 && <span className="inline-block w-2 h-4 ml-1 bg-sky-400 animate-pulse">|</span>}
                    <br />
                  </>
                )}
                {step >= 5 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-amber-400 block"
                  >
                    🤖 Question: What is the React Event Loop?
                  </motion.span>
                )}
                {step >= 6 && (
                  <motion.span 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="text-slate-400 block animate-pulse"
                  >
                    🎤 Recording user voice answer...
                  </motion.span>
                )}
              </div>
              <div className="pt-2 border-t border-slate-800 text-xs text-sky-300 transition-all duration-300">
                {step >= 6 ? '// Platform loading completed. Ready to deploy!' : '// Initializing terminal simulation...'}
              </div>
            </div>
            
            {/* Float Element with 3D Depth */}
            <div 
              style={{ transform: 'translateZ(45px)' }}
              className="absolute -bottom-6 -left-6 md:-left-8 glass-card dark:bg-slate-900/90 border border-slate-200/50 dark:border-slate-800 p-4 rounded-2xl shadow-xl flex items-center space-x-3 max-w-[200px] transition-transform duration-300"
            >
              <div className="p-2 rounded-lg bg-emerald-500 text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">ATS Success Rate</p>
                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">+42% Higher</p>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.section>

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
              <GlassCard key={idx} hoverEffect={true} delay={idx * 0.05}>
                <div className="p-3 rounded-xl bg-gradient-to-tr from-sky-400/20 to-violet-600/20 text-sky-600 dark:text-sky-400 w-fit">
                  <Icon className="w-6 h-6" />
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
          {testimonials.map((test, idx) => (
            <GlassCard key={idx} hoverEffect={false} className="flex flex-col justify-between h-full bg-white/70">
              <div className="space-y-4">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{test.comment}"
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-400 to-violet-500 flex items-center justify-center text-white font-bold font-outfit text-sm">
                  {test.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{test.name}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{test.role}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
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
