import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';
import type { CaseInput } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { useTheme } from '../context/ThemeContext';
import { GlowingEffect } from './ui/glowing-effect';

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
                    <div className="relative rounded-lg">
                        <GlowingEffect
                            spread={22}
                            glow={true}
                            disabled={false}
                            proximity={45}
                            inactiveZone={0.45}
                            borderWidth={1}
                        />
                        <select
                            value={''}
                            onChange={e => handleLibrarySelect(e.target.value)}
                            className={`relative z-10 w-full border rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
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
                </div>
            )}

            <div className="space-y-4 flex-1">
                {/* Case Title */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Case Title
                    </label>
                    <div className="relative rounded-lg">
                        <GlowingEffect
                            spread={22}
                            glow={true}
                            disabled={false}
                            proximity={45}
                            inactiveZone={0.45}
                            borderWidth={1}
                        />
                        <input
                            type="text"
                            value={localInput.caseTitle}
                            onChange={e => handleChange('caseTitle', e.target.value)}
                            placeholder="e.g., Amazon Same-Day Delivery Expansion"
                            className={`relative z-10 w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                        />
                    </div>
                </div>

                {/* Problem Statement */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Problem Statement
                    </label>
                    <div className="relative rounded-lg">
                        <GlowingEffect
                            spread={24}
                            glow={true}
                            disabled={false}
                            proximity={50}
                            inactiveZone={0.4}
                            borderWidth={1}
                        />
                        <textarea
                            value={localInput.problemStatement}
                            onChange={e => handleChange('problemStatement', e.target.value)}
                            placeholder="Describe the core problem and context..."
                            rows={4}
                            className={`relative z-10 w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                        />
                    </div>
                </div>

                {/* Constraints */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Constraints
                    </label>
                    <div className="relative rounded-lg">
                        <GlowingEffect
                            spread={24}
                            glow={true}
                            disabled={false}
                            proximity={50}
                            inactiveZone={0.4}
                            borderWidth={1}
                        />
                        <textarea
                            value={localInput.constraints}
                            onChange={e => handleChange('constraints', e.target.value)}
                            placeholder="Budget, timeline, regulatory, etc."
                            rows={2}
                            className={`relative z-10 w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                        />
                    </div>
                </div>

                {/* Target Metric */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Target Metric
                    </label>
                    <div className="relative rounded-lg">
                        <GlowingEffect
                            spread={22}
                            glow={true}
                            disabled={false}
                            proximity={45}
                            inactiveZone={0.45}
                            borderWidth={1}
                        />
                        <input
                            type="text"
                            value={localInput.targetMetric}
                            onChange={e => handleChange('targetMetric', e.target.value)}
                            placeholder="e.g., Increase delivery speed by 50%"
                            className={`relative z-10 w-full border rounded-lg px-3 py-2 text-sm placeholder-slate-500 focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                        />
                    </div>
                </div>

                {/* Industry */}
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Industry
                    </label>
                    <div className="relative rounded-lg">
                        <GlowingEffect
                            spread={22}
                            glow={true}
                            disabled={false}
                            proximity={45}
                            inactiveZone={0.45}
                            borderWidth={1}
                        />
                        <select
                            value={localInput.industry}
                            onChange={e => handleChange('industry', e.target.value)}
                            className={`relative z-10 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/50 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                        >
                            <option value="">Select Industry</option>
                            <option value="tech">Technology</option>
                            <option value="retail">Retail</option>
                            <option value="finance">Finance</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="manufacturing">Manufacturing</option>
                            <option value="logistics">Logistics & Supply Chain</option>
                            <option value="consulting">Consulting</option>
                            <option value="education">Education</option>
                            <option value="realestate">Real Estate</option>
                            <option value="energy">Energy & Utilities</option>
                            <option value="hospitality">Hospitality & Travel</option>
                            <option value="telecom">Telecommunications</option>
                            <option value="automotive">Automotive</option>
                            <option value="pharma">Pharmaceuticals</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Generate Button */}
            <button
                onClick={handleSubmit}
                disabled={isGenerating || !localInput.caseTitle || !localInput.problemStatement}
                className="relative w-full mt-6 py-3 bg-primary text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden"
            >
                <GlowingEffect
                    spread={34}
                    glow={true}
                    disabled={false}
                    proximity={60}
                    inactiveZone={0.2}
                    borderWidth={1.5}
                />
                {isGenerating ? (
                    <span className="relative z-10 flex items-center gap-2">
                        <div className="animate-spin">⚡</div>
                        Generating...
                    </span>
                ) : (
                    <span className="relative z-10 flex items-center gap-2">
                        <Sparkles size={16} />
                        Generate Pitch
                    </span>
                )}
            </button>
        </div>
    );
};
