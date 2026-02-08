import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { clsx } from 'clsx';
import { THEME } from '../../context/DeckContext';

interface HarveyBallMatrixProps {
    actionTitle?: string;
    kicker?: string;
    columns?: string[];
    rows?: string[];
    scores?: number[][];
    section?: Section;
    source?: string;
}

export const HarveyBallMatrix: React.FC<HarveyBallMatrixProps> = ({
    actionTitle = "Strategic Options Assessment",
    kicker = "Takeaway: Option B offers best balance of risk and reward.",
    columns = ["Option A", "Option B", "Option C"],
    rows = ["Market Fit", "Scalability", "Cost Efficiency"],
    scores = [[2, 1, 0], [1, 2, 1], [0, 2, 2]],
    section = 'Strategy',
    source
}) => {
    const activeSection = section;
    const sources = source ? [source] : [];

    // Helper to render Harvey Ball
    const HarveyBall = ({ score }: { score: number }) => {
        // 0 = Empty, 1 = Half, 2 = Full
        // Using SVG for cleaner circles at any size
        return (
            <div className="w-8 h-8 mx-auto relative group">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-current text-slate-800">
                    {/* Background Circle (Outline) */}
                    <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-slate-300" />

                    {/* Fill */}
                    {score >= 2 && (
                        <motion.circle
                            initial={{ r: 0 }} animate={{ r: 45 }} transition={{ duration: 0.5 }}
                            cx="50" cy="50" fill={THEME.primary}
                        />
                    )}
                    {score === 1 && (
                        <motion.path
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            d="M50 50 L50 5 A45 45 0 0 1 50 95 Z" fill={THEME.primary}
                        />
                    )}
                </svg>
            </div>
        );
    };

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="flex flex-col w-full h-full pt-8 px-8">
                {/* Header Row */}
                <div className="flex border-b-2 border-slate-900 pb-4 mb-4">
                    <div className="w-1/4 font-serif italic text-slate-500 flex items-end pb-1 text-sm">Evaluation Criteria</div>
                    {(columns || []).map(col => (
                        <div key={col} className="flex-1 text-center font-bold text-lg text-slate-900 border-l border-slate-100 first:border-l-0">
                            {col}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {(rows || []).map((rowLabel, rowIdx) => (
                    <motion.div
                        key={rowLabel}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIdx * 0.1 }}
                        className={clsx(
                            "flex items-center py-5 border-b border-slate-200 hover:bg-slate-50 transition-colors",
                            rowIdx % 2 === 0 ? "bg-white" : "bg-white"
                        )}
                    >
                        <div className="w-1/4 font-semibold text-slate-700 pl-2 pr-4 leading-tight">{rowLabel}</div>
                        {(columns || []).map((_, colIdx) => (
                            <div key={colIdx} className="flex-1 flex justify-center border-l border-slate-50 first:border-l-0">
                                <HarveyBall score={scores?.[rowIdx]?.[colIdx] ?? 0} />
                            </div>
                        ))}
                    </motion.div>
                ))}
            </div>
        </ConsultingLayout>
    );
};
