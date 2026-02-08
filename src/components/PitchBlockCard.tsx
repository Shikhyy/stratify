import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit2, Trash2, Lock, Unlock, ChevronDown, Check, X, Zap } from 'lucide-react';
import type { PitchBlock } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { useTheme } from '../context/ThemeContext';
import { GlowingEffect } from './ui/glowing-effect';

interface PitchBlockCardProps {
    block: PitchBlock;
    index: number;
}

export const PitchBlockCard: React.FC<PitchBlockCardProps> = ({ block, index }) => {
    const { isDark } = useTheme();
    const { updateBlock, deleteBlock, lockBlock, regenerateBlock } = usePitch();
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(block.content);
    const [isRefining, setIsRefining] = useState(false);
    const [showVersion, setShowVersion] = useState(false);

    const handleSave = () => {
        if (editValue.trim()) {
            updateBlock(block.id, editValue);
            setIsEditing(false);
        }
    };

    const handleRefine = async () => {
        setIsRefining(true);
        try {
            await regenerateBlock(block.id, 'Improve clarity, add specific metrics, and make more compelling');
        } finally {
            setIsRefining(false);
        }
    };

    const typeColors: Record<string, string> = {
        problem: 'from-red-500/20 to-red-600/10',
        recommendation: 'from-blue-500/20 to-blue-600/10',
        insight: 'from-purple-500/20 to-purple-600/10',
        pillar: 'from-cyan-500/20 to-cyan-600/10',
        financial: 'from-green-500/20 to-green-600/10',
        roadmap: 'from-amber-500/20 to-amber-600/10',
        risks: 'from-orange-500/20 to-orange-600/10',
        impact: 'from-magenta-500/20 to-magenta-600/10',
    };

    const typeBg = typeColors[block.type] || 'from-slate-500/20 to-slate-600/10';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className={`relative rounded-xl border overflow-hidden transition-all ${
                isDark
                    ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-white/20 shadow-lg shadow-slate-900/50 hover:border-white/30'
                    : 'bg-gradient-to-br from-white to-slate-50 border-slate-200 shadow-lg shadow-slate-200/50 hover:border-slate-300'
            }`}
        >
            <div className={`absolute inset-0 bg-gradient-to-r ${typeBg} pointer-events-none opacity-40`} />

            <div className="relative z-10 p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                                isDark ? 'bg-white/10 text-slate-300' : 'bg-slate-200 text-slate-700'
                            }`}>
                                {block.type}
                            </span>
                            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                #<span className="font-bold text-primary">{index + 1}</span>
                            </span>
                        </div>
                        <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {block.title}
                        </h4>
                    </div>
                    <button
                        onClick={() => lockBlock(block.id)}
                        className={`relative p-1.5 rounded-lg transition-colors ${
                            block.locked
                                ? 'text-amber-500'
                                : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={block.locked ? 'Locked' : 'Unlocked'}
                    >
                        <GlowingEffect
                            spread={16}
                            glow={false}
                            disabled={false}
                            proximity={25}
                            inactiveZone={0.4}
                            borderWidth={0.5}
                        />
                        <span className="relative z-10">
                            {block.locked ? <Lock size={14} /> : <Unlock size={14} />}
                        </span>
                    </button>
                </div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {isEditing ? (
                        <motion.div
                            key="edit"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className={`w-full text-xs rounded-lg border p-2 resize-none focus:outline-none focus:ring-2 focus:ring-primary ${
                                    isDark
                                        ? 'bg-slate-900 border-white/20 text-white placeholder-slate-500'
                                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                                }`}
                                rows={4}
                                autoFocus
                            />
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={handleSave}
                                    className="relative flex-1 px-3 py-1.5 bg-primary text-white text-xs font-semibold rounded-lg hover:shadow-lg transition-all overflow-hidden"
                                >
                                    <GlowingEffect
                                        spread={20}
                                        glow={true}
                                        disabled={false}
                                        proximity={32}
                                        inactiveZone={0.35}
                                        borderWidth={1}
                                    />
                                    <span className="relative z-10 flex items-center justify-center gap-1">
                                        <Check size={12} />
                                        Save
                                    </span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsEditing(false);
                                        setEditValue(block.content);
                                    }}
                                    className={`relative flex-1 px-3 py-1.5 border text-xs font-semibold rounded-lg transition-colors overflow-hidden ${
                                        isDark ? 'bg-white/5 border-white/20 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                                    }`}
                                >
                                    <GlowingEffect
                                        spread={18}
                                        glow={false}
                                        disabled={false}
                                        proximity={30}
                                        inactiveZone={0.35}
                                        borderWidth={0.5}
                                    />
                                    <span className="relative z-10 flex items-center justify-center gap-1">
                                        <X size={12} />
                                        Cancel
                                    </span>
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.p
                            key="view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`text-xs leading-relaxed mb-3 line-clamp-3 ${
                                isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}
                        >
                            {block.content}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Version History */}
                {block.versions.length > 0 && !isEditing && (
                    <div className="mb-3">
                        <button
                            onClick={() => setShowVersion(!showVersion)}
                            className={`relative text-[10px] font-semibold flex items-center gap-1 ${isDark ? 'text-primary/80 hover:text-primary' : 'text-primary hover:text-primary/80'} transition-colors overflow-hidden rounded px-2 py-1`}
                        >
                            <GlowingEffect
                                spread={16}
                                glow={false}
                                disabled={false}
                                proximity={25}
                                inactiveZone={0.4}
                                borderWidth={0.5}
                            />
                            <span className="relative z-10 flex items-center gap-1">
                                <Zap size={10} />
                                {block.versions.length} Version{block.versions.length > 1 ? 's' : ''}
                                <ChevronDown size={10} className={`transition-transform ${showVersion ? 'rotate-180' : ''}`} />
                            </span>
                        </button>

                        <AnimatePresence>
                            {showVersion && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="mt-2 space-y-2 border-t border-white/5 pt-2"
                                >
                                    {block.versions.slice(-3).reverse().map((version, idx) => (
                                        <div
                                            key={version.timestamp}
                                            className={`text-[10px] leading-relaxed p-2 rounded-lg ${
                                                isDark ? 'bg-white/5 border border-white/5 text-slate-400' : 'bg-slate-100 border border-slate-300 text-slate-600'
                                            }`}
                                        >
                                            <div className={`text-[9px] mb-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                                v{block.versions.length - idx} • {new Date(version.timestamp).toLocaleTimeString()}
                                            </div>
                                            <div className="line-clamp-2">{version.content}</div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                )}

                {/* Action Buttons */}
                {!isEditing && (
                    <div className="flex gap-2 pt-2 border-t border-white/10">
                        <button
                            onClick={() => setIsEditing(true)}
                            disabled={block.locked || isRefining}
                            className={`relative flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition-all overflow-hidden disabled:opacity-50 ${
                                isDark
                                    ? 'bg-white/10 border border-white/20 text-white hover:bg-white/15'
                                    : 'bg-slate-200 border border-slate-300 text-slate-900 hover:bg-slate-300'
                            }`}
                        >
                            <GlowingEffect
                                spread={18}
                                glow={false}
                                disabled={block.locked || isRefining}
                                proximity={30}
                                inactiveZone={0.35}
                                borderWidth={0.5}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-1">
                                <Edit2 size={12} />
                                Edit
                            </span>
                        </button>

                        <button
                            onClick={handleRefine}
                            disabled={block.locked || isRefining}
                            className={`relative flex-1 px-2 py-1.5 text-xs font-semibold rounded-lg transition-all overflow-hidden disabled:opacity-50 ${
                                isDark
                                    ? 'bg-primary/20 border border-primary/50 text-primary hover:bg-primary/30'
                                    : 'bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20'
                            }`}
                        >
                            <GlowingEffect
                                spread={18}
                                glow={true}
                                disabled={block.locked || isRefining}
                                proximity={30}
                                inactiveZone={0.35}
                                borderWidth={0.5}
                            />
                            <span className="relative z-10 flex items-center justify-center gap-1">
                                {isRefining ? (
                                    <>
                                        <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                        Refining...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={12} />
                                        Refine
                                    </>
                                )}
                            </span>
                        </button>

                        <button
                            onClick={() => deleteBlock(block.id)}
                            disabled={block.locked}
                            className={`relative px-2 py-1.5 text-xs font-semibold rounded-lg transition-all overflow-hidden disabled:opacity-50 ${
                                isDark
                                    ? 'bg-red-500/20 border border-red-500/50 text-red-400 hover:bg-red-500/30'
                                    : 'bg-red-50 border border-red-300 text-red-600 hover:bg-red-100'
                            }`}
                        >
                            <GlowingEffect
                                spread={16}
                                glow={false}
                                disabled={block.locked}
                                proximity={25}
                                inactiveZone={0.35}
                                borderWidth={0.5}
                            />
                            <span className="relative z-10">
                                <Trash2 size={12} />
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
