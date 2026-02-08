import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { PitchBlock } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { useDeck } from '../context/DeckContext';
import { useExportDeck } from '../hooks/useExportDeck';
import { useTheme } from '../context/ThemeContext';
import { CaseInputPanel } from './CaseInputPanel';
import { IntelligencePanel } from './IntelligencePanel.tsx';
import { ChatInterface } from './ChatInterface';
import { PitchBlockCard } from './PitchBlockCard';
import { useJudgeEvaluator } from '../hooks/useJudgeEvaluator';
import { Download, BarChart3, Sparkles, ChevronDown, MessageSquare, Moon, Sun, ChevronLeft, ChevronRight } from 'lucide-react';
import { GenerationAnimation } from './ui/GenerationAnimation';
import { DeckPreviewModal } from './DeckPreviewModal';
import { ErrorBoundary } from './ui/ErrorBoundary';
import { STRATIFY_TOOLS } from '../tambo.config';
import { SlideReel } from './ui/SlideReel';
import { GlowingEffect } from './ui/glowing-effect';
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
        {
            id: 'ecommerce-returns',
            title: 'E-commerce Return Rate Crisis',
            problemStatement: 'Product return rate has increased to 35%, causing massive losses and inventory issues.',
            constraints: 'Cannot change return policy, limited packaging budget.',
            targetMetric: 'Reduce return rate to under 18% in 6 months.',
            industry: 'ecommerce',
        },
        {
            id: 'saas-churn',
            title: 'SaaS Customer Retention',
            problemStatement: 'Monthly churn is at 8%, losing high-value enterprise customers to competitors.',
            constraints: 'No major product overhaul, maintain pricing.',
            targetMetric: 'Reduce churn to <3% and increase NPS by 20 points.',
            industry: 'tech',
        },
        {
            id: 'manufacturing-efficiency',
            title: 'Manufacturing Output Optimization',
            problemStatement: 'Production line efficiency is 65% with high downtime and quality defects.',
            constraints: 'No new equipment purchases, union agreements in place.',
            targetMetric: 'Achieve 85% efficiency in 9 months.',
            industry: 'manufacturing',
        },
        {
            id: 'edtech-engagement',
            title: 'EdTech Platform Engagement',
            problemStatement: 'Course completion rate is only 22%, causing poor student outcomes and low renewal rates.',
            constraints: 'Fixed content budget, must scale to 10x users.',
            targetMetric: 'Increase completion rate to 60% within 12 months.',
            industry: 'education',
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
                    <button 
                        onClick={() => {
                            window.history.pushState({}, '', '/');
                            window.location.reload();
                        }}
                        className={`flex items-center gap-2 font-bold hover:opacity-70 transition-opacity ${isDark ? 'text-white' : 'text-slate-900'}`}
                        title="Back to landing page"
                    >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-logo tracking-[0.14em]">STRATIFY</span>
                    </button>
                    <div className="relative">
                        <GlowingEffect
                            spread={24}
                            glow={true}
                            disabled={false}
                            proximity={50}
                            inactiveZone={0.4}
                            borderWidth={1}
                        />
                        <select
                            value={selectedCase}
                            onChange={e => handlePresetChange(e.target.value)}
                            className={`relative z-10 appearance-none ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900'} border text-sm rounded-lg px-4 py-2 pr-8`}
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
                        className={`relative px-3 py-2 rounded-lg text-sm font-medium border transition-colors overflow-hidden ${
                            isDark 
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' 
                                : 'bg-slate-200 border-slate-300 text-slate-700 hover:bg-slate-300'
                        }`}
                        title="Toggle theme"
                    >
                        <GlowingEffect
                            spread={26}
                            glow={true}
                            disabled={false}
                            proximity={40}
                            inactiveZone={0.25}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10">{isDark ? <Sun size={16} /> : <Moon size={16} />}</span>
                    </button>
                    <button
                        onClick={() => setJudgeMode(!judgeMode)}
                        className={`relative px-4 py-2 rounded-lg text-sm font-medium border transition-colors overflow-hidden ${
                            judgeMode
                                ? isDark
                                    ? 'bg-white/15 border-white/30 text-white backdrop-blur-md shadow-[0_8px_24px_rgba(255,255,255,0.08)]'
                                    : 'bg-white/80 border-white/60 text-slate-900 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.12)]'
                                : isDark
                                    ? 'bg-white/5 border-white/15 text-slate-200 hover:bg-white/10 backdrop-blur-md'
                                    : 'bg-white/60 border-white/50 text-slate-700 hover:bg-white/80 backdrop-blur-md'
                        }`}
                    >
                        <GlowingEffect
                            spread={30}
                            glow={true}
                            disabled={false}
                            proximity={45}
                            inactiveZone={0.25}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10">Judge Mode {judgeMode ? 'On' : 'Off'}</span>
                    </button>
                    <button
                        onClick={() => setIsPreviewOpen(true)}
                        disabled={slides.length === 0}
                        className={`relative px-4 py-2 border text-sm rounded-lg transition-colors disabled:opacity-50 overflow-hidden ${
                            isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        <GlowingEffect
                            spread={28}
                            glow={true}
                            disabled={slides.length === 0}
                            proximity={45}
                            inactiveZone={0.25}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10">Preview Deck</span>
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={slides.length === 0}
                        className={`relative px-4 py-2 bg-primary text-white font-medium text-sm rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 overflow-hidden`}
                    >
                        <GlowingEffect
                            spread={32}
                            glow={true}
                            disabled={slides.length === 0}
                            proximity={55}
                            inactiveZone={0.2}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10 flex items-center gap-2">
                            <Download size={16} />
                            Export PPTX
                        </span>
                    </button>
                    <button
                        onClick={handleExportPdf}
                        disabled={slides.length === 0}
                        className={`relative px-3 py-2 border text-sm rounded-lg transition-colors disabled:opacity-50 overflow-hidden ${
                            isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        <GlowingEffect
                            spread={26}
                            glow={true}
                            disabled={slides.length === 0}
                            proximity={40}
                            inactiveZone={0.25}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10">PDF</span>
                    </button>
                    <button
                        onClick={handleExportSlides}
                        disabled={slides.length === 0}
                        className={`relative px-3 py-2 border text-sm rounded-lg transition-colors disabled:opacity-50 overflow-hidden ${
                            isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-100 border-slate-300 text-slate-900 hover:bg-slate-200'
                        }`}
                    >
                        <GlowingEffect
                            spread={26}
                            glow={true}
                            disabled={slides.length === 0}
                            proximity={40}
                            inactiveZone={0.25}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10">Slides</span>
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
                                className={`relative px-4 py-2 border font-medium text-sm rounded-lg transition-colors disabled:opacity-50 overflow-hidden ${
                                    isDark ? 'bg-white/10 border-white/10 hover:bg-white/20 text-white' : 'bg-slate-100 border-slate-300 hover:bg-slate-200 text-slate-900'
                                }`}
                            >
                                <GlowingEffect
                                    spread={28}
                                    glow={true}
                                    disabled={blocks.length === 0 || isGenerating}
                                    proximity={45}
                                    inactiveZone={0.25}
                                    borderWidth={1.5}
                                />
                                <span className="relative z-10 flex items-center gap-2">
                                    <BarChart3 size={16} />
                                    Judge Eval
                                </span>
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
                    <div className={`flex-1 flex items-center justify-center p-8 relative bg-gradient-to-br ${isDark ? 'from-slate-900 via-slate-950 to-slate-900' : 'from-slate-50 via-white to-slate-50'}`}>
                        {/* Background Pattern */}
                        <div className={`absolute inset-0 opacity-[0.03] pointer-events-none`}
                            style={{ 
                                backgroundImage: `radial-gradient(circle at 2px 2px, ${isDark ? 'white' : 'slate'} 1px, transparent 0)`, 
                                backgroundSize: '40px 40px' 
                            }}
                        />
                        
                        {/* Glow Effects */}
                        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${isDark ? 'bg-primary/10' : 'bg-primary/5'}`} />
                        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none ${isDark ? 'bg-magenta/10' : 'bg-magenta/5'}`} />

                        {slides.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-center max-w-lg z-10"
                            >
                                <motion.div
                                    className="mb-8 flex justify-center"
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity }}
                                >
                                    <div className={`w-24 h-24 bg-gradient-to-br from-primary to-magenta rounded-3xl flex items-center justify-center ${isDark ? 'shadow-2xl shadow-primary/30' : 'shadow-2xl shadow-primary/20'}`}>
                                        <Sparkles className="text-white w-12 h-12" />
                                    </div>
                                </motion.div>
                                <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>Generate your case deck</h2>
                                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Fill in the case inputs and click <span className="font-semibold">Generate Pitch</span> to lock your strategic storyline.
                                </p>
                            </motion.div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                {/* Slide Navigation Arrows */}
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-30">
                                    <button
                                        onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                                        disabled={currentSlideIndex === 0}
                                        className={`relative p-3 rounded-full transition-all ${
                                            isDark
                                                ? 'bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white'
                                                : 'bg-white/80 hover:bg-white disabled:opacity-30 text-slate-900'
                                        }`}
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                </div>

                                <div
                                    style={{ perspective: '1400px' }}
                                    className="w-full flex items-center justify-center max-h-[70vh]"
                                >
                                    <motion.div
                                        key={currentSlide?.id}
                                        initial={{ opacity: 0, rotateY: -20, scale: 0.95 }}
                                        animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotateY: 20, scale: 0.95 }}
                                        transition={{ duration: 0.4, ease: "easeInOut" }}
                                        style={{ transformStyle: 'preserve-3d' }}
                                        className={`w-[95%] max-w-5xl aspect-video rounded-3xl overflow-hidden ring-1 z-20 ${
                                            isDark
                                                ? 'shadow-2xl shadow-black/60 ring-white/20 bg-slate-900'
                                                : 'shadow-2xl shadow-slate-300/40 ring-slate-300 bg-white'
                                        }`}
                                    >
                                        {SlideComponent ? (
                                            <ErrorBoundary
                                                name={currentSlide?.type}
                                                fallback={
                                                    <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                                        Slide render error. Check console for details.
                                                    </div>
                                                }
                                            >
                                                <SlideComponent {...currentSlide.props} />
                                            </ErrorBoundary>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                                Unknown slide type.
                                            </div>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Right Navigation Arrow */}
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 z-30">
                                    <button
                                        onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
                                        disabled={currentSlideIndex === slides.length - 1}
                                        className={`relative p-3 rounded-full transition-all ${
                                            isDark
                                                ? 'bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white'
                                                : 'bg-white/80 hover:bg-white disabled:opacity-30 text-slate-900'
                                        }`}
                                    >
                                        <ChevronRight size={24} />
                                    </button>
                                </div>

                                {/* Slide Counter */}
                                <div className={`absolute top-4 right-6 px-4 py-2 rounded-full backdrop-blur-md z-30 ${
                                    isDark
                                        ? 'bg-white/10 border border-white/20 text-white'
                                        : 'bg-white/80 border border-white/60 text-slate-900'
                                }`}>
                                    <span className="text-sm font-semibold">{currentSlideIndex + 1} / {slides.length}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Slide Reel */}
                    {slides.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className={`h-48 border-t relative z-20 shrink-0 flex items-center justify-center overflow-hidden ${isDark ? 'bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-950 border-white/10' : 'bg-gradient-to-t from-slate-50 via-white to-slate-100 border-slate-200'}`}
                        >
                            <div className={`absolute inset-x-0 -top-12 h-12 bg-gradient-to-t ${isDark ? 'from-slate-900/80' : 'from-slate-50'} to-transparent pointer-events-none`} />
                            <ErrorBoundary
                                name="SlideReel"
                                fallback={
                                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Slide reel failed to render.</div>
                                }
                            >
                                <SlideReel currentIndex={currentSlideIndex} onSelect={setCurrentSlideIndex} />
                            </ErrorBoundary>
                        </motion.div>
                    )}
                </div>

                {/* Right Panel (30%) - Intelligence Layer */}
                <div className={`w-[30%] min-w-[320px] border-l overflow-hidden ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                    <div className="h-full flex flex-col">
                        <div className={`h-12 border-b flex items-center gap-2 px-4 ${isDark ? 'bg-slate-900/70 border-white/10' : 'bg-white border-slate-200'}`}>
                            <button
                                onClick={() => setSidePanel('blocks')}
                                className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors overflow-hidden ${
                                    sidePanel === 'blocks'
                                        ? isDark
                                            ? 'bg-white/15 text-white border border-white/30 backdrop-blur-md shadow-[0_6px_18px_rgba(255,255,255,0.08)]'
                                            : 'bg-white/80 text-slate-900 border border-white/60 backdrop-blur-md shadow-[0_6px_18px_rgba(15,23,42,0.08)]'
                                        : isDark
                                            ? 'text-slate-300 hover:text-white hover:bg-white/5'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                <GlowingEffect
                                    spread={22}
                                    glow={true}
                                    disabled={false}
                                    proximity={38}
                                    inactiveZone={0.3}
                                    borderWidth={1}
                                />
                                <span className="relative z-10">Blocks</span>
                            </button>
                            <button
                                onClick={() => setSidePanel('chat')}
                                className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors overflow-hidden ${
                                    sidePanel === 'chat'
                                        ? isDark
                                            ? 'bg-white/15 text-white border border-white/30 backdrop-blur-md shadow-[0_6px_18px_rgba(255,255,255,0.08)]'
                                            : 'bg-white/80 text-slate-900 border border-white/60 backdrop-blur-md shadow-[0_6px_18px_rgba(15,23,42,0.08)]'
                                        : isDark
                                            ? 'text-slate-300 hover:text-white hover:bg-white/5'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                <GlowingEffect
                                    spread={22}
                                    glow={true}
                                    disabled={false}
                                    proximity={38}
                                    inactiveZone={0.3}
                                    borderWidth={1}
                                />
                                <span className="relative z-10 flex items-center gap-2">
                                    <MessageSquare size={14} />
                                    Chat
                                </span>
                            </button>
                            <button
                                onClick={() => setSidePanel('intel')}
                                className={`relative px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors overflow-hidden ${
                                    sidePanel === 'intel'
                                        ? isDark
                                            ? 'bg-white/15 text-white border border-white/30 backdrop-blur-md shadow-[0_6px_18px_rgba(255,255,255,0.08)]'
                                            : 'bg-white/80 text-slate-900 border border-white/60 backdrop-blur-md shadow-[0_6px_18px_rgba(15,23,42,0.08)]'
                                        : isDark
                                            ? 'text-slate-300 hover:text-white hover:bg-white/5'
                                            : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                                }`}
                            >
                                <GlowingEffect
                                    spread={22}
                                    glow={true}
                                    disabled={false}
                                    proximity={38}
                                    inactiveZone={0.3}
                                    borderWidth={1}
                                />
                                <span className="relative z-10">Intelligence</span>
                            </button>
                        </div>

                        <div className="flex-1 overflow-hidden">
                            {sidePanel === 'blocks' ? (
                                <div className={`h-full overflow-y-auto p-4 ${isDark ? 'bg-gradient-to-b from-slate-900/60 to-slate-950/60' : 'bg-gradient-to-b from-white to-slate-50'}`}>
                                    <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                        <Sparkles size={16} className="text-primary" />
                                        Pitch Blocks
                                    </h3>
                                    {blocks.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`text-xs p-6 rounded-lg text-center ${isDark ? 'bg-white/5 border border-white/10 text-slate-400' : 'bg-slate-100 border border-slate-300 text-slate-600'}`}
                                        >
                                            <p>Generate a pitch to see blocks here.</p>
                                        </motion.div>
                                    ) : (
                                        <div className="space-y-3">
                                            {blocks.map((block, idx) => (
                                                <PitchBlockCard
                                                    key={block.id}
                                                    block={block}
                                                    index={idx}
                                                />
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
