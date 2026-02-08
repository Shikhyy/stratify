import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../context/DeckContext';
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
            <div className="flex w-full h-full items-center gap-4 px-4">
                {safePhases.map((phase, idx) => (
                    <motion.div
                        key={phase.phase + idx} // fallback key
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.3 }}
                        className="flex-1 relative h-[60%] min-h-[300px]"
                    >
                        {/* Chevron Shape */}
                        <div
                            className={`absolute inset-0 flex flex-col p-6 z-10 border ${isDark ? 'border-white/20' : 'border-slate-200'}`}
                            style={{
                                backgroundColor: isDark
                                    ? (idx % 2 === 0 ? '#1E293B' : '#0F172A')
                                    : (idx % 2 === 0 ? '#F8FAFC' : '#FFFFFF'),
                                clipPath: 'polygon(0% 0%, 85% 0%, 100% 50%, 85% 100%, 0% 100%, 15% 50%)',
                                marginLeft: idx === 0 ? 0 : '-30px',
                                paddingLeft: idx === 0 ? '1.5rem' : '3.5rem'
                            }}
                        >
                            <div className={`uppercase text-xs tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {phase.duration}
                            </div>
                            <h3 className={`font-semibold text-xl mb-4 border-b pb-2 ${isDark ? 'text-white border-white/20' : 'text-slate-900 border-slate-200'}`}>
                                {phase.phase}
                            </h3>

                            <ul className="space-y-2">
                                {phase.milestones.map(m => (
                                    <li key={m} className={`flex items-start gap-2 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <div className="min-w-[6px] h-[6px] rounded-full mt-1.5" style={{ backgroundColor: THEME.primary }} />
                                        {m}
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
