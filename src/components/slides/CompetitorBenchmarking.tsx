import React from 'react';
import { THEME } from '../../context/DeckContext';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { clsx } from 'clsx';
import { useTheme } from '../../context/ThemeContext';

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
    const { isDark } = useTheme();
    const activeSection = phase || section;
    const sources = source ? [source] : [];

    // Helper to render Harvey Ball
    const HarveyBall = ({ score }: { score: number }) => {
        // 0 = Empty, 1 = Half, 2 = Full
        return (
            <div className={`w-6 h-6 rounded-full border-2 relative overflow-hidden mx-auto ${isDark ? 'border-white/30 bg-slate-800' : 'border-slate-300 bg-white'}`}>
                <div
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
                <div className={`flex border-b pb-2 mb-2 ${isDark ? 'border-white/20' : 'border-slate-300'}`}>
                    <div className={`w-1/4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Criteria</div>
                    {competitors.map(comp => (
                        <div key={comp} className={`flex-1 text-center text-sm font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {comp}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {criteria.map((crit, rowIdx) => (
                    <div
                        key={crit}
                        className={clsx(
                            "flex items-center py-4 border-b",
                            isDark ? "border-white/10" : "border-slate-200",
                            rowIdx % 2 === 0 ? (isDark ? "bg-white/5" : "bg-white") : (isDark ? "bg-white/10" : "bg-slate-50/40")
                        )}
                    >
                        <div className={`w-1/4 text-sm font-medium pl-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{crit}</div>
                        {competitors.map((_, colIdx) => (
                            <div key={colIdx} className="flex-1">
                                <HarveyBall score={scores?.[rowIdx]?.[colIdx] ?? 0} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </ConsultingLayout>
    );
};
