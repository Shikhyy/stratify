import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../context/DeckContext';
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
                <div className={`flex-1 flex items-end justify-around pb-6 px-8 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    {data.map((item, idx) => {
                        const heightPercent = (item.value / max) * 100;
                        const barColor = item.type === 'Base'
                            ? THEME.primary
                            : item.type === 'Bull'
                                ? '#0EA5A4'
                                : '#E11D48';

                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 w-24">
                                <div className={`font-semibold text-lg ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>${item.value}M</div>

                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercent}%` }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    className="w-full rounded-t-sm"
                                    style={{ backgroundColor: barColor }}
                                />

                                <div className={`text-xs font-semibold mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.year}</div>
                                <div className={`text-[10px] uppercase tracking-wider font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{item.type}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ConsultingLayout>
    );
};
