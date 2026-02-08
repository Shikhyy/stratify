import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
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
            <div className="flex w-full h-full items-center justify-center gap-2 px-6">
                {(steps || []).map((step, idx) => {
                    const accentColors = ['#3b82f6', '#2563eb', '#1d4ed8'];
                    
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.15, duration: 0.6 }}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2 } 
                            }}
                            className="flex-1 h-[65%] min-h-[340px] relative group"
                            style={{ zIndex: steps.length - idx }}
                        >
                            {/* Card Shape */}
                            <div
                                className={`absolute inset-0 flex flex-col p-8 rounded-xl border transition-shadow duration-300 ${
                                    isDark 
                                        ? 'bg-slate-800/50 border-slate-700 hover:shadow-lg hover:shadow-slate-900/50' 
                                        : 'bg-white border-slate-200 hover:shadow-md hover:shadow-slate-300/30'
                                }`}
                                style={{
                                    clipPath: 'polygon(0% 0%, 88% 0%, 100% 50%, 88% 100%, 0% 100%, 12% 50%)',
                                    marginLeft: idx === 0 ? 0 : '-40px',
                                    paddingLeft: idx === 0 ? '2rem' : '4rem',
                                }}
                            >
                                {/* Number Badge */}
                                <div 
                                    className="absolute top-6 right-8 w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg text-white flex-shrink-0"
                                    style={{ 
                                        background: accentColors[idx % 3],
                                    }}
                                >
                                    {idx + 1}
                                </div>

                                <h3 
                                    className={`font-semibold text-xl mt-6 mb-4 pb-2 relative z-10 ${
                                        isDark ? 'text-slate-100' : 'text-slate-900'
                                    }`}
                                    style={{ borderBottom: `2px solid ${accentColors[idx % 3]}30` }}
                                >
                                    {step.title}
                                </h3>

                                <ul className="space-y-2 relative z-10">
                                    {step.bullets?.map((b) => (
                                        <li 
                                            key={b}
                                            className={`flex items-start gap-3 text-sm leading-relaxed ${
                                                isDark ? 'text-slate-300' : 'text-slate-600'
                                            }`}
                                        >
                                            <div
                                                className="w-1.5 h-1.5 rounded-full mt-2 shrink-0" 
                                                style={{ 
                                                    background: accentColors[idx % 3],
                                                }}
                                            />
                                            {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </ConsultingLayout>
    );
};
