import React from 'react';
import { motion } from 'framer-motion';

import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { useTheme } from '../../context/ThemeContext';

interface StrategicRoadmapProps {
    actionTitle?: string;
    kicker?: string;
    phases?: { phase?: string; duration?: string; milestones?: string[] }[];
    section?: Section;
    phase?: Section;
    source?: string;
}

export const StrategicRoadmap: React.FC<StrategicRoadmapProps> = ({
    actionTitle = "Strategic Execution Plan",
    kicker = "Takeaway: Phased rollout ensures risk mitigation.",
    phases = [
        { phase: "Phase 1", duration: "M1-3", milestones: ["Init"] }
    ],
    section = 'Strategy',
    phase,
    source
}) => {
    const { isDark } = useTheme();
    const activeSection = phase || section;
    const sources = source ? [source] : [];

    const safePhases = phases.map(p => ({
        phase: p.phase || "Untitled Phase",
        duration: p.duration || "TBD",
        milestones: p.milestones || []
    }));

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="flex w-full h-full items-center gap-8 px-6">
                {safePhases.map((phase, idx) => {
                    const accentColors = ['#3b82f6', '#2563eb', '#1d4ed8'];
                    
                    return (
                        <motion.div
                            key={phase.phase + idx}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15, duration: 0.6 }}
                            whileHover={{ 
                                scale: 1.02,
                                transition: { duration: 0.2 }
                            }}
                            className="flex-1 relative h-[65%] min-h-[300px]"
                        >
                            {/* Card */}
                            <div
                                className={`absolute inset-0 flex flex-col p-8 rounded-xl border transition-shadow duration-300 ${
                                    isDark 
                                        ? 'bg-slate-800/50 border-slate-700 hover:shadow-lg hover:shadow-slate-900/50' 
                                        : 'bg-white border-slate-200 hover:shadow-md hover:shadow-slate-300/30'
                                }`}
                                style={{
                                    clipPath: 'polygon(0% 0%, 86% 0%, 100% 50%, 86% 100%, 0% 100%, 14% 50%)',
                                    marginLeft: idx === 0 ? 0 : '-30px',
                                    paddingLeft: idx === 0 ? '2rem' : '4rem',
                                }}
                            >
                                {/* Duration Badge */}
                                <div
                                    className="inline-block px-3 py-1.5 mb-4 rounded-md text-xs font-semibold uppercase tracking-wide text-white w-fit"
                                    style={{ background: accentColors[idx % 3] }}
                                >
                                    {phase.duration}
                                </div>
                                
                                <h3 
                                    className={`font-semibold text-lg mb-4 pb-2 relative z-10 ${
                                        isDark ? 'text-slate-100' : 'text-slate-900'
                                    }`}
                                    style={{ borderBottom: `1px solid ${accentColors[idx % 3]}30` }}
                                >
                                    {phase.phase}
                                </h3>

                                <ul className="space-y-2 relative z-10">
                                    {phase.milestones.map((m) => (
                                        <li 
                                            key={m}
                                            className={`flex items-start gap-3 text-sm leading-relaxed ${
                                                isDark ? 'text-slate-300' : 'text-slate-600'
                                            }`}
                                        >
                                            <div
                                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 flex-shrink-0" 
                                                style={{ background: accentColors[idx % 3] }}
                                            />
                                            {m}
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
