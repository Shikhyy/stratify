import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { THEME } from '../../context/DeckContext';

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
                            className="absolute inset-0 shadow-lg flex flex-col p-8 transition-transform group-hover:-translate-y-2"
                            style={{
                                backgroundColor: idx % 2 === 0 ? THEME.primary : THEME.secondary,
                                clipPath: 'polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 10% 50%)',
                                marginLeft: idx === 0 ? 0 : '-40px', // Overlap
                                paddingLeft: idx === 0 ? '2rem' : '4rem' // Adjust content padding
                            }}
                        >
                            <div className="text-white/50 font-bold text-6xl absolute top-2 right-12 select-none pointer-events-none">
                                0{idx + 1}
                            </div>

                            <h3 className="text-white font-bold text-2xl mt-8 mb-6 border-b border-white/20 pb-4 relative z-10">
                                {step.title}
                            </h3>

                            <ul className="space-y-4 relative z-10">
                                {step.bullets?.map(b => (
                                    <li key={b} className="flex items-start gap-3 text-white/90 text-sm font-medium leading-relaxed">
                                        <div className="w-1.5 h-1.5 rounded-full bg-white mt-1.5 shrink-0" />
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
