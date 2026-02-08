import React from 'react';
import { motion } from 'framer-motion';
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
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className={`w-full h-full flex flex-col p-8 ${isDark ? 'bg-slate-900/30' : 'bg-white'}`}
        >
            <h3 className={`text-2xl font-bold mb-8 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Market Opportunity Waterfall</h3>

            <div className="flex-1 flex items-end justify-center gap-16 pb-12">
                {[
                    { label: 'TAM', value: tam, color: '#1e3a8a', sub: 'Total Addressable Market' },
                    { label: 'SAM', value: sam, color: '#3b82f6', sub: 'Serviceable Available Market' },
                    { label: 'SOM', value: som, color: '#60a5fa', sub: 'Serviceable Obtainable Market' }
                ].map((item, idx) => (
                    <div key={item.label} className="flex flex-col items-center group relative">
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.15, duration: 0.5 }}
                            className={`mb-3 text-lg font-semibold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}
                        >
                            {formatMoney(item.value)}
                        </motion.div>
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${(item.value / max) * 100}%` }}
                            transition={{ delay: 0.1 + idx * 0.15, duration: 0.8 }}
                            whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                            className="w-28 rounded-t-md relative shadow-md hover:shadow-lg transition-shadow"
                            style={{ backgroundColor: item.color, minHeight: '20px' }}
                        >
                            {/* Tooltip on hover */}
                            <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none font-medium ${
                                isDark ? 'bg-slate-700 text-slate-100' : 'bg-slate-800 text-white'
                            }`}>
                                {formatMoney(item.value)}
                            </div>
                        </motion.div>
                        <div className="mt-4 text-center">
                            <div className={`text-xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{item.label}</div>
                            <div className={`text-xs uppercase tracking-wide font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{item.sub}</div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
