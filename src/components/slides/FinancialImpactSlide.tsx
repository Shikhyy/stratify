import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../context/DeckContext';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';

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
                <div className="mb-6 p-4 bg-slate-50 border-l-4 border-slate-300 text-sm text-slate-600 italic">
                    <span className="font-bold not-italic text-slate-800 mr-2">Core Assumptions:</span>
                    {assumptions}
                </div>

                {/* Chart Area */}
                <div className="flex-1 flex items-end justify-around pb-8 px-12 border-b border-slate-200">
                    {data.map((item, idx) => {
                        const heightPercent = (item.value / max) * 100;
                        return (
                            <div key={idx} className="flex flex-col items-center gap-2 group w-24">
                                <div className="font-bold text-2xl text-slate-800">${item.value}M</div>

                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${heightPercent}%` }}
                                    transition={{ duration: 1, delay: idx * 0.2 }}
                                    className="w-full rounded-t-md relative overflow-hidden"
                                    style={{
                                        backgroundColor: item.type === 'Base' ? THEME.primary :
                                            item.type === 'Bull' ? '#10B981' : '#F43F5E',
                                        opacity: 0.9
                                    }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                </motion.div>

                                <div className="text-sm font-semibold text-slate-500 mt-2">{item.year}</div>
                                <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">{item.type}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ConsultingLayout>
    );
};
