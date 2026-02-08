import React, { useState } from 'react';
import { Lock, Unlock, RefreshCw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { PitchBlock } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { validateBlock } from '../utils/consultingRules';
import { useTheme } from '../context/ThemeContext';
import { THEME } from '../context/DeckContext';

interface PitchBlockProps {
    block: PitchBlock;
    problemStatement?: string;
    onRegenerate: (blockId: string, instruction: string) => Promise<void>;
}

const BLOCK_TITLES: Record<string, string> = {
    problem: 'Problem Definition',
    recommendation: 'Our Recommendation',
    insight: 'Core Insight',
    pillar: 'Strategy Pillar',
    financial: 'Financial Impact',
    roadmap: 'Implementation Roadmap',
    risks: 'Risks & Mitigations',
    impact: 'Final Impact Statement',
};

const CONSULTANT_BUTTONS = [
    { label: 'Make Aggressive', instruction: 'Make this more bold and assertive' },
    { label: 'Add Rigor', instruction: 'Add data and specific numbers' },
    { label: 'Judge-Friendly', instruction: 'Optimize for case competition judge evaluation' },
    { label: 'Simplify', instruction: 'Make this concise and clear (max 3 ideas)' },
];

export const PitchBlockComponent: React.FC<PitchBlockProps> = ({
    block,
    problemStatement,
    onRegenerate,
}) => {
    const { isDark } = useTheme();
    const { updateBlock, lockBlock, deleteBlock } = usePitch();
    const [isExpanded, setIsExpanded] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(block.content);
    const [selectedInstruction, setSelectedInstruction] = useState<string | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    const validation = validateBlock(block.content, block.type, problemStatement);

    const handleSave = () => {
        updateBlock(block.id, editContent);
        setIsEditing(false);
    };

    const handleRegenerate = async (instruction: string) => {
        setSelectedInstruction(instruction);
        setIsRegenerating(true);
        try {
            await onRegenerate(block.id, instruction);
        } finally {
            setIsRegenerating(false);
            setSelectedInstruction(null);
        }
    };

    return (
        <div
            className={`mb-4 border rounded-xl overflow-hidden ${isDark ? 'border-white/10 bg-white/5 backdrop-blur-sm' : 'border-slate-300 bg-slate-50'}`}
        >
            {/* Header */}
            <div className={`p-4 border-b flex items-center justify-between cursor-pointer transition-colors ${isDark ? 'bg-gradient-to-r from-white/5 to-transparent border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: THEME.primary }}
                    />
                    <div>
                        <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {BLOCK_TITLES[block.type]}
                        </h3>
                        <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            {block.content.substring(0, 60)}...
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {validation.errors.length > 0 && (
                        <div className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-700'}`}>
                            {validation.errors.length} error
                        </div>
                    )}
                    {validation.warnings.length > 0 && (
                        <div className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700'}`}>
                            {validation.warnings.length} warning
                        </div>
                    )}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            lockBlock(block.id);
                        }}
                        className={`p-1 rounded transition-colors ${isDark ? 'hover:bg-white/10 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-900'}`}
                    >
                        {block.locked ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className={`p-1 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <div
                    className={`p-4 space-y-4 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}
                >
                    {/* Edit Mode */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none ${isDark ? 'bg-white/5 border-primary/30 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'}`}
                                rows={4}
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSave}
                                    className="px-3 py-1 bg-primary text-white text-xs font-semibold rounded hover:opacity-90 transition-opacity"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={() => {
                                        setEditContent(block.content);
                                        setIsEditing(false);
                                    }}
                                    className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${isDark ? 'bg-white/10 text-slate-300 hover:bg-white/20' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Content Display */}
                            <div className={`prose max-w-none text-sm rounded-lg p-3 border ${isDark ? 'prose-invert text-slate-200 bg-white/5 border-white/10' : 'text-slate-700 bg-white border-slate-200'}`}>
                                {block.content}
                            </div>

                            {/* Validation Feedback */}
                            {validation.errors.length > 0 && (
                                <div className={`rounded-lg border p-3 ${isDark ? 'bg-red-500/10 border-red-500/30' : 'bg-red-50 border-red-200'}`}>
                                    <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-red-300' : 'text-red-800'}`}>Errors:</p>
                                    <ul className={`text-xs space-y-1 ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                                        {validation.errors.map((err, i) => (
                                            <li key={i}>• {err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {validation.warnings.length > 0 && (
                                <div className={`rounded-lg border p-3 ${isDark ? 'bg-yellow-500/10 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'}`}>
                                    <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-yellow-300' : 'text-yellow-800'}`}>Suggestions:</p>
                                    <ul className={`text-xs space-y-1 ${isDark ? 'text-yellow-200' : 'text-yellow-700'}`}>
                                        {validation.warnings.map((warn, i) => (
                                            <li key={i}>• {warn}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Consultant Buttons */}
                            {!block.locked && (
                                <div className="grid grid-cols-2 gap-2">
                                    {CONSULTANT_BUTTONS.map(btn => (
                                        <button
                                            key={btn.label}
                                            onClick={() => handleRegenerate(btn.instruction)}
                                            disabled={isRegenerating}
                                            className={`px-3 py-2 text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1 ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
                                        >
                                            {isRegenerating && selectedInstruction === btn.instruction ? (
                                                <div className="animate-spin">⚡</div>
                                            ) : (
                                                <RefreshCw size={12} />
                                            )}
                                            {btn.label}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className={`flex gap-2 pt-2 border-t ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    disabled={block.locked}
                                    className="flex-1 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteBlock(block.id)}
                                    className={`flex-1 px-3 py-1 text-xs font-semibold rounded transition-colors ${isDark ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}
                                >
                                    <Trash2 size={12} className="inline mr-1" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}

                    {/* Version History */}
                    {block.versions.length > 0 && (
                        <div className={`text-xs pt-2 border-t ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-600 border-slate-200'}`}>
                            {block.versions.length} prior version(s)
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
