import React, { type ReactNode } from 'react';
import { clsx } from 'clsx';
import { THEME } from '../../context/DeckContext';
import { useTheme } from '../../context/ThemeContext';

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
    const { isDark } = useTheme();
    const sections: Section[] = ['Context', 'Analysis', 'Strategy', 'Impact'];

    // If source provided inside arrays (like MarketSizing), we might need to flatten or just take the main one passed as prop. 
    // The components will pass a aggregated list or single source in `sources`.

    return (
        <div className={`w-full h-full flex flex-col font-sans relative overflow-hidden border rounded-xl ${isDark ? 'bg-slate-900 text-white border-white/10' : 'bg-white text-slate-900 border-slate-200'}`}>
            {/* Top Bar: Section Tracker */}
            <div className="absolute top-4 right-8 z-20 flex gap-2">
                {sections.map((sec) => {
                    const isActive = sec === activeSection;
                    return (
                        <div
                            key={sec}
                            className={clsx(
                                "px-2.5 py-1 rounded-full text-[10px] uppercase tracking-widest font-semibold",
                                isActive ? "text-white" : isDark ? "text-slate-400 border border-white/20" : "text-slate-500 border border-slate-200"
                            )}
                            style={{ backgroundColor: isActive ? THEME.primary : 'transparent' }}
                        >
                            {sec}
                        </div>
                    );
                })}
            </div>

            {/* Header: Insight Headline */}
            <div className={clsx(
                "w-full",
                variant === 'minimal' ? "px-12 pt-10 pb-4" : "px-12 pt-10 pb-3"
            )}>
                <h1
                    className={clsx(
                        "font-sans font-semibold leading-tight tracking-tight",
                        variant === 'minimal' ? "text-3xl" : "text-3xl",
                        isDark ? "text-white" : "text-slate-900"
                    )}
                >
                    {actionTitle}
                </h1>
                <div className={`h-px mt-3 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`} />
            </div>

            {/* Body: Chart Container */}
            <div className={clsx(
                "flex-1 px-12 py-3 min-h-0 relative",
                className
            )}>
                {children}
            </div>

            {/* Footer: Takeaway + Sources */}
            <div className={`w-full border-t px-12 py-3 mt-auto flex items-center justify-between ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="flex items-center gap-3 max-w-[70%]">
                    <div
                        className="w-1 h-6"
                        style={{ backgroundColor: THEME.primary }}
                    />
                    <p className={`text-sm leading-snug ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {kicker}
                    </p>
                </div>

                <div className="flex flex-col items-end text-right max-w-[30%]">
                    <span className={`text-[10px] font-semibold uppercase tracking-wider mb-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Source</span>
                    {sources.length > 0 ? (
                        sources.map((s, i) => (
                            <span key={i} className={`text-[11px] font-medium truncate w-full ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {s}
                            </span>
                        ))
                    ) : (
                        <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Stratify Estimates</span>
                    )}
                </div>
            </div>
        </div>
    );
};
