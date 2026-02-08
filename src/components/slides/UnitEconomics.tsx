import React from 'react';
import { ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
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
            className={`w-full h-full flex flex-col p-8 items-center justify-center relative ${isDark ? 'bg-slate-900/30' : 'bg-white'}`}
        >
            <h3 className={`absolute top-8 left-8 text-2xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>Unit Economics</h3>

            <div className="flex items-center gap-12">
                {/* CAC Node */}
                <div className="flex flex-col items-center">
                    <div
                        className={`w-64 h-64 rounded-full border-4 flex items-center justify-center shadow-md transition-shadow duration-300 ${isDark ? 'bg-slate-800/40 border-slate-600 hover:shadow-lg hover:shadow-slate-900/50' : 'bg-slate-50 border-slate-300 hover:shadow-md hover:shadow-slate-300/30'}`}
                    >
                        <div className="text-center">
                            <div className={`text-xs uppercase tracking-widest font-semibold mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Customer Acquisition Cost</div>
                            <div className={`text-5xl font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>${cac}</div>
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div
                    className={isDark ? "text-slate-600" : "text-slate-300"}
                >
                    <ArrowRight size={56} strokeWidth={1.5} />
                </div>

                {/* LTV Node */}
                <div className="flex flex-col items-center">
                    <div
                        className="w-64 h-64 rounded-full flex items-center justify-center shadow-md transition-shadow duration-300 bg-blue-600 hover:shadow-lg hover:shadow-blue-600/50"
                    >
                        <div className="text-center">
                            <div className="text-xs uppercase tracking-widest text-white/90 font-semibold mb-2">Lifetime Value</div>
                            <div className="text-5xl font-bold text-white">${ltv}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ratio Indicator */}
            <div
                className={`mt-12 flex items-center gap-4 px-8 py-4 rounded-lg border transition-all duration-300 ${
                    isHealthy
                        ? isDark ? 'border-green-700/50 bg-green-500/10 text-green-300' : 'border-green-300 bg-green-50/80 text-green-700'
                        : isDark ? 'border-red-700/50 bg-red-500/10 text-red-300' : 'border-red-300 bg-red-50/80 text-red-700'
                }`}
            >
                {isHealthy ? <CheckCircle size={32} strokeWidth={1.5} /> : <AlertTriangle size={32} strokeWidth={1.5} />}
                <div className="flex flex-col">
                    <span className="text-2xl font-bold">LTV:CAC = {ratio}x</span>
                    <span className="text-sm font-medium">{isHealthy ? 'Healthy Growth Engine' : 'Efficiency Warning'}</span>
                </div>
            </div>

        </div>
    );
};
