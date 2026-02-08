import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import type { CaseInput } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';

export const CaseInputPanel: React.FC<{ onGenerate: () => void }> = ({ onGenerate }) => {
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

    useEffect(() => {
        if (caseInput) {
            setLocalInput(caseInput);
        }
    }, [caseInput]);

    const handleChange = (field: keyof CaseInput, value: string) => {
        setLocalInput(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        if (
            localInput.caseTitle &&
            localInput.problemStatement &&
            localInput.targetMetric
        ) {
            setCaseInput(localInput);
            onGenerate();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-full bg-gradient-to-b from-slate-900 to-slate-950 border-r border-white/10 p-6 overflow-y-auto flex flex-col"
        >
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Case Inputs
            </h2>

            <div className="space-y-4 flex-1">
                {/* Case Title */}
                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                        Case Title
                    </label>
                    <input
                        type="text"
                        value={localInput.caseTitle}
                        onChange={e => handleChange('caseTitle', e.target.value)}
                        placeholder="e.g., Amazon Same-Day Delivery Expansion"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
                    />
                </div>

                {/* Problem Statement */}
                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                        Problem Statement
                    </label>
                    <textarea
                        value={localInput.problemStatement}
                        onChange={e => handleChange('problemStatement', e.target.value)}
                        placeholder="Describe the core problem and context..."
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none"
                    />
                </div>

                {/* Constraints */}
                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                        Constraints
                    </label>
                    <textarea
                        value={localInput.constraints}
                        onChange={e => handleChange('constraints', e.target.value)}
                        placeholder="Budget, timeline, regulatory, etc."
                        rows={2}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 resize-none"
                    />
                </div>

                {/* Target Metric */}
                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                        Target Metric
                    </label>
                    <input
                        type="text"
                        value={localInput.targetMetric}
                        onChange={e => handleChange('targetMetric', e.target.value)}
                        placeholder="e.g., Increase delivery speed by 50%"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary/50"
                    />
                </div>

                {/* Industry */}
                <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wide mb-2">
                        Industry
                    </label>
                    <select
                        value={localInput.industry}
                        onChange={e => handleChange('industry', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary/50"
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
                className="w-full mt-6 py-3 bg-gradient-to-r from-primary to-magenta text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
        </motion.div>
    );
};
