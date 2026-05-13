/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scale, 
  Target, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  LayoutGrid, 
  Zap,
  ArrowRight,
  TrendingUp,
  RefreshCcw,
  Languages
} from "lucide-react";

interface ProsCons {
  text: string;
  type: "pro" | "con";
}

interface Swot {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

interface ComparisonOption {
  name: string;
  bestFor: string;
  riskLevel: string;
}

interface AnalysisResult {
  language: "en" | "es";
  decisionSummary: string;
  prosCons: ProsCons[];
  swot: Swot;
  comparisonOptions?: ComparisonOption[];
  recommendation: string;
}

const DICTIONARY = {
  en: {
    title: "The Tiebreaker",
    subtitle: "AI-powered decision clarity",
    placeholder: "Should I quit my job and start a food truck? / ¿Debería dejar mi trabajo y abrir un food truck?",
    analyze: "Analyze Decision",
    pros: "Pros",
    cons: "Cons",
    swot: "SWOT Analysis",
    strengths: "Strengths",
    weaknesses: "Weaknesses",
    opportunities: "Opportunities",
    threats: "Threats",
    comparison: "Comparison",
    tiebreaker: "The Tiebreaker's Recommendation",
    reset: "Start Over",
    loading: ["Consulting logic...", "Evaluating risks...", "Finding the balance...", "Breaking the tie..."]
  },
  es: {
    title: "El Desempate",
    subtitle: "Claridad de decisiones con IA",
    placeholder: "¿Debería dejar mi trabajo y abrir un food truck? / Should I quit my job and start a food truck?",
    analyze: "Analizar Decisión",
    pros: "Pros",
    cons: "Contras",
    swot: "Análisis FODA",
    strengths: "Fortalezas",
    weaknesses: "Debilidades",
    opportunities: "Oportunidades",
    threats: "Amenazas",
    comparison: "Comparación",
    tiebreaker: "Recomendación de El Desempate",
    reset: "Empezar de nuevo",
    loading: ["Consultando la lógica...", "Evaluando riesgos...", "Buscando el equilibrio...", "Desempatando..."]
  }
};

export default function App() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [lang, setLang] = useState<"en" | "es">("en");
  const [error, setError] = useState<string | null>(null);

  const t = DICTIONARY[lang];

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dilemma: input }),
      });

      if (!res.ok) throw new Error("Failed to analyze");
      
      const data = await res.json();
      setResult(data);
      if (data.language) setLang(data.language);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto selection:bg-emerald-500/30">
      {/* Header */}
      <header className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center md:justify-start gap-3"
          >
            <Scale className="w-8 h-8 text-emerald-500" />
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
              {t.title}
            </h1>
          </motion.div>
          <p className="text-neutral-400 font-medium">{t.subtitle}</p>
        </div>
        
        <div className="flex justify-center gap-2">
          <button 
            onClick={() => setLang("en")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'en' ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
          >
            ENGLISH
          </button>
          <button 
            onClick={() => setLang("es")}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${lang === 'es' ? 'bg-emerald-500 text-neutral-950' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}
          >
            ESPAÑOL
          </button>
        </div>
      </header>

      <main className="space-y-8">
        {/* Input Section */}
        <AnimatePresence mode="wait">
          {!result && !loading ? (
            <motion.div 
              key="input"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card space-y-6"
            >
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 p-3 rounded-xl">
                  <HelpCircle className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-display font-semibold">
                    {lang === 'en' ? "What's on your mind?" : "¿Qué tienes en mente?"}
                  </h2>
                  <textarea 
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    className="w-full bg-neutral-800/50 border border-neutral-700 rounded-xl p-4 min-h-[150px] focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none text-lg"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <button 
                  disabled={!input.trim()}
                  onClick={handleAnalyze}
                  className="btn-primary flex items-center gap-2 group"
                >
                  {t.analyze}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ) : loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card flex flex-col items-center justify-center py-20 space-y-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                <Scale className="absolute inset-0 m-auto w-6 h-6 text-emerald-500 animate-pulse" />
              </div>
              <p className="text-xl font-display font-medium text-neutral-300 animate-pulse">
                {t.loading[Math.floor(Date.now() / 2000) % t.loading.length]}
              </p>
            </motion.div>
          ) : result && (
            <div className="space-y-8">
              {/* Reset FAB */}
              <motion.button 
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setResult(null); setInput(""); }}
                className="fixed bottom-8 right-8 bg-neutral-100 text-neutral-900 p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-50 flex items-center gap-2 font-bold"
              >
                <RefreshCcw className="w-5 h-5" />
                <span className="hidden md:inline">{t.reset}</span>
              </motion.button>

              {/* Summary Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold uppercase tracking-widest">
                  <TrendingUp className="w-4 h-4" />
                  Analysis Complete
                </div>
                <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight">
                  {result.decisionSummary}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pros & Cons */}
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass-card space-y-6"
                >
                  <h3 className="flex items-center gap-2 text-xl font-display font-bold">
                    <Scale className="w-5 h-5 text-emerald-500" />
                    {t.pros} & {t.cons}
                  </h3>
                  
                  <div className="space-y-4">
                    {result.prosCons.map((pc, i) => (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${pc.type === 'pro' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-rose-500/5 border-rose-500/10'}`}>
                        {pc.type === 'pro' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm md:text-base leading-relaxed">{pc.text}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* SWOT */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-card space-y-6"
                >
                  <h3 className="flex items-center gap-2 text-xl font-display font-bold">
                    <LayoutGrid className="w-5 h-5 text-emerald-500" />
                    {t.swot}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4 h-full">
                    <SwotBox title={t.strengths} items={result.swot.strengths} color="emerald" />
                    <SwotBox title={t.weaknesses} items={result.swot.weaknesses} color="amber" />
                    <SwotBox title={t.opportunities} items={result.swot.opportunities} color="blue" />
                    <SwotBox title={t.threats} items={result.swot.threats} color="rose" />
                  </div>
                </motion.div>
              </div>

              {/* Comparison (if any) */}
              {result.comparisonOptions && result.comparisonOptions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card overflow-hidden"
                >
                  <h3 className="mb-6 flex items-center gap-2 text-xl font-display font-bold">
                    <Languages className="w-5 h-5 text-emerald-500" />
                    {t.comparison}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-neutral-800">
                          <th className="pb-4 font-display font-bold text-neutral-400 uppercase text-xs tracking-wider">Option</th>
                          <th className="pb-4 font-display font-bold text-neutral-400 uppercase text-xs tracking-wider">Best For</th>
                          <th className="pb-4 font-display font-bold text-neutral-400 uppercase text-xs tracking-wider text-right">Risk Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800">
                        {result.comparisonOptions.map((opt, i) => (
                          <tr key={i} className="group hover:bg-white/5 transition-colors">
                            <td className="py-4 font-bold text-lg">{opt.name}</td>
                            <td className="py-4 text-neutral-300">{opt.bestFor}</td>
                            <td className="py-4 text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                opt.riskLevel.toLowerCase().includes('high') ? 'bg-rose-500/20 text-rose-500' :
                                opt.riskLevel.toLowerCase().includes('low') ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                              }`}>
                                {opt.riskLevel}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Recommendation */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-emerald-500 p-8 md:p-12 rounded-[2rem] text-neutral-950 relative overflow-hidden group"
              >
                <div className="relative z-10 space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neutral-950/20 border border-neutral-950/10 text-neutral-950 font-bold text-sm tracking-widest uppercase">
                    <Zap className="w-4 h-4 fill-current" />
                    Final Call
                  </div>
                  <h3 className="text-3xl md:text-5xl font-display font-bold tracking-tight mb-4">
                    {t.tiebreaker}
                  </h3>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed max-w-3xl opacity-90">
                    {result.recommendation}
                  </p>
                </div>
                
                {/* Decorative Elements */}
                <Scale className="absolute -bottom-10 -right-10 w-64 h-64 text-neutral-950/10 rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-500 text-center font-medium"
          >
            {error}
          </motion.div>
        )}
      </main>

      <footer className="mt-20 py-8 border-t border-neutral-900 text-center text-neutral-500 space-y-4">
        <div className="flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
          <Scale className="w-5 h-5" />
          <span className="font-display font-bold tracking-widest uppercase text-xs">The Tiebreaker</span>
        </div>
        <p className="text-xs">© 2026 Crafted with Intelligence. Decisions are suggestions only.</p>
      </footer>
    </div>
  );
}

function SwotBox({ title, items, color }: { title: string, items: string[], color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    rose: "text-rose-500 bg-rose-500/10 border-rose-500/20",
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color]} flex flex-col gap-3 group hover:border-white/20 transition-all`}>
      <h4 className="font-display font-bold text-xs uppercase tracking-widest">{title}</h4>
      <ul className="space-y-2 flex-1">
        {items.map((item, i) => (
          <li key={i} className="text-xs md:text-sm leading-snug list-disc ml-4 marker:text-current font-medium">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

