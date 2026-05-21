import React from 'react';
import { BrainCircuit, Github, Linkedin, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-950/40 backdrop-blur-md transition-all py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-tr from-sky-400 to-violet-600 text-white">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <span className="font-outfit font-bold text-lg tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                PrepAI
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              AI-driven preparation platform for standard technical interviews and DSA sheets.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-sky-500 transition-colors">Home</Link>
            <Link to="/#features" className="hover:text-sky-500 transition-colors">Features</Link>
            <Link to="/#testimonials" className="hover:text-sky-500 transition-colors">Reviews</Link>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-sky-500 transition-colors">GitHub</a>
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-4">
            <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700/50 hover:text-sky-500 text-slate-600 dark:text-slate-400 transition-all">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700/50 hover:text-sky-500 text-slate-600 dark:text-slate-400 transition-all">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700/50 hover:text-sky-500 text-slate-600 dark:text-slate-400 transition-all">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50 text-center text-xs text-slate-400 dark:text-slate-500">
          &copy; {new Date().getFullYear()} PrepAI. All rights reserved. Built with passion for developers.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
