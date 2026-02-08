import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PitchBlockComponent } from './PitchBlock';
import { usePitch } from '../context/PitchContext';
import { Sparkles } from 'lucide-react';

interface PitchWorkspaceProps {
    onRegenerate: (blockId: string, instruction: string) => Promise<void>;
}

export const PitchWorkspace: React.FC<PitchWorkspaceProps> = ({ onRegenerate }) => {
    const { blocks, caseInput } = usePitch();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full bg-slate-950 p-6 overflow-y-auto flex flex-col"
        >
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-2">
                    <Sparkles size={24} className="text-primary" />
                    {caseInput?.caseTitle || 'Pitch Workspace'}
                </h2>
                <p className="text-sm text-slate-400">
                    {blocks.length === 0
                        ? 'Generate a pitch to see blocks here'
                        : `${blocks.length} sections • Click to expand • Edit or regenerate`}
                </p>
            </div>

            {/* Empty State */}
            {blocks.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary to-magenta rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="text-white w-8 h-8" />
                        </div>
                        <p className="text-slate-400 text-sm">
                            Your consulting-grade pitch blocks will appear here once you generate.
                        </p>
                    </div>
                </div>
            ) : (
                /* Blocks List */
                <div className="space-y-4">
                    <AnimatePresence>
                        {blocks.map(block => (
                            <PitchBlockComponent
                                key={block.id}
                                block={block}
                                problemStatement={caseInput?.problemStatement}
                                onRegenerate={onRegenerate}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};
