import React from 'react';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { clsx } from 'clsx';
import { THEME } from '../../context/DeckContext';
import { useTheme } from '../../context/ThemeContext';

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
    actionTitle = "Strategic Assessment Matrix",
    kicker = "Takeaway: Strong positioning across critical success factors.",
    columns = ["Current State", "Target State"],
    rows = ["Market Position", "Operational Efficiency", "Customer Satisfaction"],
    scores = [[1, 2], [1, 2], [0, 2]],
    section = 'Analysis',
    source
}) => {
    const { isDark } = useTheme();
    const activeSection = section;
    const sources = source ? [source] : [];

    // Helper to render Harvey Ball
    const HarveyBall = ({ score }: { score: number }) => {
        // 0 = Empty, 1 = Half, 2 = Full
        return (
            <div className="w-6 h-6 mx-auto relative">
                <div className={`absolute inset-0 rounded-full border-2 ${isDark ? 'border-white/30 bg-slate-800' : 'border-slate-300 bg-white'}`} />
                {score >= 2 && (
                    <div className="absolute inset-0 rounded-full" style={{ backgroundColor: THEME.primary }} />
                )}
                {score === 1 && (
                    <div className="absolute inset-0 rounded-full overflow-hidden">
                        <div className="h-full w-1/2" style={{ backgroundColor: THEME.primary }} />
                    </div>
                )}
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
            <div className="flex flex-col w-full h-full pt-6">
                {/* Header Row */}
                <div className={`flex border-b pb-3 mb-3 ${isDark ? 'border-white/20' : 'border-slate-300'}`}>
                    <div className={`w-1/4 text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Criteria</div>
                    {(columns || []).map(col => (
                        <div key={col} className={`flex-1 text-center text-sm font-semibold border-l first:border-l-0 ${isDark ? 'text-slate-200 border-white/10' : 'text-slate-700 border-slate-200'}`}>
                            {col}
                        </div>
                    ))}
                </div>

                {/* Rows */}
                {(rows || []).map((rowLabel, rowIdx) => (
                    <div
                        key={rowLabel}
                        className={clsx(
                            "flex items-center py-4 border-b",
                            isDark ? "border-white/10" : "border-slate-200",
                            rowIdx % 2 === 0 ? (isDark ? "bg-white/5" : "bg-white") : (isDark ? "bg-white/10" : "bg-slate-50/40")
                        )}
                    >
                        <div className={`w-1/4 text-sm font-medium pr-4 leading-tight ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{rowLabel}</div>
                        {(columns || []).map((_, colIdx) => (
                            <div key={colIdx} className={`flex-1 flex justify-center border-l first:border-l-0 ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                                <HarveyBall score={scores?.[rowIdx]?.[colIdx] ?? 0} />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </ConsultingLayout>
    );
};
