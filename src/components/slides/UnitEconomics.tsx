import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { THEME } from '../../context/DeckContext';
import { useTheme } from '../../context/ThemeContext';

interface UnitEconomicsProps {
    cac: number;
    ltv: number;
    ratio: number;
}

export const UnitEconomics: React.FC<UnitEconomicsProps> = ({ cac, ltv, ratio }) => {
    const { isDark } = useTheme();
    const isHealthy = ratio >= 3;

    return (
        <div
            className={`w-full h-full flex flex-col p-8 items-center justify-center relative ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
        >
            <h3 className="absolute top-8 left-8 text-2xl font-bold" style={{ color: THEME.secondary }}>Unit Economics</h3>

            <div className="flex items-center gap-12">
                {/* CAC Node */}
                <div className="flex flex-col items-center">
                    <div
                        className={`w-64 h-64 rounded-full border-4 flex items-center justify-center shadow-lg ${isDark ? 'bg-slate-800' : 'bg-slate-50'}`}
                        style={{ borderColor: THEME.secondary }}
                    >
                        <div className="text-center">
                            <div className={`text-sm uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>CAC</div>
                            <div className={`text-5xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>${cac}</div>
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div
                    className={isDark ? "text-slate-600" : "text-slate-400"}
                >
                    <ArrowRight size={64} />
                </div>

                {/* LTV Node */}
                <div className="flex flex-col items-center">
                    <div
                        className="w-64 h-64 rounded-full flex items-center justify-center shadow-lg text-white"
                        style={{ backgroundColor: THEME.primary }}
                    >
                        <div className="text-center">
                            <div className="text-sm uppercase tracking-widest text-white/80 mb-2">LTV</div>
                            <div className="text-5xl font-bold">${ltv}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ratio Indicator */}
            <div
                className={`mt-12 flex items-center gap-4 px-8 py-4 rounded-full border-2 ${
                    isHealthy
                        ? isDark ? 'border-green-600 bg-green-500/20 text-green-300' : 'border-green-400 bg-green-50 text-green-700'
                        : isDark ? 'border-red-600 bg-red-500/20 text-red-300' : 'border-red-400 bg-red-50 text-red-700'
                }`}
            >
                {isHealthy ? <CheckCircle size={32} /> : <AlertTriangle size={32} />}
                <div className="flex flex-col">
                    <span className="text-2xl font-bold">LTV:CAC = {ratio}x</span>
                    <span className="text-sm uppercase font-semibold">{isHealthy ? 'Healthy Growth Engine' : 'Efficiency Warning'}</span>
                </div>
            </div>

        </div>
    );
};
