import React, { useCallback, useMemo, useState } from 'react';
import type { PitchBlock } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { useDeck } from '../context/DeckContext';
import { useExportDeck } from '../hooks/useExportDeck';
import { CaseInputPanel } from './CaseInputPanel';
import { IntelligencePanel } from './IntelligencePanel.tsx';
import { ChatInterface } from './ChatInterface';
import { useJudgeEvaluator } from '../hooks/useJudgeEvaluator';
import { Download, BarChart3, Sparkles, ChevronDown, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { GenerationAnimation } from './ui/GenerationAnimation';
import { DeckPreviewModal } from './DeckPreviewModal';
import { STRATIFY_TOOLS } from '../tambo.config';
import { SlideReel } from './ui/SlideReel';
import {
    buildBlocksFromStoryline,
    buildSlidesFromStoryline,
    buildStorylineOutline,
    deconstructCase,
    generateInsights,
    type StorylineSlide
} from '../utils/strategyEngine';

export const DashboardPRD: React.FC = () => {
    const {
        blocks,
        caseInput,
        setBlocks,
        setJudgeScore,
        isGenerating,
        setIsGenerating,
        setCaseInput
    } = usePitch();

    const { slides, setSlides } = useDeck();
    const { evaluatePitch } = useJudgeEvaluator();
    const { exportToPPT } = useExportDeck();
    const [judgeMode, setJudgeMode] = useState(true);
    const [selectedCase, setSelectedCase] = useState('');
    const [sidePanel, setSidePanel] = useState<'chat' | 'intel' | 'blocks'>('blocks');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [storyline, setStoryline] = useState<StorylineSlide[]>([]);

    const currentSlide = slides[currentSlideIndex];
    const SlideComponent = useMemo(() => {
        const toolConfig = STRATIFY_TOOLS.find(t => t.name === currentSlide?.type);
        return toolConfig?.component || null;
    }, [currentSlide]);

    const casePresets = [
        {
            id: 'retail-margin',
            title: 'Retail Margin Recovery',
            problemStatement: 'Margins have fallen 12% across 200 stores. Find a plan to recover profitability in 12 months.',
            constraints: 'Capex under $5M, limited store closures.',
            targetMetric: 'Increase margin by 15% within 12 months.',
            industry: 'retail',
        },
        {
            id: 'bank-digital',
            title: 'Digital Banking Adoption',
            problemStatement: 'Only 30% of customers use the mobile app. Increase adoption without raising churn.',
            constraints: 'No fee changes, compliance restrictions.',
            targetMetric: 'Reach 60% adoption in 9 months.',
            industry: 'finance',
        },
        {
            id: 'healthcare-wait',
            title: 'Healthcare Wait Times',
            problemStatement: 'Average wait time in clinics is 90 minutes. Reduce to under 45 minutes.',
            constraints: 'No increase in staffing, fixed budget.',
            targetMetric: 'Reduce average wait time by 50%.',
            industry: 'healthcare',
        },
    ];

    // Generate pitch structure and locked storyline
    const handleGeneratePitch = useCallback(async () => {
        if (!caseInput) return;

        setIsGenerating(true);

        try {
            const deconstruction = deconstructCase(caseInput);
            const insights = generateInsights(caseInput, deconstruction);
            const outline = buildStorylineOutline(caseInput, deconstruction, insights);

            setStoryline(outline);
            setCurrentSlideIndex(0);

            const generatedBlocks: PitchBlock[] = buildBlocksFromStoryline(
                outline,
                caseInput,
                deconstruction,
                insights
            );
            setBlocks(generatedBlocks);

            const deckSlides = buildSlidesFromStoryline(outline);
            setSlides(deckSlides);

            console.log('Pitch generated successfully!');
        } finally {
            setIsGenerating(false);
        }
    }, [caseInput, setBlocks, setIsGenerating, setSlides, setStoryline, setCurrentSlideIndex]);

    const handleEvaluate = useCallback(async () => {
        if (blocks.length === 0) return;
        
        setIsGenerating(true);
        try {
            const score = await evaluatePitch(blocks, caseInput?.problemStatement || '');
            setJudgeScore(score);
        } finally {
            setIsGenerating(false);
        }
    }, [blocks, caseInput, evaluatePitch, setJudgeScore, setIsGenerating]);

    const handleExport = async () => {
        exportToPPT();
    };

    const handleExportPdf = async () => {
        console.log('Export PDF placeholder');
    };

    const handleExportSlides = async () => {
        console.log('Export Google Slides placeholder');
    };

    const handlePresetChange = (presetId: string) => {
        setSelectedCase(presetId);
        const preset = casePresets.find(p => p.id === presetId);
        if (preset) {
            setCaseInput({
                caseTitle: preset.title,
                problemStatement: preset.problemStatement,
                constraints: preset.constraints,
                targetMetric: preset.targetMetric,
                industry: preset.industry,
            });
        }
    };

    return (
        <div className="h-screen w-full bg-slate-950 flex flex-col overflow-hidden">
            <GenerationAnimation isVisible={isGenerating} />
            {/* Top Navigation */}
            <div className="h-16 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-white font-bold">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Stratify
                    </div>
                    <div className="relative">
                        <select
                            value={selectedCase}
                            onChange={e => handlePresetChange(e.target.value)}
                            className="appearance-none bg-white/5 border border-white/10 text-sm text-white rounded-full px-4 py-2 pr-8"
                        >
                            <option value="">Select Case</option>
                            {casePresets.map(preset => (
                                <option key={preset.id} value={preset.id}>{preset.title}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setJudgeMode(!judgeMode)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                            judgeMode ? 'bg-primary/20 border-primary/40 text-primary' : 'bg-white/5 border-white/10 text-slate-300'
                        }`}
                    >
                        Judge Mode {judgeMode ? 'On' : 'Off'}
                    </button>
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        disabled={slides.length === 0}
                        className="px-4 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        Preview Deck
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={slides.length === 0}
                        className="px-4 py-2 bg-gradient-to-r from-primary to-magenta text-white font-medium text-sm rounded-full hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50"
                    >
                        <Download size={16} className="inline mr-2" />
                        Export PPTX
                    </button>
                    <button
                        onClick={handleExportPdf}
                        disabled={slides.length === 0}
                        className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        PDF
                    </button>
                    <button
                        onClick={handleExportSlides}
                        disabled={slides.length === 0}
                        className="px-3 py-2 bg-white/5 border border-white/10 text-white text-sm rounded-full hover:bg-white/10 transition-colors disabled:opacity-50"
                    >
                        Slides
                    </button>
                </div>
            </div>

            {/* Main Panels */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel (20%) - Case Inputs */}
                <div className="w-[20%] min-w-[280px] border-r border-white/10 overflow-hidden">
                    <CaseInputPanel onGenerate={handleGeneratePitch} />
                </div>

                {/* Center Panel (50%) - Deck Preview */}
                <div className="flex-1 border-r border-white/10 overflow-hidden flex flex-col">
                    {/* Header Bar */}
                    <div className="h-14 bg-slate-900/60 border-b border-white/10 px-6 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Sparkles size={18} className="text-primary" />
                            Deck Preview
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleEvaluate}
                                disabled={blocks.length === 0 || isGenerating}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50"
                            >
                                <BarChart3 size={16} className="inline mr-2" />
                                Judge Eval
                            </button>
                        </div>
                    </div>

                    {/* Locked Storyline */}
                    {storyline.length > 0 && (
                        <div className="border-b border-white/10 bg-slate-900/40 px-6 py-3 overflow-x-auto">
                            <div className="flex items-center gap-3">
                                {storyline.map((slide, idx) => (
                                    <div
                                        key={slide.id}
                                        className="min-w-[180px] rounded-lg border border-white/10 bg-white/5 px-3 py-2"
                                    >
                                        <div className="text-[10px] uppercase tracking-widest text-slate-400">0{idx + 1}</div>
                                        <div className="text-xs text-white/80 mt-1 line-clamp-2">
                                            {slide.props?.actionTitle || slide.headline}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Slide Canvas */}
                    <div className="flex-1 flex items-center justify-center p-10 relative">
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                            style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                        />

                        {slides.length === 0 ? (
                            <div className="text-center max-w-lg z-10">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="mb-6 flex justify-center"
                                >
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary via-magenta to-purple rounded-3xl flex items-center justify-center shadow-2xl shadow-primary/40">
                                        <Sparkles className="text-white w-10 h-10" />
                                    </div>
                                </motion.div>
                                <h2 className="text-2xl font-bold mb-3 text-white">Generate your case deck</h2>
                                <p className="text-slate-400 text-sm">
                                    Fill in the case inputs and click Generate to lock the storyline.
                                </p>
                            </div>
                        ) : (
                            <motion.div
                                key={currentSlide?.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-[95%] aspect-video shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden ring-1 ring-white/10 z-10"
                            >
                                {SlideComponent ? (
                                    <SlideComponent {...currentSlide.props} />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                        Unknown slide type.
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Slide Reel */}
                    {slides.length > 0 && (
                        <div className="h-40 bg-slate-900/50 border-t border-white/10 relative z-20 shrink-0 flex items-center justify-center">
                            <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
                            <SlideReel currentIndex={currentSlideIndex} onSelect={setCurrentSlideIndex} />
                        </div>
                    )}
                </div>

                {/* Right Panel (30%) - Intelligence Layer */}
                <div className="w-[30%] min-w-[320px] border-l border-white/10 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="h-12 border-b border-white/10 flex items-center gap-2 px-4 bg-slate-900/70">
                            <button
                                onClick={() => setSidePanel('blocks')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                    sidePanel === 'blocks'
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                Blocks
                            </button>
                            <button
                                onClick={() => setSidePanel('chat')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                    sidePanel === 'chat'
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                <MessageSquare size={14} className="inline mr-2" />
                                Chat
                            </button>
                            <button
                                onClick={() => setSidePanel('intel')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-colors ${
                                    sidePanel === 'intel'
                                        ? 'bg-primary/20 text-primary border border-primary/30'
                                        : 'text-slate-300 hover:text-white'
                                }`}
                            >
                                Intelligence
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {sidePanel === 'blocks' ? (
                                <div className="h-full overflow-y-auto p-4 bg-slate-900/40">
                                    <h3 className="text-sm font-bold text-white mb-4">Pitch Blocks</h3>
                                    {blocks.length === 0 ? (
                                        <p className="text-slate-400 text-xs">Generate a pitch to see blocks here.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {blocks.map((block, idx) => (
                                                <div key={block.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-semibold text-slate-300">
                                                            {block.title}
                                                        </span>
                                                        <span className="text-[10px] text-slate-500">#{idx + 1}</span>
                                                    </div>
                                                    <p className="text-xs text-slate-400 line-clamp-3">{block.content}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : sidePanel === 'chat' ? (
                                <ChatInterface currentSlide={currentSlide} />
                            ) : (
                                <IntelligencePanel />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DeckPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                initialIndex={currentSlideIndex}
            />
        </div>
    );
};
