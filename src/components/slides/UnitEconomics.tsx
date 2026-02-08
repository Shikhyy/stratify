import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { THEME } from '../../context/DeckContext';

interface UnitEconomicsProps {
    cac: number;
    ltv: number;
    ratio: number;
}

export const UnitEconomics: React.FC<UnitEconomicsProps> = ({ cac, ltv, ratio }) => {
    const isHealthy = ratio >= 3;

    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full h-full bg-white text-slate-900 flex flex-col p-8 items-center justify-center relative"
        >
            <h3 className="absolute top-8 left-8 text-2xl font-bold" style={{ color: THEME.secondary }}>Unit Economics</h3>

            <div className="flex items-center gap-12">
                {/* CAC Node */}
                <div className="flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-64 h-64 rounded-full border-4 flex items-center justify-center bg-slate-50 shadow-xl"
                        style={{ borderColor: THEME.secondary }}
                    >
                        <div className="text-center">
                            <div className="text-sm uppercase tracking-widest text-slate-500 mb-2">CAC</div>
                            <div className="text-5xl font-bold text-slate-900">${cac}</div>
                        </div>
                    </motion.div>
                </div>

                {/* Arrow */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-slate-300"
                >
                    <ArrowRight size={64} />
                </motion.div>

                {/* LTV Node */}
                <div className="flex flex-col items-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-64 h-64 rounded-full flex items-center justify-center shadow-xl text-white"
                        style={{ backgroundColor: THEME.primary }}
                    >
                        <div className="text-center">
                            <div className="text-sm uppercase tracking-widest text-white/80 mb-2">LTV</div>
                            <div className="text-5xl font-bold">${ltv}</div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Ratio Indicator */}
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className={`mt-12 flex items-center gap-4 px-8 py-4 rounded-full border-2 ${isHealthy ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700'}`}
            >
                {isHealthy ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                <div className="flex flex-col">
                    <span className="text-2xl font-bold">LTV:CAC = {ratio}x</span>
                    <span className="text-sm uppercase font-semibold">{isHealthy ? 'Healthy Growth Engine' : 'Efficiency Warning'}</span>
                </div>
            </motion.div>

        </motion.div>
    );
};
