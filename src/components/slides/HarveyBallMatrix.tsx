import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { clsx } from 'clsx';

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

    // Helper to render Harvey Ball with improved styling
    const HarveyBall = ({ score }: { score: number }) => {
        // 0 = Empty, 1 = Half, 2 = Full
        const ballSize = 'w-14 h-14';
        const color = '#3b82f6';
        
        return (
            <div 
                className={`${ballSize} mx-auto relative`}
            >
                {/* Main circle outline */}
                <div 
                    className={`absolute inset-0 rounded-full border-2 ${isDark ? 'bg-slate-700/20' : 'bg-slate-50'}`}
                    style={{ 
                        borderColor: isDark ? '#64748b' : '#cbd5e1',
                    }}
                />
                
                {/* Score visual fill */}
                {score >= 2 && (
                    <div 
                        className="absolute inset-0 rounded-full"
                        style={{ 
                            background: color,
                        }}
                    />
                )}
                {score === 1 && (
                    <div 
                        className="absolute inset-0 rounded-full overflow-hidden"
                    >
                        <div 
                            className="h-full w-1/2" 
                            style={{ 
                                background: color,
                            }}
                        />
                    </div>
                )}
                
                {/* Score indicator (0 = empty circle) */}
                {score === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`text-xs font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>○</div>
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
            <div className="flex flex-col w-full h-full pt-8">
                {/* Header Row */}
                <div className={`flex border-b-2 pb-4 mb-6 ${isDark ? 'border-white/20' : 'border-slate-300'}`}>
                    <div className={`w-1/4 text-xs font-bold uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Criteria</div>
                    {(columns || []).map((col, idx) => (
                        <motion.div 
                            key={col}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`flex-1 text-center text-sm font-bold border-l first:border-l-0 ${isDark ? 'text-slate-200 border-white/10' : 'text-slate-700 border-slate-300'}`}
                        >
                            {col}
                        </motion.div>
                    ))}
                </div>

                {/* Rows */}
                {(rows || []).map((rowLabel, rowIdx) => (
                    <motion.div
                        key={rowLabel}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: rowIdx * 0.15 }}
                        className={clsx(
                            "flex items-center py-5 px-3 border-b-2 rounded-lg transition-all duration-300 group cursor-pointer hover:bg-white/10",
                            isDark ? "border-white/10 hover:border-white/20" : "border-slate-200 hover:border-slate-300",
                            rowIdx % 2 === 0 ? (isDark ? "bg-white/5" : "bg-slate-50/50") : (isDark ? "bg-white/8" : "bg-white/70")
                        )}
                    >
                        <div className={`w-1/4 text-sm font-semibold pr-4 leading-tight ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                            {rowLabel}
                        </div>
                        {(columns || []).map((_, colIdx) => (
                            <motion.div 
                                key={colIdx}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: rowIdx * 0.15 + colIdx * 0.1 }}
                                className={`flex-1 flex justify-center border-l first:border-l-0 ${isDark ? 'border-white/5' : 'border-slate-200'}`}
                            >
                                <HarveyBall score={scores?.[rowIdx]?.[colIdx] ?? 0} />
                            </motion.div>
                        ))}
                    </motion.div>
                ))}
            </div>
        </ConsultingLayout>
    );
};
