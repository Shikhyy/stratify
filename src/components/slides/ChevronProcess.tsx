import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { THEME } from '../../context/DeckContext';
import { useTheme } from '../../context/ThemeContext';

interface ChevronStep {
    title: string;
    bullets?: string[];
}

interface ChevronProcessProps {
    actionTitle?: string;
    kicker?: string;
    steps?: ChevronStep[];
    section?: Section;
    source?: string;
}

export const ChevronProcess: React.FC<ChevronProcessProps> = ({
    actionTitle = "Strategic Execution Phases",
    kicker = "Takeaway: Phased approach minimizes operational risk.",
    steps = [
        { title: "Mobilize", bullets: ["Setup Team", "Define KPIs"] },
        { title: "Launch", bullets: ["Go-Live", "Monitor"] },
        { title: "Scale", bullets: ["Expand Regions", "Optimize"] }
    ],
    section = 'Strategy',
    source
}) => {
    const { isDark } = useTheme();
    const activeSection = section;
    const sources = source ? [source] : [];

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="flex w-full h-full items-center justify-center gap-1 px-4">
                {(steps || []).map((step, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.2 }}
                        className="flex-1 h-[60%] min-h-[350px] relative group"
                        style={{ zIndex: steps.length - idx }} // Stack order
                    >
                        {/* Chevron Shape */}
                        <div
                            className={`absolute inset-0 flex flex-col p-8 border ${isDark ? 'border-white/20' : 'border-slate-200'}`}
                            style={{
                                backgroundColor: isDark 
                                    ? (idx % 2 === 0 ? '#1E293B' : '#0F172A')
                                    : (idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'),
                                clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)',
                                marginLeft: idx === 0 ? 0 : '-40px',
                                paddingLeft: idx === 0 ? '2rem' : '4rem'
                            }}
                        >
                            <div className={`font-semibold text-5xl absolute top-3 right-10 select-none pointer-events-none ${isDark ? 'text-white/10' : 'text-slate-300'}`}>
                                0{idx + 1}
                            </div>

                            <h3 className={`font-semibold text-xl mt-8 mb-4 border-b pb-3 relative z-10 ${isDark ? 'text-white border-white/20' : 'text-slate-900 border-slate-200'}`}>
                                {step.title}
                            </h3>

                            <ul className="space-y-3 relative z-10">
                                {step.bullets?.map(b => (
                                    <li key={b} className={`flex items-start gap-3 text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: THEME.primary }} />
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                ))}
            </div>
        </ConsultingLayout>
    );
};
