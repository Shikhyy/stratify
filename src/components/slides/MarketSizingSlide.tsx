import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';

import { useTheme } from '../../context/ThemeContext';

interface MarketSizingSlideProps {
    actionTitle?: string;
    kicker?: string;
    segments?: { name?: string; value?: number; growth?: string; source?: string }[];
    section?: Section;
    phase?: Section;
}

export const MarketSizingSlide: React.FC<MarketSizingSlideProps> = ({
    actionTitle = "Market Opportunity Analysis",
    kicker = "Takeaway: High growth potential identified in key segments.",
    segments = [
        { name: "TAM", value: 100, growth: "10%", source: "Stratify Est." }
    ],
    section = 'Analysis',
    phase
}) => {
    const { isDark } = useTheme();
    const activeSection = phase || section;

    // Extract sources
    const sources = Array.from(new Set((segments || []).map(s => s.source).filter(Boolean))) as string[];

    const safeSegments = (segments || []).filter(s => s.name && s.value !== undefined).map(s => ({
        name: s.name || "Unknown Segment",
        value: s.value || 0,
        growth: s.growth || ""
    }));

    if (safeSegments.length === 0) {
        safeSegments.push({ name: "Global Market", value: 100, growth: "5%" });
    }

    const max = Math.max(...safeSegments.map(s => s.value), 1);

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="w-full h-full flex items-end justify-center gap-12 pb-12 px-10">
                {safeSegments.map((seg, idx) => {
                    const heightPercent = (seg.value / max) * 70;
                    const colors = ['#3b82f6', '#2563eb', '#1d4ed8'];

                    return (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: idx * 0.15 }}
                            className="flex flex-col items-center relative group" 
                            style={{ width: `${100 / safeSegments.length - 8}%` }}
                        >
                            {/* Value Display */}
                            <div 
                                className={`text-2xl font-semibold mb-6 ${
                                    isDark ? 'text-slate-100' : 'text-slate-900'
                                }`}
                            >
                                ${seg.value}B
                            </div>
                            
                            {seg.growth && (
                                <div 
                                    className={`text-xs font-semibold px-3 py-1 rounded-md mb-4 ${
                                        isDark 
                                            ? 'bg-slate-700/40 text-slate-300' 
                                            : 'bg-slate-100 text-slate-600'
                                    }`}
                                >
                                    {seg.growth} growth
                                </div>
                            )}

                            {/* Bar Container */}
                            <div className="relative w-full flex-1 flex items-end justify-center max-h-[65%]">
                                {/* Main Bar */}
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: `${heightPercent}%`, opacity: 1 }}
                                    transition={{ duration: 0.8, delay: idx * 0.15 }}
                                    whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                                    className={`w-full rounded-t-lg relative overflow-hidden min-h-[60px] transition-shadow duration-300 ${
                                        isDark
                                            ? 'hover:shadow-lg hover:shadow-blue-500/30'
                                            : 'hover:shadow-md hover:shadow-blue-400/30'
                                    }`}
                                    style={{ 
                                        background: colors[idx % 3],
                                    }}
                                />
                            </div>

                            {/* Label */}
                            <motion.div 
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.15 + 0.2 }}
                                className={`mt-4 text-sm font-medium ${
                                    isDark ? 'text-slate-300' : 'text-slate-600'
                                }`}
                            >
                                {seg.name}
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </ConsultingLayout>
    );
};
