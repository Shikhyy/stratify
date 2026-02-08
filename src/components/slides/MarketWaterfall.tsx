import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../context/DeckContext';
import { useTheme } from '../../context/ThemeContext';

interface MarketWaterfallProps {
    tam: number;
    sam: number;
    som: number;
    currency: string;
}

export const MarketWaterfall: React.FC<MarketWaterfallProps> = ({ tam, sam, som, currency }) => {
    const { isDark } = useTheme();
    const max = tam;

    const formatMoney = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency, notation: "compact" }).format(val);
    };

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`w-full h-full flex flex-col p-8 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
        >
            <h3 className="text-2xl font-bold mb-8" style={{ color: THEME.secondary }}>Market Opportunity</h3>

            <div className="flex-1 flex items-end justify-center gap-12 pb-12">
                {[
                    { label: 'TAM', value: tam, color: THEME.secondary, sub: 'Total Addressable' },
                    { label: 'SAM', value: sam, color: THEME.primary, sub: 'Serviceable Available' },
                    { label: 'SOM', value: som, color: '#10b981', sub: 'Serviceable Obtainable' } // Green for SOM usually
                ].map((item, idx) => (
                    <div key={item.label} className="flex flex-col items-center group relative">
                        <div className="mb-2 text-xl font-bold">{formatMoney(item.value)}</div>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.value / max) * 100}%` }}
                            transition={{ delay: 0.2 + idx * 0.1, duration: 1, type: "spring" }}
                            className="w-32 rounded-t-lg relative"
                            style={{ backgroundColor: item.color, minHeight: '10px' }}
                        >
                            {/* Tooltip on hover */}
                            <div className={`absolute -top-12 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 ${
                                isDark ? 'bg-white text-slate-900' : 'bg-black text-white'
                            }`}>
                                {item.sub}: {formatMoney(item.value)}
                            </div>
                        </motion.div>
                        <div className="mt-4 text-center">
                            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>{item.label}</div>
                            <div className={`text-xs uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
