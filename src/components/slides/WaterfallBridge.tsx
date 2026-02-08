import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { useTheme } from '../../context/ThemeContext';

interface WaterfallStep {
    label: string;
    value: number;
    type: 'plus' | 'minus' | 'total' | 'subtotal';
}

interface WaterfallBridgeProps {
    actionTitle?: string;
    kicker?: string;
    steps?: WaterfallStep[];
    section?: Section;
    source?: string;
}

export const WaterfallBridge: React.FC<WaterfallBridgeProps> = ({
    actionTitle = "Profitability Bridge Analysis",
    kicker = "Takeaway: Cost reductions and revenue growth drive 25-30% margin improvement.",
    steps = [
        { label: "2023 EBIT", value: 100, type: "total" },
        { label: "Price Effect", value: 20, type: "plus" },
        { label: "Volume", value: -10, type: "minus" },
        { label: "Cost Savings", value: 30, type: "plus" },
        { label: "2024 EBIT", value: 140, type: "total" }
    ],
    section = 'Analysis',
    source
}) => {
    const { isDark } = useTheme();
    const activeSection = section;
    const sources = source ? [source] : [];

    // Calculate cumulative values for "floating" bars
    let runningTotal = 0;
    const chartData = (steps || []).map(step => {
        const start = step.type === 'total' || step.type === 'subtotal' ? 0 : runningTotal;
        const change = step.value;
        const end = step.type === 'total' || step.type === 'subtotal' ? step.value : runningTotal + change;

        // Update running total for next step
        if (step.type !== 'total' && step.type !== 'subtotal') {
            runningTotal = end;
        } else {
            runningTotal = step.value;
        }

        return { ...step, start, end, change };
    });

    const maxVal = Math.max(...chartData.map(d => Math.max(Math.abs(d.start), Math.abs(d.end)))) * 1.2;
    const formatValue = (value: number) => {
        const absValue = Math.abs(Math.round(value));
        return `${value < 0 ? '-' : ''}$${absValue}M`;
    };

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="w-full h-full flex items-center justify-center px-10 pb-16 pt-8">
                <div className="w-full h-full flex items-end justify-center gap-6">
                    {chartData.map((d, idx) => {
                        const barBottom = (Math.min(d.start, d.end) / maxVal) * 60 + 10;
                        const barHeight = (Math.abs(d.end - d.start) / maxVal) * 60;

                        let barColor = '#64748b';
                        
                        if (d.type === 'plus') {
                            barColor = '#10b981';
                        }
                        if (d.type === 'minus') {
                            barColor = '#ef4444';
                        }
                        if (d.type === 'total') {
                            barColor = '#2563eb';
                        }

                        const isTotal = d.type === 'total' || d.type === 'subtotal';
                        const displayValue = isTotal ? formatValue(d.end) : `${d.change > 0 ? '+' : ''}${formatValue(d.change)}`;

                        return (
                            <motion.div 
                                key={idx} 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.12, duration: 0.5 }}
                                className="relative flex-1 h-full flex flex-col justify-end items-center max-w-[120px] group"
                            >
                                {/* Connector Line (Bridge) */}
                                {idx > 0 && d.type !== 'total' && d.type !== 'subtotal' && (
                                    <motion.svg 
                                        className="absolute left-[-50%] w-[100%]"
                                        style={{ bottom: `${(chartData[idx - 1].end / maxVal) * 60 + 10}%`, height: '2px' }}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ delay: idx * 0.15 + 0.3, duration: 0.6 }}
                                    >
                                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke={isDark ? '#ffffff33' : '#00000020'} strokeWidth="2" strokeDasharray="5,5" />
                                    </motion.svg>
                                )}

                                {/* Value Label Above Bar */}
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 + 0.2 }}
                                    className={`text-sm font-bold mb-3 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
                                >
                                    {displayValue}
                                </motion.div>

                                {/* Bar Container */}
                                <div className="relative w-full" style={{ height: '60%' }}>
                                    {/* Bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${barHeight}%` }}
                                        transition={{ delay: idx * 0.12 + 0.1, duration: 0.6 }}
                                        whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                                        className="w-full rounded-t-md relative overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                                        style={{
                                            position: 'absolute',
                                            bottom: `${barBottom}%`,
                                            background: barColor,
                                        }}
                                    />
                                </div>

                                {/* X-Axis Label */}
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.15 + 0.4 }}
                                    className="mt-4 text-center w-full"
                                >
                                    <div className={`text-xs font-bold uppercase tracking-wider leading-tight px-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {d.label}
                                    </div>
                                </motion.div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </ConsultingLayout>
    );
};
