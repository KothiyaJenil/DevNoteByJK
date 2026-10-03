import React from 'react';
import { useApp } from '../../context/AppContext';
import { HeroDiagram } from './HeroDiagram';
import {
  Layers,
  FileCode,
  GitFork,
  Search,
  Star,
  Sparkles,
  ArrowRight,
  Code2,
  CheckCircle2,
  Repeat,
  Brain,
  Terminal,
  ShieldCheck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, user } = useApp();

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#090d16]/90 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold font-mono tracking-tight text-white">DevNotes</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
            <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#notes-flow" className="hover:text-emerald-400 transition-colors">Notes Flow</a>
            <a href="#about" className="hover:text-emerald-400 transition-colors">About</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {user ? (
              <button
                onClick={() => navigate('dashboard')}
                className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all"
              >
                <span>Go to Workspace</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('login')}
                  className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('signup')}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-sm font-semibold shadow-lg shadow-emerald-500/20 transition-all"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold font-mono">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Developer Knowledge Base & Connected Flows</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Your developer knowledge, <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">connected.</span>
          </h1>

          <p className="text-lg text-slate-400 leading-relaxed">
            Save technical notes, code snippets, and architectural concepts. Then connect your notes into complete, logical coding sequences.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => navigate('signup')}
              className="flex items-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-3.5 text-base font-bold shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => navigate('dashboard')}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-800 text-slate-200 px-6 py-3.5 text-base font-semibold transition-all"
            >
              <Terminal className="h-5 w-5 text-cyan-400" />
              <span>Explore DevNotes App</span>
            </button>
          </div>
        </div>

        {/* Live Hero Visualization */}
        <div className="mt-8">
          <HeroDiagram />
        </div>
      </section>

      {/* Primary Tagline Banner */}
      <section className="border-y border-slate-800/80 bg-slate-950/60 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
            "Understand. Connect. Remember."
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Build your personal developer knowledge base — one note at a time.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Built Specifically for Software Engineers
          </h2>
          <p className="text-slate-400">
            No mandatory rigid dropdowns. Write technical knowledge the way your mind naturally organizes code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileCode className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Flexible Developer Notes</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Create notes containing any number of dynamic sections, headings, bullet points, and syntax-highlighted code snippets.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <GitFork className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Notes Flow Concept</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Connect existing Notes into logical sequences like HTTP Request Pipelines, Auth Flows, or Microservice architectures.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Repeat className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Reusable Knowledge</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              A single Note (e.g. Express Middleware) can belong to multiple Notes Flows without content duplication.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Code2 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Syntax Highlighted Snippets</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Store multi-language code snippets directly inside Note sections with one-click copy functionality.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Command Palette (Ctrl + K)</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Search instantly across notes, bullet points, tags, and code blocks using a fast developer command palette.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4 hover:border-slate-700 transition-colors">
            <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Personal Knowledge Base</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Build a structured, long-term personal knowledge repository that grows alongside your developer career.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-slate-950/40 border-t border-slate-800/80">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-white">How DevNotes Works</h2>
            <p className="text-slate-400">Three simple steps to mastery</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
              <span className="text-4xl font-extrabold text-emerald-400 font-mono">01</span>
              <h3 className="text-lg font-bold text-white">Create Independent Notes</h3>
              <p className="text-sm text-slate-400">
                Write technical notes with points, explanations, and syntax code snippets without mandatory tech dropdown constraints.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
              <span className="text-4xl font-extrabold text-cyan-400 font-mono">02</span>
              <h3 className="text-lg font-bold text-white">Connect Into Notes Flow</h3>
              <p className="text-sm text-slate-400">
                Select your existing Notes and order them sequentially to visualize end-to-end coding flows and request lifecycles.
              </p>
            </div>

            <div className="relative p-6 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-4">
              <span className="text-4xl font-extrabold text-indigo-400 font-mono">03</span>
              <h3 className="text-lg font-bold text-white">Reuse & Master</h3>
              <p className="text-sm text-slate-400">
                Reuse the same Note across multiple flows. Instantly access notes through Command Palette search whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">
          Ready to build your connected knowledge base?
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Join developers using DevNotes to organize technical concepts, master backend architectures, and code faster.
        </p>
        <button
          onClick={() => navigate('signup')}
          className="inline-flex items-center gap-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-8 py-4 text-base font-bold shadow-xl shadow-emerald-500/20 transition-all"
        >
          <span>Create Workspace Now</span>
          <ArrowRight className="h-5 w-5" />
        </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-300 font-bold">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>DevNotes</span>
          </div>
          <div>© 2026 DevNotes. Understand. Connect. Remember.</div>
        </div>
      </footer>
    </div>
  );
};
