import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, RefreshCw, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import type { PitchBlock } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { validateBlock } from '../utils/consultingRules';
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
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 border border-white/10 rounded-xl bg-white/5 backdrop-blur-sm overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-white/5 to-transparent border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-3 flex-1">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: THEME.primary }}
                    />
                    <div>
                        <h3 className="font-bold text-white text-sm">
                            {BLOCK_TITLES[block.type]}
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                            {block.content.substring(0, 60)}...
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {validation.errors.length > 0 && (
                        <div className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded">
                            {validation.errors.length} error
                        </div>
                    )}
                    {validation.warnings.length > 0 && (
                        <div className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-300 rounded">
                            {validation.warnings.length} warning
                        </div>
                    )}
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            lockBlock(block.id);
                        }}
                        className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors"
                    >
                        {block.locked ? <Lock size={16} /> : <Unlock size={16} />}
                    </button>
                    <button
                        onClick={e => {
                            e.stopPropagation();
                            setIsExpanded(!isExpanded);
                        }}
                        className="p-1 text-slate-400 hover:text-white transition-colors"
                    >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-4 space-y-4 border-t border-white/10"
                >
                    {/* Edit Mode */}
                    {isEditing ? (
                        <div className="space-y-2">
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full bg-white/5 border border-primary/30 rounded-lg px-3 py-2 text-sm text-white focus:outline-none resize-none"
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
                                    className="px-3 py-1 bg-white/10 text-slate-300 text-xs font-semibold rounded hover:bg-white/20 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Content Display */}
                            <div className="prose prose-invert max-w-none text-sm text-slate-200 bg-white/5 rounded-lg p-3">
                                {block.content}
                            </div>

                            {/* Validation Feedback */}
                            {validation.errors.length > 0 && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-red-300 mb-1">Errors:</p>
                                    <ul className="text-xs text-red-200 space-y-1">
                                        {validation.errors.map((err, i) => (
                                            <li key={i}>• {err}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {validation.warnings.length > 0 && (
                                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                                    <p className="text-xs font-semibold text-yellow-300 mb-1">Suggestions:</p>
                                    <ul className="text-xs text-yellow-200 space-y-1">
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
                                            className="px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
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
                            <div className="flex gap-2 pt-2 border-t border-white/10">
                                <button
                                    onClick={() => setIsEditing(true)}
                                    disabled={block.locked}
                                    className="flex-1 px-3 py-1 bg-primary/20 hover:bg-primary/30 text-primary text-xs font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteBlock(block.id)}
                                    className="flex-1 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold rounded transition-colors"
                                >
                                    <Trash2 size={12} className="inline mr-1" />
                                    Delete
                                </button>
                            </div>
                        </>
                    )}

                    {/* Version History */}
                    {block.versions.length > 0 && (
                        <div className="text-xs text-slate-400 pt-2 border-t border-white/10">
                            {block.versions.length} prior version(s)
                        </div>
                    )}
                </motion.div>
            )}
        </motion.div>
    );
};
