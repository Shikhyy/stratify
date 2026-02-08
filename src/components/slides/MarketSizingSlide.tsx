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
        growth: s.growth || "N/A"
    }));

    if (safeSegments.length === 0) {
        safeSegments.push({ name: "Global Market", value: 1, growth: "0%" });
    }

    const max = safeSegments[0]?.value || 1;

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="w-full h-full flex items-end justify-center gap-16 pb-8">
                {safeSegments.map((seg, idx) => {
                    const heightPercent = (seg.value / max) * 100;

                    return (
                        <div key={idx} className="flex flex-col items-center relative group w-40">
                            {/* Annotation Line (CAGR) */}
                            {seg.growth && (
                                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs px-2 py-1 rounded">
                                    CAGR: {seg.growth}
                                </div>
                            )}

                            {/* Value Label */}
                            <div className="text-2xl font-bold mb-2 text-slate-700">
                                ${seg.value}B
                            </div>

                            {/* Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPercent}%` }}
                                transition={{ duration: 1, ease: 'circOut', delay: idx * 0.2 }}
                                className="w-full rounded-t-md shadow-lg relative overflow-hidden"
                                style={{ backgroundColor: idx === 0 ? THEME.secondary : THEME.primary }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-tr from-black/10 to-transparent" />
                            </motion.div>

                            {/* X-Axis Label */}
                            <div className="mt-4 text-center">
                                <div className="font-bold text-slate-800 text-lg border-t-2 pt-2 border-slate-300 w-full">
                                    {seg.name}
                                </div>
                            </div>

                            {/* Connector Line (except for last) */}
                            {idx < safeSegments.length - 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 1 }}
                                    className="absolute top-[20%] -right-10 w-4 border-t-2 border-dashed border-slate-300"
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </ConsultingLayout>
    );
};
