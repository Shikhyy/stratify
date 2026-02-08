import React from 'react';
import { ConsultingLayout, type Section } from '../layout/ConsultingLayout';
import { clsx } from 'clsx';
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
            <div className="w-full h-full flex items-center justify-center px-8 pb-16 pt-8">
                <div className="w-full h-full flex items-end justify-center gap-6">
                    {chartData.map((d, idx) => {
                        const barBottom = (Math.min(d.start, d.end) / maxVal) * 60 + 10; // Scale to 60% of height, offset by 10%
                        const barHeight = (Math.abs(d.end - d.start) / maxVal) * 60;

                        let barColor = 'bg-slate-500';
                        if (d.type === 'plus') barColor = 'bg-emerald-600';
                        if (d.type === 'minus') barColor = 'bg-rose-600';
                        if (d.type === 'total') barColor = 'bg-slate-700';

                        const isTotal = d.type === 'total' || d.type === 'subtotal';
                        const displayValue = isTotal ? formatValue(d.end) : `${d.change > 0 ? '+' : ''}${formatValue(d.change)}`;

                        return (
                            <div key={idx} className="relative flex-1 h-full flex flex-col justify-end items-center max-w-[140px]">
                                {/* Connector Line (Bridge) */}
                                {idx > 0 && d.type !== 'total' && d.type !== 'subtotal' && (
                                    <div
                                        className={`absolute left-[-50%] w-[100%] border-t border-dashed ${isDark ? 'border-white/20' : 'border-slate-300'}`}
                                        style={{ bottom: `${(chartData[idx - 1].end / maxVal) * 60 + 10}%` }}
                                    />
                                )}

                                {/* Value Label Above Bar */}
                                <div className={`text-sm font-semibold mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    {displayValue}
                                </div>

                                {/* Bar Container */}
                                <div className="relative w-full" style={{ height: '60%' }}>
                                    {/* Bar */}
                                    <div
                                        className={clsx("w-full rounded-t-sm relative", barColor)}
                                        style={{
                                            position: 'absolute',
                                            bottom: `${barBottom}%`,
                                            height: `${barHeight}%`
                                        }}
                                    />
                                </div>

                                {/* X-Axis Label */}
                                <div className="mt-4 text-center w-full">
                                    <div className={`text-[11px] font-semibold leading-tight px-1 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
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
