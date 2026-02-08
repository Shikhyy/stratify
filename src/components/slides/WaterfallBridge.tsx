import React from 'react';
import { motion } from 'framer-motion';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { clsx } from 'clsx';

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

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="w-full h-full flex items-center justify-center px-8 pb-16 pt-8">
                <div className="w-full h-full flex items-end justify-center gap-6">
                    {chartData.map((d, idx) => {
                        const barBottom = (Math.min(d.start, d.end) / maxVal) * 60 + 10; // Scale to 60% of height, offset by 10%
                        const barHeight = (Math.abs(d.end - d.start) / maxVal) * 60;

                        // Colors:
                        let barColor = 'bg-slate-500';
                        if (d.type === 'plus') barColor = 'bg-emerald-500';
                        if (d.type === 'minus') barColor = 'bg-rose-500';
                        if (d.type === 'total') barColor = 'bg-slate-700';

                        const isTotal = d.type === 'total' || d.type === 'subtotal';

                        return (
                            <div key={idx} className="relative flex-1 h-full flex flex-col justify-end items-center group max-w-[140px]">
                                {/* Connector Line (Bridge) */}
                                {idx > 0 && d.type !== 'total' && d.type !== 'subtotal' && (
                                    <div
                                        className="absolute left-[-50%] w-[100%] border-t-2 border-dashed border-slate-400 z-0"
                                        style={{ bottom: `${(chartData[idx - 1].end / maxVal) * 60 + 10}%` }}
                                    />
                                )}

                                {/* Value Label Above Bar */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.15 + 0.3 }}
                                    className="font-bold text-xl mb-2 z-10"
                                    style={{
                                        color: d.type === 'plus' ? '#10b981' : d.type === 'minus' ? '#f43f5e' : '#1e293b'
                                    }}
                                >
                                    {isTotal ? d.end : (d.change > 0 ? `+${d.change}` : d.change)}
                                </motion.div>

                                {/* Bar Container */}
                                <div className="relative w-full" style={{ height: '60%' }}>
                                    {/* Bar */}
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${barHeight}%` }}
                                        transition={{ duration: 0.8, delay: idx * 0.15, ease: 'easeOut' }}
                                        className={clsx("w-full shadow-lg rounded-t-md relative z-10", barColor)}
                                        style={{
                                            position: 'absolute',
                                            bottom: `${barBottom}%`
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-t-md" />
                                    </motion.div>
                                </div>

                                {/* X-Axis Label */}
                                <div className="mt-4 text-center w-full">
                                    <div className="text-xs font-semibold text-slate-700 leading-tight px-1">
                                        {d.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ConsultingLayout>
    );
};
