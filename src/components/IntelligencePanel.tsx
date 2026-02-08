import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BarChart3, AlertCircle, BookOpen, History } from 'lucide-react';
import { usePitch } from '../context/PitchContext';
import { useTheme } from '../context/ThemeContext';

export const IntelligencePanel: React.FC = () => {
    const { isDark } = useTheme();
    const { blocks, judgeScore } = usePitch();
    const [activeTab, setActiveTab] = useState<'judge' | 'insights' | 'versions'>('judge');

    const insightBreakdown = useMemo(() => {
        const insightBlock = blocks.find(b => b.type === 'insight');
        if (!insightBlock) {
            return [
                'No insight block yet. Generate a pitch to see the reasoning.',
                'Stratify will extract 3 non-obvious insights.',
                'The strongest insight becomes the strategy anchor.',
            ];
        }

        const sentences = insightBlock.content
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(Boolean)
            .slice(0, 3);

        return sentences.length > 0
            ? sentences
            : ['Insight captured, but needs clearer articulation.'];
    }, [blocks]);

    const versionItems = useMemo(() => {
        return blocks
            .filter(block => block.versions.length > 0)
            .map(block => ({
                block,
                latest: block.versions[block.versions.length - 1],
            }));
    }, [blocks]);

    if (!judgeScore && activeTab === 'judge') {
        return (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`h-full border-l p-6 overflow-y-auto flex flex-col ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-white/10' : 'bg-white border-slate-200'}`}
            >
                <h2 className={`text-lg font-bold mb-6 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <Zap size={20} className="text-primary" />
                    Intelligence Layer
                </h2>

                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <BarChart3 className={`w-12 h-12 mx-auto mb-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Run the Judge Evaluator to see feedback and insights
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`h-full border-l p-6 overflow-y-auto flex flex-col ${isDark ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-white/10' : 'bg-white border-slate-200'}`}
        >
            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Zap size={20} className="text-primary" />
                Intelligence Layer
            </h2>

            {/* Tabs */}
            <div className={`flex gap-2 mb-6 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                <button
                    onClick={() => setActiveTab('judge')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'judge'
                            ? 'text-primary border-b-2 border-primary'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Scores
                </button>
                <button
                    onClick={() => setActiveTab('insights')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'insights'
                            ? 'text-primary border-b-2 border-primary'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Insight Breakdown
                </button>
                <button
                    onClick={() => setActiveTab('versions')}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                        activeTab === 'versions'
                            ? 'text-primary border-b-2 border-primary'
                            : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    Versions
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'judge' ? (
                    <motion.div
                        key="judge"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 flex-1"
                    >
                        {/* Overall Score */}
                        <div className="bg-gradient-to-br from-primary/20 to-magenta/20 border border-primary/30 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-semibold uppercase ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Overall Score</span>
                                <span className="text-3xl font-bold text-primary">{judgeScore?.overall ?? '-'}</span>
                            </div>
                            <div className={`w-full rounded-full h-2 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}>
                                <div
                                    className="bg-gradient-to-r from-primary to-magenta h-2 rounded-full"
                                    style={{ width: `${((judgeScore?.overall ?? 0) / 10) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Dimension Scores */}
                        <div className="space-y-3">
                            <ScoreCard
                                label="Clarity"
                                score={judgeScore?.clarity ?? 0}
                                description="Simplicity and executive readability"
                            />
                            <ScoreCard
                                label="Insight Strength"
                                score={judgeScore?.insightStrength ?? 0}
                                description="Non-obvious insights and depth"
                            />
                            <ScoreCard
                                label="Feasibility"
                                score={judgeScore?.feasibility ?? 0}
                                description="Implementation viability"
                            />
                            <ScoreCard
                                label="Financial Logic"
                                score={judgeScore?.financialLogic ?? 0}
                                description="Numbers justify decisions"
                            />
                        </div>

                        {/* Feedback */}
                        <div className={`border rounded-lg p-4 mt-6 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
                            <p className={`text-xs font-semibold uppercase mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Judge's Comment</p>
                            <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{judgeScore?.feedback || 'Run Judge Eval to score the pitch.'}</p>
                        </div>
                    </motion.div>
                ) : activeTab === 'insights' ? (
                    <motion.div
                        key="insights"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3 flex-1"
                    >
                        <div className={`border rounded-lg p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
                            <div className={`flex items-center gap-2 text-xs font-semibold uppercase mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                                <BookOpen size={14} className="text-primary" />
                                Explain My Pitch
                            </div>
                            <p className={`text-sm mb-4 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                Stratify extracts three non-obvious insights and builds the strategy around the strongest one.
                            </p>
                            <ul className={`space-y-2 text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                                {insightBreakdown.map((insight, idx) => (
                                    <li key={idx} className="flex gap-2">
                                        <span className="text-[#35D4FF]">0{idx + 1}</span>
                                        <span>{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={`border rounded-lg p-4 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
                            <p className={`text-xs font-semibold uppercase mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>Top Improvements</p>
                            {(judgeScore?.improvements || []).length === 0 ? (
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Run Judge Eval to get improvement suggestions.</p>
                            ) : (
                                judgeScore?.improvements.map((improvement, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`border rounded-lg p-3 flex gap-3 mt-2 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-300'}`}
                                    >
                                        <AlertCircle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                        <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{improvement}</p>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="versions"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3 flex-1"
                    >
                        <div className={`flex items-center gap-2 text-xs font-semibold uppercase mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                            <History size={14} className="text-primary" />
                            Version History
                        </div>
                        {versionItems.length === 0 ? (
                            <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>No version history yet. Edit or regenerate blocks to track changes.</p>
                        ) : (
                            versionItems.map(({ block, latest }) => (
                                <div key={block.id} className={`border rounded-lg p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
                                    <p className={`text-xs uppercase mb-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{block.title}</p>
                                    <p className={`text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Latest change:</p>
                                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{new Date(latest.timestamp).toLocaleString()}</p>
                                    <p className={`text-sm mt-2 line-clamp-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{latest.content}</p>
                                </div>
                            ))
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

interface ScoreCardProps {
    label: string;
    score: number;
    description: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({ label, score, description }) => {
    const { isDark } = useTheme();
    const percentage = (score / 10) * 100;
    const color = score >= 7.5 ? 'from-primary' : score >= 6 ? 'from-yellow-500' : 'from-red-500';

    return (
        <div className={`border rounded-lg p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-100 border-slate-300'}`}>
            <div className="flex items-center justify-between mb-2">
                <div>
                    <p className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{label}</p>
                    <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{description}</p>
                </div>
                <span className={`text-lg font-bold bg-gradient-to-r ${color} to-transparent bg-clip-text text-transparent`}>
                    {score || '-'}
                </span>
            </div>
            <div className={`w-full rounded-full h-1.5 ${isDark ? 'bg-white/10' : 'bg-slate-300'}`}>
                <div
                    className={`bg-gradient-to-r ${color} to-transparent h-1.5 rounded-full transition-all`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};
