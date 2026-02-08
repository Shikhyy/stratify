import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { THEME } from '../../context/DeckContext';

export type Section = 'Context' | 'Analysis' | 'Strategy' | 'Impact';

interface ConsultingLayoutProps {
    activeSection: Section;
    actionTitle: string;
    kicker: string;
    children: ReactNode;
    sources?: string[]; // Array of citations
    className?: string;
    variant?: 'default' | 'minimal' | 'focused';
}

export const ConsultingLayout: React.FC<ConsultingLayoutProps> = ({
    activeSection,
    actionTitle,
    kicker,
    children,
    sources = [],
    className,
    variant = 'default',
}) => {
    const sections: Section[] = ['Context', 'Analysis', 'Strategy', 'Impact'];

    // If source provided inside arrays (like MarketSizing), we might need to flatten or just take the main one passed as prop. 
    // The components will pass a aggregated list or single source in `sources`.

    return (
        <div className="w-full h-full bg-slate-900 flex flex-col font-sans text-white relative overflow-hidden ring-1 ring-white/5 rounded-xl">
            {/* Top Bar: Breadcrumb Tracker */}
            <div className="absolute top-4 right-8 z-20 flex gap-1">
                {sections.map((sec) => {
                    const isActive = sec === activeSection;
                    return (
                        <div
                            key={sec}
                            className={clsx(
                                "px-3 py-1 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all duration-300",
                                isActive ? "text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]" : "text-slate-500 bg-white/5"
                            )}
                            style={{ backgroundColor: isActive ? THEME.primary : undefined }}
                        >
                            {sec}
                        </div>
                    );
                })}
            </div>

            {/* Header: Action Title */}
            <div className={clsx(
                "w-[90%] transition-all",
                variant === 'minimal' ? "mx-auto text-center pt-12 pb-8" : "px-8 pt-8 pb-4"
            )}>
                <motion.h1
                    initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className={clsx(
                        "font-sans font-extrabold leading-tight text-white tracking-tight",
                        variant === 'minimal' ? "text-4xl" : "text-3xl"
                    )}
                >
                    {actionTitle}
                </motion.h1>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: variant === 'minimal' ? 100 : 60 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className={clsx(
                        "h-0.5 mt-4 mb-2 shadow-[0_0_10px_currentColor]",
                        variant === 'minimal' ? "mx-auto" : ""
                    )}
                    style={{ backgroundColor: THEME.secondary, color: THEME.secondary }}
                />
            </div>

            {/* Body: Chart Container */}
            <div className={clsx(
                "flex-1 px-8 py-2 min-h-0 relative select-none",
                className
            )}>
                {children}
            </div>

            {/* Footer: The Kicker + Sources */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 80, damping: 20 }}
                className="w-full bg-black/40 backdrop-blur-md border-t border-white/5 px-8 py-4 mt-auto z-10 flex items-center justify-between"
            >
                {/* Left: Kicker */}
                <div className="flex items-center gap-4 max-w-[70%]">
                    <div
                        className="w-1 h-8 rounded-full shadow-[0_0_8px_currentColor]"
                        style={{ backgroundColor: THEME.primary, color: THEME.primary }}
                    />
                    <p className="text-lg font-serif italic text-slate-300 leading-snug">
                        {kicker}
                    </p>
                </div>

                {/* Right: Sources */}
                <div className="flex flex-col items-end text-right max-w-[30%]">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Source</span>
                    {sources.length > 0 ? (
                        sources.map((s, i) => (
                            <span key={i} className="text-xs text-slate-400 font-medium truncate w-full">
                                {s}
                            </span>
                        ))
                    ) : (
                        <span className="text-xs text-slate-600 italic">Stratify Estimates</span>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
