import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../context/DeckContext';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { clsx } from 'clsx';

interface CompetitorBenchmarkingProps {
    actionTitle?: string;
    kicker?: string;
    competitors?: string[];
    criteria?: string[];
    scores?: number[][]; // Row (Criterion) x Col (Competitor)

    section?: Section;
    phase?: Section;
    source?: string;
}

export const CompetitorBenchmarking: React.FC<CompetitorBenchmarkingProps> = ({
    actionTitle = "Competitive Landscape Analysis",
    kicker = "Takeaway: Review competitive positioning strengths and weaknesses.",
    competitors = ["Us", "Incumbent"],
    criteria = ["Price", "Quality"],
    scores = [],
    section = 'Context',
    phase,
    source
}) => {
    const activeSection = phase || section;
    const sources = source ? [source] : [];

    // Helper to render Harvey Ball
    const HarveyBall = ({ score }: { score: number }) => {
        // 0 = Empty, 1 = Half, 2 = Full
        return (
            <div className="w-8 h-8 rounded-full border-2 border-slate-400 relative overflow-hidden bg-white mx-auto">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                    style={{ backgroundColor: THEME.primary }}
                    className={clsx(
                        "absolute inset-0 origin-left",
                        score === 0 && "hidden",
                        score === 1 && "w-1/2",
                        score >= 2 && "w-full"
                    )}
                />
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
            <div className="flex flex-col w-full h-full pt-4">
                {/* Header Row */}
                <div className="flex border-b-2 border-slate-800 pb-2 mb-2">
                    <div className="w-1/4 font-serif italic text-slate-500 flex items-end pb-1">Criteria</div>
                    {competitors.map(comp => (
                        <div key={comp} className="flex-1 text-center font-bold text-lg text-slate-800">
                            {comp}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {criteria.map((crit, rowIdx) => (
                    <motion.div
                        key={crit}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIdx * 0.1 }}
                        className={clsx(
                            "flex items-center py-4 border-b border-slate-200",
                            rowIdx % 2 === 0 ? "bg-slate-50/50" : "bg-white"
                        )}
                    >
                        <div className="w-1/4 font-semibold text-slate-700 pl-2">{crit}</div>
                        {competitors.map((_, colIdx) => (
                            <div key={colIdx} className="flex-1">
                                <HarveyBall score={scores?.[rowIdx]?.[colIdx] ?? 0} />
                            </div>
                        ))}
                    </motion.div>
                ))}
            </div>
        </ConsultingLayout>
    );
};
