import React from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { THEME } from '../../context/DeckContext';
import { useTheme } from '../../context/ThemeContext';

interface FinancialProjectionsProps {
    years: string[];
    revenue: number[];
    ebitda: number[];
}

export const FinancialProjections: React.FC<FinancialProjectionsProps> = ({ years, revenue, ebitda }) => {
    const { isDark } = useTheme();
    const data = years.map((year, i) => ({
        name: year,
        revenue: revenue[i],
        ebitda: ebitda[i]
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={`border p-3 rounded shadow ${isDark ? 'bg-slate-900 border-white/20 text-slate-200' : 'bg-white border-slate-200 text-slate-800'}`}>
                    <p className={`font-semibold mb-1 text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{label}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Revenue: ${payload[0].value}M</p>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>EBITDA: {payload[1].value}%</p>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`w-full h-full flex flex-col p-8 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
        >
            <h3 className={`text-xl font-semibold mb-4 ${isDark ? 'text-white' : 'text-slate-800'}`}>Financial Projections (5-Year)</h3>

            <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#334155' : '#e2e8f0'} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} />
                        <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', fill: isDark ? '#94a3b8' : '#6B7280' }} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#94a3b8' : '#64748b' }} label={{ value: 'EBITDA %', angle: 90, position: 'insideRight', fill: isDark ? '#94a3b8' : '#6B7280' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '12px' }} />
                        <Bar yAxisId="left" dataKey="revenue" barSize={56} fill={THEME.primary} radius={[3, 3, 0, 0]} name="Revenue ($M)" />
                        <Line yAxisId="right" type="monotone" dataKey="ebitda" stroke={isDark ? '#94a3b8' : '#334155'} strokeWidth={3} dot={{ r: 4, fill: isDark ? '#94a3b8' : '#334155' }} name="EBITDA Margin" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
