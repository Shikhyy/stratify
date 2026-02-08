import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { THEME } from '../../context/DeckContext';

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
            <div className="w-full h-full flex items-end justify-center gap-8 pb-8 px-8">
                {safeSegments.map((seg, idx) => {
                    const heightPercent = (seg.value / max) * 70; // Scale to 70% of container

                    return (
                        <div key={idx} className="flex flex-col items-center relative group" style={{ width: `${100 / safeSegments.length - 5}%` }}>
                            {/* Value Label */}
                            <div className="text-3xl font-bold mb-3 text-slate-800 flex items-baseline gap-1">
                                {seg.value}
                                {seg.growth && (
                                    <span className="text-sm text-slate-500 font-normal">
                                        CAGR {seg.growth}
                                    </span>
                                )}
                            </div>

                            {/* Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 1.2, ease: 'circOut', delay: idx * 0.15 }}
                                className="w-full rounded-t-lg shadow-xl relative overflow-hidden min-h-[60px]"
                                style={{ backgroundColor: idx === 0 ? THEME.secondary : THEME.primary }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-white/10" />
                            </motion.div>

                            {/* X-Axis Label */}
                            <div className="mt-4 text-center w-full">
                                <div className="font-bold text-slate-800 text-base border-t-2 pt-3 border-slate-300 px-2">
                                    {seg.name}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ConsultingLayout>
    );
};
