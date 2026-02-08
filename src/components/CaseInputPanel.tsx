import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { CaseInput } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { useTheme } from '../context/ThemeContext';

export const CaseInputPanel: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => {
    const { isDark } = useTheme();
    const { caseInput, setCaseInput, isGenerating } = usePitch();
    const [localInput, setLocalInput] = useState<CaseInput>(
        caseInput || {
            caseTitle: '',
            problemStatement: '',
            constraints: '',
            targetMetric: '',
            industry: '',
        }
    );
    const [caseLibrary, setCaseLibrary] = useState<CaseInput[]>([]);

    useEffect(() => {
        if (caseInput) {
            setLocalInput(caseInput);
        }
    }, [caseInput]);

    useEffect(() => {
        const stored = localStorage.getItem('stratify.caseLibrary');
        if (stored) {
            try {
                const parsed = JSON.parse(stored) as CaseInput[];
                setCaseLibrary(parsed);
            } catch {
                setCaseLibrary([]);
            }
        }
    }, []);

    const handleChange = (field: keyof CaseInput, value: string) => {
        setLocalInput(prev => ({ ...prev, [field]: value }));
    };

    const saveCaseToLibrary = (input: CaseInput) => {
        const next = [
            input,
            ...caseLibrary.filter(c => c.caseTitle !== input.caseTitle || c.problemStatement !== input.problemStatement)
        ].slice(0, 8);

        setCaseLibrary(next);
        localStorage.setItem('stratify.caseLibrary', JSON.stringify(next));
    };

    const handleLibrarySelect = (value: string) => {
        const selected = caseLibrary.find(c => `${c.caseTitle}::${c.targetMetric}` === value);
        if (selected) {
            setLocalInput(selected);
        }
    };

    const handleSubmit = () => {
        if (
            localInput.caseTitle &&
            localInput.problemStatement &&
            localInput.targetMetric
        ) {
            saveCaseToLibrary(localInput);
            setCaseInput(localInput);
            onGenerate();
        }
    };

    return (
        <div
            className={`h-full border-r p-6 overflow-y-auto flex flex-col ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-white/10' : 'bg-white border-slate-200'}`}
        >
            <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <div className="w-2 h-2 rounded-full bg-primary" />
                Case Inputs
            </h2>

            {caseLibrary.length > 0 && (
                <div className="mb-6">
                    <label className={`block text-[10px] font-semibold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Case Library
                    </label>
                    <select
                        value={''}
                        onChange={e => handleLibrarySelect(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    >
                        <option value="">Load a saved case</option>
                        {caseLibrary.map((entry) => (
                            <option
                                key={`${entry.caseTitle}-${entry.targetMetric}`}
                                value={`${entry.caseTitle}::${entry.targetMetric}`}
                            >
                                {entry.caseTitle} - {entry.targetMetric}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div className="space-y-4 flex-1">
                {/* Case Title */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Case Title
                    </label>
                    <input
                        type="text"
                        value={localInput.caseTitle}
                        onChange={e => handleChange('caseTitle', e.target.value)}
                        placeholder="e.g., Amazon Same-Day Delivery Expansion"
                        className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                </div>

                {/* Problem Statement */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Problem Statement
                    </label>
                    <textarea
                        value={localInput.problemStatement}
                        onChange={e => handleChange('problemStatement', e.target.value)}
                        placeholder="Describe the core problem and context..."
                        rows={4}
                        className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                </div>

                {/* Constraints */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Constraints
                    </label>
                    <textarea
                        value={localInput.constraints}
                        onChange={e => handleChange('constraints', e.target.value)}
                        placeholder="Budget, timeline, regulatory, etc."
                        rows={2}
                        className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                </div>

                {/* Target Metric */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Target Metric
                    </label>
                    <input
                        type="text"
                        value={localInput.targetMetric}
                        onChange={e => handleChange('targetMetric', e.target.value)}
                        placeholder="e.g., Increase delivery speed by 50%"
                        className={`w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    />
                </div>

                {/* Industry */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Industry
                    </label>
                    <select
                        value={localInput.industry}
                        onChange={e => handleChange('industry', e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                    >
                        <option value="">Select Industry</option>
                        <option value="tech">Technology</option>
                        <option value="retail">Retail</option>
                        <option value="finance">Finance</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={handleSubmit}
                disabled={isGenerating || !localInput.caseTitle || !localInput.problemStatement}
                className="w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isGenerating ? (
                    <>
                        <div className="animate-spin">⚡</div>
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles size={16} />
                        Generate Pitch
                    </>
                )}
            </button>
        </div>
    );
};
