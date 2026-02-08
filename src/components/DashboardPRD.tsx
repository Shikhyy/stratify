import React, { useCallback, useState } from 'react';
import type { PitchBlock } from '../context/PitchContext';
import { usePitch } from '../context/PitchContext';
import { useDeck } from '../context/DeckContext';
import { useExportDeck } from '../hooks/useExportDeck';
import { CaseInputPanel } from './CaseInputPanel';
import { PitchWorkspace } from './PitchWorkspace';
import { IntelligencePanel } from './IntelligencePanel.tsx';
import { ChatInterface } from './ChatInterface';
import { useJudgeEvaluator } from '../hooks/useJudgeEvaluator';
import { generateSlidesFromBlocks } from '../utils/slideGeneration';
import { Download, BarChart3, Sparkles, ChevronDown, MessageSquare } from 'lucide-react';
import { GenerationAnimation } from './ui/GenerationAnimation';
import { DeckPreviewModal } from './DeckPreviewModal';

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
    
    const { addSlide, slides } = useDeck();
    const { evaluatePitch } = useJudgeEvaluator();
    const { exportToPPT } = useExportDeck();
    const [judgeMode, setJudgeMode] = useState(true);
    const [selectedCase, setSelectedCase] = useState('');
    const [sidePanel, setSidePanel] = useState<'chat' | 'intel'>('chat');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const currentSlide = slides.length > 0 ? slides[slides.length - 1] : undefined;

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

    // Generate initial pitch structure from Tambo
    const handleGeneratePitch = useCallback(async () => {
        if (!caseInput) return;

        setIsGenerating(true);

        try {
            // Simulate Tambo generation of pitch blocks (in production, call Tambo API)
            const generatedBlocks: PitchBlock[] = [
                {
                    id: `block-${Date.now()}-1`,
                    type: 'problem',
                    title: 'Problem Definition',
                    content: `Reframed Problem: ${caseInput.problemStatement}\n\nConstraints: ${caseInput.constraints}\n\nSuccess Metric: ${caseInput.targetMetric}`,
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-2`,
                    type: 'recommendation',
                    title: 'Our Recommendation',
                    content: `Recommendation: Implement a three-pillar strategy focused on ${caseInput.industry} sector optimization to achieve the target metric of "${caseInput.targetMetric}" within the given constraints.`,
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-3`,
                    type: 'insight',
                    title: 'Core Insight',
                    content: `The non-obvious insight: Most competitors focus on incremental improvements. The real opportunity lies in fundamentally restructuring operations to leverage emerging technologies and market shifts specific to ${caseInput.industry}.`,
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-4`,
                    type: 'pillar',
                    title: 'Pillar 1',
                    content: 'Pillar 1 - Operational Excellence: Streamline processes and reduce inefficiencies by 30% through automation and process redesign.',
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-5`,
                    type: 'pillar',
                    title: 'Pillar 2',
                    content: 'Pillar 2 - Market Expansion: Enter new customer segments and geographies to increase addressable market by 40%.',
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-6`,
                    type: 'pillar',
                    title: 'Pillar 3',
                    content: 'Pillar 3 - Technology Integration: Implement AI-driven personalization and data analytics to improve customer experience and retention by 25%.',
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-7`,
                    type: 'financial',
                    title: 'Financial Impact',
                    content: `Expected Financial Impact:
- Revenue Growth: +$50M (from market expansion and pricing optimization)
- Cost Savings: $15M (from operational efficiency)
- Investment Required: $10M
- Net Impact: $55M
- Payback Period: 2.2 years
Assumptions: 30% adoption rate, 15% average price increase, 25% cost reduction`,
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-8`,
                    type: 'roadmap',
                    title: 'Implementation Roadmap',
                    content: `Phase 1 (Q1-Q2): Foundation - Pilot operational excellence in 3 locations, setup AI infrastructure
Phase 2 (Q3-Q4): Scale - Roll out market expansion in 2 new geographies, full tech integration
Phase 3 (2025): Optimize - Global rollout, continuous improvement, measure ROI`,
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-9`,
                    type: 'risks',
                    title: 'Risks & Mitigations',
                    content: `Top Risks & Mitigations:
1. Implementation Delay Risk - Mitigation: Assign dedicated PMO, weekly steering committee
2. Technology Adoption Risk - Mitigation: Comprehensive training program, change management
3. Competitive Response Risk - Mitigation: First-mover advantage, continuous innovation, IP protection`,
                    locked: false,
                    versions: [],
                },
                {
                    id: `block-${Date.now()}-10`,
                    type: 'impact',
                    title: 'Final Impact Statement',
                    content: `By executing this three-pillar strategy, we will transform the business from an incremental competitor into a market leader, delivering $55M in net value while positioning the company for long-term sustainable growth in the ${caseInput.industry} sector.`,
                    locked: false,
                    versions: [],
                },
            ];

            setBlocks(generatedBlocks);

            // Auto-generate slides from blocks
            const slides = generateSlidesFromBlocks(generatedBlocks, caseInput.caseTitle);
            slides.forEach(slide => addSlide(slide.type, slide.props));

            // Toast notification
            console.log('Pitch generated successfully!');
        } finally {
            setIsGenerating(false);
        }
    }, [caseInput, setBlocks, setIsGenerating, addSlide]);

    const handleRegenerate = useCallback(async (blockId: string, instruction: string) => {
        // In production, this calls Tambo with the instruction
        console.log(`Regenerating block ${blockId} with instruction: ${instruction}`);
        // For now, simulate a simple regeneration
        setBlocks(
            blocks.map(block => {
                if (block.id === blockId) {
                    return {
                        ...block,
                        content: `[Regenerated: ${instruction}]\n\n${block.content}`,
                    };
                }
                return block;
            })
        );
    }, [blocks, setBlocks]);

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

                {/* Center Panel (50%) - Pitch Workspace */}
                <div className="flex-1 border-r border-white/10 overflow-hidden flex flex-col">
                    {/* Header Bar */}
                    <div className="h-14 bg-slate-900/60 border-b border-white/10 px-6 flex items-center justify-between">
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Sparkles size={18} className="text-primary" />
                            Stratify Pitch Workspace
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

                    {/* Pitch Workspace */}
                    <div className="flex-1 overflow-hidden">
                        <PitchWorkspace onRegenerate={handleRegenerate} />
                    </div>
                </div>

                {/* Right Panel (30%) - Intelligence Layer */}
                <div className="w-[30%] min-w-[320px] border-l border-white/10 overflow-hidden">
                    <div className="h-full flex flex-col">
                        <div className="h-12 border-b border-white/10 flex items-center gap-2 px-4 bg-slate-900/70">
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
                            {sidePanel === 'chat' ? (
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
                initialIndex={slides.length > 0 ? slides.length - 1 : 0}
            />
        </div>
    );
};
