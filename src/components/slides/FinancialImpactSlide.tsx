import React from 'react';
import { motion } from 'framer-motion';

import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { useTheme } from '../../context/ThemeContext';

interface FinancialImpactSlideProps {
    actionTitle?: string;
    kicker?: string;
    data?: { year: string; value: number; type: 'Base' | 'Bull' | 'Bear' }[];
    assumptions?: string;
    section?: Section;
    source?: string;
}

export const FinancialImpactSlide: React.FC<FinancialImpactSlideProps> = ({
    actionTitle = "Financial Impact Analysis",
    kicker = "Takeaway: Significant upside potential in the Bull case.",
    data = [
        { year: "2024", value: 10, type: "Base" },
        { year: "2025", value: 15, type: "Base" },
        { year: "2026", value: 25, type: "Base" }
    ],
    assumptions = "Assumes 15% market penetration by Year 3.",
    section = 'Impact',
    source = "Internal Projections"
}) => {
    const { isDark } = useTheme();
    const max = Math.max(...data.map(d => d.value), 1);

    return (
        <ConsultingLayout
            activeSection={section}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={[source]}
        >
            <div className="w-full h-full flex flex-col p-4">
                {/* Assumptions Box */}
                <div className={`mb-6 p-3 border text-xs ${isDark ? 'bg-white/5 border-white/20 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                    <span className={`font-semibold mr-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Assumptions:</span>
                    {assumptions}
                </div>

                {/* Chart Area */}
                <div className={`flex-1 flex items-end justify-around pb-6 px-8 border-b-2 ${isDark ? 'border-white/20' : 'border-slate-300'}`}>
                    {data.map((item, idx) => {
                        const heightPercent = (item.value / max) * 85;
                        const barGradient = item.type === 'Base'
                            ? 'linear-gradient(135deg, #d79f1e 0%, #f0b429 100%)'
                            : item.type === 'Bull'
                                ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
                                : 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)';
                        const shadowColor = item.type === 'Base'
                            ? 'rgba(215, 159, 30, 0.5)'
                            : item.type === 'Bull'
                                ? 'rgba(16, 185, 129, 0.5)'
                                : 'rgba(239, 68, 68, 0.5)';

                        return (
                            <motion.div 
                                key={idx} 
                                className="flex flex-col items-center gap-2 w-24"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                            >
                                <motion.div 
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: idx * 0.1 + 0.3, type: "spring" }}
                                    className={`font-bold text-xl px-3 py-1 rounded-lg shadow-md ${isDark ? 'text-slate-100 bg-slate-800/60' : 'text-slate-900 bg-white'}`}
                                    style={{ boxShadow: `0 4px 12px ${shadowColor}` }}
                                >
                                    ${item.value}M
                                </motion.div>

                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: `${heightPercent}%`, opacity: 1 }}
                                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
                                    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                    className="w-full rounded-t-xl relative overflow-hidden shadow-2xl min-h-[40px]"
                                    style={{ 
                                        background: barGradient,
                                        boxShadow: `0 -8px 24px ${shadowColor}`
                                    }}
                                >
                                    {/* Shine Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-transparent" />
                                    {/* Pattern Overlay */}
                                    <div className="absolute inset-0" style={{ 
                                        backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.05) 10px, rgba(255,255,255,0.05) 20px)'
                                    }} />
                                </motion.div>

                                <div className={`text-xs font-bold mt-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{item.year}</div>
                                <div className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${item.type === 'Bull' ? 'bg-emerald-500/20 text-emerald-400' : item.type === 'Bear' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    {item.type}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </ConsultingLayout>
    );
};
