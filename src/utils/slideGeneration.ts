import type { PitchBlock } from '../context/PitchContext';
import type { Slide } from '../context/DeckContext';

/**
 * Slide Generation Utilities
 * Converts pitch blocks to McKinsey-style presentation slides
 */

export const generateSlidesFromBlocks = (blocks: PitchBlock[], caseTitle: string): Slide[] => {
    const slides: Slide[] = [];

    // 1. Title Slide
    slides.push({
        id: `title-${Date.now()}`,
        type: 'TitleSlide',
        props: {
            title: caseTitle,
            subtitle: 'Case Competition Submission',
            teamName: 'Team Stratify',
        },
    });

    // 2. Executive Summary (Answer First)
    const recommendationBlock = blocks.find(b => b.type === 'recommendation');
    const insightBlock = blocks.find(b => b.type === 'insight');
    if (recommendationBlock) {
        slides.push({
            id: `executive-${Date.now()}`,
            type: 'MarketSizingSlide',
            props: {
                title: 'Our Recommendation',
                actionTitle: recommendationBlock.content,
                kicker: insightBlock?.content || 'Key insight drives recommendation',
                content: 'Expected Impact: 20%+ improvement in target metric',
            },
        });
    }

    // 3. Problem Definition
    const problemBlock = blocks.find(b => b.type === 'problem');
    if (problemBlock) {
        slides.push({
            id: `problem-${Date.now()}`,
            type: 'MarketSizingSlide',
            props: {
                title: 'Problem Definition',
                actionTitle: 'Reframed Challenge',
                kicker: problemBlock.content,
                content: 'Success Metric: Clearly defined outcomes',
            },
        });
    }

    // 4. Key Insight
    if (insightBlock) {
        slides.push({
            id: `insight-${Date.now()}`,
            type: 'MarketSizingSlide',
            props: {
                title: 'Core Insight',
                actionTitle: 'The Non-Obvious Truth',
                kicker: insightBlock.content,
                content: 'This insight transforms the decision',
            },
        });
    }

    // 5. Strategy Overview & Pillars
    const pillarBlocks = blocks.filter(b => b.type === 'pillar');
    if (pillarBlocks.length > 0) {
        slides.push({
            id: `strategy-${Date.now()}`,
            type: 'ChevronProcess',
            props: {
                title: 'Strategic Approach',
                actionTitle: 'Three Pillars',
                steps: pillarBlocks.map((block, idx) => ({
                    number: idx + 1,
                    label: `Pillar ${idx + 1}`,
                    description: block.content,
                })),
            },
        });
    }

    // 6-8. Individual Pillar Deep-Dives
    pillarBlocks.forEach((pillarBlock, idx) => {
        slides.push({
            id: `pillar-${idx}-${Date.now()}`,
            type: 'MarketSizingSlide',
            props: {
                title: `Strategic Pillar ${idx + 1}`,
                actionTitle: `Pillar ${idx + 1}: Deep Dive`,
                kicker: pillarBlock.content,
                content: 'What we do, why it works, supporting logic',
            },
        });
    });

    // 9. Financial Impact
    const financialBlock = blocks.find(b => b.type === 'financial');
    if (financialBlock) {
        slides.push({
            id: `financial-${Date.now()}`,
            type: 'MarketSizingSlide',
            props: {
                title: 'Financial Impact',
                actionTitle: 'Revenue & Cost Impact',
                kicker: financialBlock.content,
                content: 'ROI Justification',
                waterfall: [
                    { label: 'Base', value: 0 },
                    { label: 'Revenue Impact', value: 15 },
                    { label: 'Cost Savings', value: 8 },
                    { label: 'Net Impact', value: 23, isFinal: true },
                ],
            },
        });
    }

    // 10. Implementation Roadmap
    const roadmapBlock = blocks.find(b => b.type === 'roadmap');
    if (roadmapBlock) {
        slides.push({
            id: `roadmap-${Date.now()}`,
            type: 'StrategicRoadmap',
            props: {
                title: 'Implementation Roadmap',
                actionTitle: 'Phased Execution Plan',
                kicker: roadmapBlock.content,
                phases: ['Phase 1: Pilot', 'Phase 2: Scale', 'Phase 3: Optimize'],
            },
        });
    }

    // 11. Risks & Mitigations
    const risksBlock = blocks.find(b => b.type === 'risks');
    if (risksBlock) {
        slides.push({
            id: `risks-${Date.now()}`,
            type: 'MarketSizingSlide',
            props: {
                title: 'Risks & Mitigations',
                actionTitle: 'Risk Mitigation Strategy',
                kicker: risksBlock.content,
                content: 'Clear mitigations for each risk',
            },
        });
    }

    // 12. Closing Impact
    const impactBlock = blocks.find(b => b.type === 'impact');
    slides.push({
        id: `impact-${Date.now()}`,
        type: 'TitleSlide',
        props: {
            title: 'Strategic Advantage',
            subtitle: impactBlock?.content || 'Future state delivery',
            teamName: 'Stratify',
        },
    });

    return slides;
};

/**
 * Generates infographics based on block type and content
 */
export const generateInfographic = (blockType: string, content: string): any => {
    switch (blockType) {
        case 'financial':
            return generateWaterfallChart(content);
        case 'roadmap':
            return generateTimeline(content);
        case 'risks':
            return generateHeatmap(content);
        case 'pillar':
            return generateStrategyBar(content);
        default:
            return null;
    }
};

const generateWaterfallChart = (_content: string): any => {
    return {
        type: 'waterfall',
        title: 'Financial Impact',
        data: [
            { label: 'Base Revenue', value: 100 },
            { label: 'Pillar 1 Impact', value: 15 },
            { label: 'Pillar 2 Impact', value: 10 },
            { label: 'Pillar 3 Impact', value: 8 },
            { label: 'Costs', value: -5 },
            { label: 'Net Impact', value: 128, isFinal: true },
        ],
    };
};

const generateTimeline = (content: string): any => {
    // Parse timeline phases from content
    const phases = content.split(/\d+\.|phase|Phase/i).filter(p => p.trim().length > 0);

    return {
        type: 'timeline',
        title: 'Implementation Roadmap',
        phases: phases.slice(0, 3).map((phase, idx) => ({
            quarter: `Q${idx + 1}`,
            title: `Phase ${idx + 1}`,
            description: phase.trim().substring(0, 50),
        })),
    };
};

const generateHeatmap = (content: string): any => {
    // Parse risks from content
    const risks = content.split(/risk|Risk|,/).filter(r => r.trim().length > 0);

    return {
        type: 'heatmap',
        title: 'Risk Assessment',
        risks: risks.slice(0, 3).map((risk, idx) => ({
            id: idx,
            name: risk.trim().substring(0, 30),
            likelihood: Math.random() * 10,
            impact: Math.random() * 10,
        })),
    };
};

const generateStrategyBar = (_content: string): any => {
    return {
        type: 'bar',
        title: 'Strategic Pillar Impact',
        data: [
            { label: 'Revenue', value: 70 },
            { label: 'Cost Savings', value: 50 },
            { label: 'Speed', value: 85 },
        ],
    };
};
