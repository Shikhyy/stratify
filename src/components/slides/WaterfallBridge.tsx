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
    kicker = "Takeaway: Cost reductions drive majority of margin improvement.",
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

    const maxVal = Math.max(...chartData.map(d => Math.max(d.start, d.end))) * 1.1;

    return (
        <ConsultingLayout
            activeSection={activeSection}
            actionTitle={actionTitle}
            kicker={kicker}
            sources={sources}
        >
            <div className="w-full h-full flex items-end justify-center px-12 pb-12 pt-4 gap-8">
                {chartData.map((d, idx) => {
                    const barBottom = (Math.min(d.start, d.end) / maxVal) * 100;
                    const barHeight = (Math.abs(d.end - d.start) / maxVal) * 100;

                    // Colors:
                    // Total/Subtotal: Gray or Primary
                    // Plus: Green
                    // Minus: Red
                    let barColor = 'bg-slate-400';
                    if (d.type === 'plus') barColor = 'bg-emerald-500';
                    if (d.type === 'minus') barColor = 'bg-rose-500';
                    if (d.type === 'total') barColor = 'bg-slate-600';

                    const isTotal = d.type === 'total';

                    return (
                        <div key={idx} className="flex flex-col items-center relative w-32 h-full justify-end group">
                            {/* Connector Line (Bridge) */}
                            {idx > 0 && d.type !== 'total' && (
                                <div
                                    className="absolute -left-[50%] w-full border-t border-slate-300 border-dashed"
                                    style={{ bottom: `${(chartData[idx - 1].end / maxVal) * 100}%` }}
                                />
                            )}

                            {/* Value Label */}
                            <div
                                className="font-bold text-lg mb-1"
                                style={{
                                    marginBottom: `${barBottom + barHeight + 2}%`,
                                    position: 'absolute',
                                    bottom: 0
                                }}
                            >
                                {isTotal ? `$${d.end}` : (d.change > 0 ? `+${d.change}` : d.change)}
                            </div>

                            {/* Bar */}
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${barHeight}%` }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className={clsx("w-full shadow-sm rounded-sm relative z-10", barColor)}
                                style={{
                                    position: 'absolute',
                                    bottom: `${barBottom}%`
                                }}
                            />

                            {/* X-Axis Label */}
                            <div className="absolute bottom-[-40px] text-center w-full">
                                <div className="text-xs font-semibold text-slate-600 leading-tight">
                                    {d.label}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </ConsultingLayout>
    );
};
