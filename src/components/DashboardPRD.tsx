import React, { useCallback, useMemo, useState } from 'react';
import type { PitchBlock } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { useDeck } from '../context/DeckContext';
import { useExportDeck } from '../hooks/useExportDeck';
import { useTheme } from '../context/ThemeContext';
import { CaseInputPanel } from './CaseInputPanel';
import { IntelligencePanel } from './IntelligencePanel.tsx';
import { ChatInterface } from './ChatInterface';
import { useJudgeEvaluator } from '../hooks/useJudgeEvaluator';
import { Download, BarChart3, Sparkles, ChevronDown, MessageSquare, Moon, Sun } from 'lucide-react';
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
    regenerateWeakSlides,
    type StorylineSlide
} from '../utils/strategyEngine';

const JUDGE_THRESHOLD = 7.5;

export const DashboardPRD: React.FC = () => {
    const { toggleTheme, isDark } = useTheme();
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
    const [expandedBlockId, setExpandedBlockId] = useState<string | null>(null);

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

            if (score.overall < JUDGE_THRESHOLD && storyline.length > 0) {
                const regenerated = regenerateWeakSlides(storyline, score);
                setStoryline(regenerated);
                setSlides(buildSlidesFromStoryline(regenerated));
                setCurrentSlideIndex(0);
            }
        } finally {
            setIsGenerating(false);
        }
    }, [blocks, caseInput, evaluatePitch, setJudgeScore, setIsGenerating, setSlides, setStoryline, storyline, setCurrentSlideIndex]);

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
        <div className={`h-screen w-full flex flex-col overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-white'}`}>
            <GenerationAnimation isVisible={isGenerating} />
            {/* Top Navigation */}
            <div className={`h-16 w-full ${isDark ? 'bg-slate-900/80 backdrop-blur-md border-white/10' : 'bg-white border-slate-200'} border-b px-6 flex items-center justify-between`}>
                <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        Stratify
                    </div>
                    <div className="relative">
                        <select
                            value={selectedCase}
                            onChange={e => handlePresetChange(e.target.value)}
                            className={`appearance-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'} border text-sm rounded-lg px-4 py-2 pr-8`}
                        >
                            <option value="">Select Case</option>
                            {casePresets.map(preset => (
                                <option key={preset.id} value={preset.id}>{preset.title}</option>
                            ))}
                        </select>
                        <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-400' : 'text-slate-600'} pointer-events-none`} />
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleTheme}
                        className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            isDark 
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                                : 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300'
                        }`}
                        title="Toggle theme"
                    >
                        {isDark ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button
                        onClick={() => setJudgeMode(!judgeMode)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                            judgeMode ? 'bg-primary/20 border-primary/40 text-primary' : isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-100 border-slate-300 text-slate-700'
                        }`}
                    >
                        Judge Mode {judgeMode ? 'On' : 'Off'}
                    </button>
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        disabled={slides.length === 0}
                        className={`px-4 py-2 border text-sm rounded-lg transition-colors disabled:opacity-50 ${
                            isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        Preview Deck
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={slides.length === 0}
                        className={`px-4 py-2 bg-primary text-white font-medium text-sm rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50`}
                    >
                        <Download size={16} className="inline mr-2" />
                        Export PPTX
                    </button>
                    <button
                        onClick={handleExportPdf}
                        disabled={slides.length === 0}
                        className={`px-3 py-2 border text-sm rounded-lg transition-colors disabled:opacity-50 ${
                            isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        PDF
                    </button>
                    <button
                        onClick={handleExportSlides}
                        disabled={slides.length === 0}
                        className={`px-3 py-2 border text-sm rounded-lg transition-colors disabled:opacity-50 ${
                            isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        Slides
                    </button>
                </div>
            </div>

            {/* Main Panels */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel (20%) - Case Inputs */}
                <div className={`w-[20%] min-w-[280px] border-r overflow-hidden ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <CaseInputPanel onGenerate={handleGeneratePitch} />
                </div>

                {/* Center Panel (50%) - Deck Preview */}
                <div className={`flex-1 border-r overflow-hidden flex flex-col ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    {/* Header Bar */}
                    <div className={`h-14 border-b px-6 flex items-center justify-between ${isDark ? 'bg-slate-900/60 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <h1 className={`text-lg font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            <Sparkles size={18} className="text-primary" />
                            Deck Preview
                        </h1>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleEvaluate}
                                disabled={blocks.length === 0 || isGenerating}
                                className={`px-4 py-2 border font-medium text-sm rounded-lg transition-colors disabled:opacity-50 ${
                                    isDark ? 'bg-white/10 border-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-900'
                                }`}
                            >
                                <BarChart3 size={16} className="inline mr-2" />
                                Judge Eval
                            </button>
                        </div>
                    </div>
                    {/* Locked Storyline */}
                    {storyline.length > 0 && (
                        <div className={`border-b px-6 py-3 overflow-x-auto ${isDark ? 'bg-slate-900/40 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="flex items-center gap-3">
                                {storyline.map((slide, idx) => (
                                    <div
                                        key={slide.id}
                                        className={`min-w-[180px] rounded-lg border px-3 py-2 ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-300 bg-white'}`}
                                    >
                                        <div className={`text-[10px] uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>0{idx + 1}</div>
                                        <div className={`text-xs mt-1 line-clamp-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                            {slide.props?.actionTitle || slide.headline}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Slide Canvas */}
                    <div className="flex-1 flex items-center justify-center p-10 relative">
                        <div className={`absolute inset-0 opacity-[0.02] pointer-events-none`}
                            style={{ 
                                backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'white' : 'slate'} 1px, transparent 0)`, 
                                backgroundSize: '40px 40px' 
                            }}
                        />

                        {slides.length === 0 ? (
                            <div className="text-center max-w-lg z-10">
                                <div className="mb-6 flex justify-center">
                                    <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-lg shadow-primary/20">
                                        <Sparkles className="text-white w-10 h-10" />
                                    </div>
                                </div>
                                <h2 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Generate your case deck</h2>
                                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Fill in the case inputs and click Generate to lock the storyline.
                                </p>
                            </div>
                        ) : (
                            <div
                                style={{ perspective: '1200px' }}
                                className="w-full max-w-[95%]"
                            >
                                <div
                                    key={currentSlide?.id}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    className={`aspect-video rounded-2xl overflow-hidden ring-1 z-10 ${isDark ? 'shadow-xl shadow-black/40 ring-white/10 bg-slate-900' : 'shadow-xl shadow-slate-200 ring-slate-300 bg-white'}`}
                                >
                                    {SlideComponent ? (
                                        <SlideComponent {...currentSlide.props} />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                            Unknown slide type.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Slide Reel */}
                    {slides.length > 0 && (
                        <div className={`h-40 border-t relative z-20 shrink-0 flex items-center justify-center ${isDark ? 'bg-slate-900/50 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                            <div className={`absolute inset-x-0 -top-12 h-12 bg-gradient-to-t ${isDark ? 'from-slate-900/50' : 'from-slate-50'} to-transparent pointer-events-none`} />
                            <SlideReel currentIndex={currentSlideIndex} onSelect={setCurrentSlideIndex} />
                        </div>
                    )}
                </div>

                {/* Right Panel (30%) - Intelligence Layer */}
                <div className={`w-[30%] min-w-[320px] border-l overflow-hidden ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="h-full flex flex-col">
                        <div className={`h-12 border-b flex items-center gap-2 px-4 ${isDark ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200'}`}>
                            <button
                                onClick={() => setSidePanel('blocks')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                    sidePanel === 'blocks'
                                        ? 'bg-primary/10 text-primary border border-primary/30'
                                        : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                                }`}
                            >
                                Blocks
                            </button>
                            <button
                                onClick={() => setSidePanel('chat')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                    sidePanel === 'chat'
                                        ? 'bg-primary/10 text-primary border border-primary/30'
                                        : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                                }`}
                            >
                                <MessageSquare size={14} className="inline mr-2" />
                                Chat
                            </button>
                            <button
                                onClick={() => setSidePanel('intel')}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                    sidePanel === 'intel'
                                        ? 'bg-primary/10 text-primary border border-primary/30'
                                        : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-700 hover:text-slate-900'
                                }`}
                            >
                                Intelligence
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {sidePanel === 'blocks' ? (
                                <div className={`h-full overflow-y-auto p-4 ${isDark ? 'bg-slate-900/40' : 'bg-white'}`}>
                                    <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>Pitch Blocks</h3>
                                    {blocks.length === 0 ? (
                                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Generate a pitch to see blocks here.</p>
                                    ) : (
                                        <div className="space-y-3">
                                            {blocks.map((block, idx) => (
                                                <div key={block.id} className={`rounded-lg border p-3 ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-300'}`}>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-900'}`}>
                                                            {block.title}
                                                        </span>
                                                        <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>#{idx + 1}</span>
                                                    </div>
                                                    <p className={`text-xs line-clamp-3 ${isDark ? 'text-slate-400' : 'text-slate-700'}`}>{block.content}</p>
                                                    {block.versions.length > 0 && (
                                                        <div className="mt-3">
                                                            <button
                                                                onClick={() => setExpandedBlockId(expandedBlockId === block.id ? null : block.id)}
                                                                className="text-[10px] text-primary hover:text-primary/80 transition-colors"
                                                            >
                                                                Versions ({block.versions.length})
                                                            </button>
                                                            {expandedBlockId === block.id && (
                                                                <div className="mt-2 space-y-2">
                                                                    {block.versions.slice(-2).reverse().map((version) => (
                                                                        <div key={version.timestamp} className={`text-[10px] border-l pl-2 ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-700 border-slate-300'}`}>
                                                                            <div className={`text-[9px] ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>
                                                                                {new Date(version.timestamp).toLocaleString()}
                                                                            </div>
                                                                            <div className="line-clamp-2">{version.content}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
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
