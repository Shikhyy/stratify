import React from 'react';
import { motion } from 'framer-motion';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { THEME } from '../../context/DeckContext';

interface FinancialProjectionsProps {
    years: string[];
    revenue: number[];
    ebitda: number[];
}

export const FinancialProjections: React.FC<FinancialProjectionsProps> = ({ years, revenue, ebitda }) => {
    const data = years.map((year, i) => ({
        name: year,
        revenue: revenue[i],
        ebitda: ebitda[i]
    }));

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 border border-slate-700 p-4 rounded shadow-xl text-white">
                    <p className="font-bold mb-2">{label}</p>
                    <p style={{ color: THEME.secondary }}>Revenue: ${payload[0].value}M</p>
                    <p style={{ color: THEME.primary }}>EBITDA: {payload[1].value}%</p>
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
            className="w-full h-full bg-white text-slate-900 flex flex-col p-8"
        >
            <h3 className="text-2xl font-bold mb-4" style={{ color: THEME.secondary }}>Financial Projections (5-Year)</h3>

            <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                        data={data}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                        <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} label={{ value: 'Revenue ($M)', angle: -90, position: 'insideLeft', fill: THEME.secondary }} />
                        <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} label={{ value: 'EBITDA %', angle: 90, position: 'insideRight', fill: THEME.primary }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Bar yAxisId="left" dataKey="revenue" barSize={60} fill={THEME.secondary} radius={[4, 4, 0, 0]} name="Revenue ($M)" />
                        <Line yAxisId="right" type="monotone" dataKey="ebitda" stroke={THEME.primary} strokeWidth={4} dot={{ r: 6, fill: THEME.primary }} name="EBITDA Margin" />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
