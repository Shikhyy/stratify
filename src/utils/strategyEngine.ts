import type { CaseInput, PitchBlock, JudgeScore } from '../context/PitchContext';
import type { Slide } from '../context/DeckContext';
import type { SlideSpec } from '../types/deck';
import { selectVisual } from './infographicEngine';

export type CaseType = 'growth' | 'profitability' | 'market-entry' | 'turnaround' | 'adoption' | 'other';

export interface CaseDeconstruction {
    objective: string;
    constraints: string[];
    successMetric: string;
    caseType: CaseType;
}

export interface InsightItem {
    id: string;
    statement: string;
    impactRank: number;
}

export interface StorylineSlide {
    id: string;
    key: string;
    question: string;
    headline: string;
    bullets: string[];
    visualType: 'bar' | 'waterfall' | 'flow' | 'matrix' | 'timeline' | 'title';
    slideType: Slide['type'];
    props: Record<string, any>;
    spec: SlideSpec;
}

const toSlug = (value: string) =>
    value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

const toLegacyVisualType = (visualType: SlideSpec['visualType']): StorylineSlide['visualType'] => {
    switch (visualType) {
        case '2x2':
            return 'matrix';
        case 'pyramid':
            return 'flow';
        case 'bar':
        case 'flow':
        case 'waterfall':
        case 'timeline':
            return visualType;
        default:
            return 'flow';
    }
};

const classifyCaseType = (problemStatement: string, targetMetric: string): CaseType => {
    const text = `${problemStatement} ${targetMetric}`.toLowerCase();

    if (/(margin|profit|cost|ebitda|opex)/.test(text)) return 'profitability';
    if (/(growth|revenue|sales|market share|expansion)/.test(text)) return 'growth';
    if (/(adoption|users|activation|retention|engagement)/.test(text)) return 'adoption';
    if (/(market entry|launch|new market|new geography)/.test(text)) return 'market-entry';
    if (/(turnaround|decline|loss|stagnation)/.test(text)) return 'turnaround';

    return 'other';
};

export const deconstructCase = (input: CaseInput): CaseDeconstruction => {
    const caseType = classifyCaseType(input.problemStatement, input.targetMetric);

    return {
        objective: `Achieve ${input.targetMetric} for ${input.caseTitle}`,
        constraints: [input.constraints].filter(Boolean),
        successMetric: input.targetMetric,
        caseType,
    };
};

export const generateInsights = (input: CaseInput, deconstruction: CaseDeconstruction): InsightItem[] => {
    const base = `in the ${input.industry} context`;
    const insights: string[] = [];

    switch (deconstruction.caseType) {
        case 'profitability':
            insights.push(`Most margin leakage is fixed-cost driven ${base}, so resizing the cost base unlocks the fastest gains.`);
            insights.push(`Revenue uplift alone cannot close the gap; the break-even point requires structural cost actions.`);
            insights.push(`The constraint (${input.constraints}) forces a phased rollout focused on high-ROI levers.`);
            break;
        case 'growth':
            insights.push(`Growth is concentrated in a narrow segment ${base}; prioritizing that wedge accelerates scale.`);
            insights.push(`Core segments are saturated, so adjacency expansion is the primary upside driver.`);
            insights.push(`Constraints (${input.constraints}) make partnerships the fastest path to reach the target.`);
            break;
        case 'adoption':
            insights.push(`Adoption is blocked by activation friction ${base}; removing the top step lifts conversion materially.`);
            insights.push(`Retention is the real growth lever, not new acquisition, given the stated constraints.`);
            insights.push(`Target metrics (${input.targetMetric}) require behavior change, not just feature delivery.`);
            break;
        case 'market-entry':
            insights.push(`A focused beachhead ${base} creates a defensible entry point faster than broad coverage.`);
            insights.push(`Success depends on proving unit economics early before scaling distribution.`);
            insights.push(`Constraints (${input.constraints}) imply staged investment with rapid learning cycles.`);
            break;
        case 'turnaround':
            insights.push(`The decline is operationally driven ${base}; stabilizing execution precedes growth.`);
            insights.push(`Cash preservation is the limiting factor, so near-term fixes must be self-funding.`);
            insights.push(`Target metrics (${input.targetMetric}) require a two-speed plan: fix core, then expand.`);
            break;
        default:
            insights.push(`The highest-impact lever ${base} is underexploited and drives most of the gap.`);
            insights.push(`Constraints (${input.constraints}) narrow the solution to a few scalable moves.`);
            insights.push(`The target metric (${input.targetMetric}) is achievable if execution sequencing is correct.`);
    }

    return insights.map((statement, idx) => ({
        id: `insight-${idx + 1}`,
        statement,
        impactRank: idx + 1,
    }));
};

const buildPillars = (caseType: CaseType): { title: string; bullets: string[] }[] => {
    switch (caseType) {
        case 'profitability':
            return [
                { title: 'Cost Reset', bullets: ['Fix fixed costs', 'Zero-base spend', 'Rapid payback'] },
                { title: 'Revenue Quality', bullets: ['Price discipline', 'Mix shift', 'Value-based offers'] },
                { title: 'Operating Leverage', bullets: ['Automation', 'Process redesign', 'Scale benefits'] },
            ];
        case 'growth':
            return [
                { title: 'Targeted Expansion', bullets: ['Focus growth wedge', 'Prioritize segments', 'Fast wins'] },
                { title: 'Channel Acceleration', bullets: ['Partnerships', 'Digital funnel', 'Sales productivity'] },
                { title: 'Retention Flywheel', bullets: ['Reduce churn', 'Upsell', 'Referral engine'] },
            ];
        case 'adoption':
            return [
                { title: 'Activation Fix', bullets: ['Remove friction', 'Improve onboarding', 'Time-to-value'] },
                { title: 'Value Reinforcement', bullets: ['Habit loops', 'Personalization', 'Trust signals'] },
                { title: 'Scaled Awareness', bullets: ['In-product nudges', 'Advocacy', 'Low-cost reach'] },
            ];
        case 'market-entry':
            return [
                { title: 'Beachhead Entry', bullets: ['Pick niche', 'Win reference accounts', 'Proof of value'] },
                { title: 'Distribution Build', bullets: ['Partner network', 'Localized GTM', 'Lead pipeline'] },
                { title: 'Scale Economics', bullets: ['Unit economics', 'Repeatable playbook', 'Capital efficiency'] },
            ];
        case 'turnaround':
            return [
                { title: 'Stabilize Core', bullets: ['Fix delivery', 'Reduce leakage', 'Protect cash'] },
                { title: 'Selective Growth', bullets: ['Defend winners', 'Exit losers', 'Focus resources'] },
                { title: 'Transform Engine', bullets: ['Ops redesign', 'New capabilities', 'Reinvest savings'] },
            ];
        default:
            return [
                { title: 'Focus', bullets: ['Clarify objective', 'Align resources', 'Remove noise'] },
                { title: 'Execute', bullets: ['Rapid pilots', 'Operational discipline', 'Scaled rollout'] },
                { title: 'Sustain', bullets: ['KPI cadence', 'Ownership', 'Continuous improvement'] },
            ];
    }
};

export const buildStorylineOutline = (
    input: CaseInput,
    deconstruction: CaseDeconstruction,
    insights: InsightItem[]
): StorylineSlide[] => {
    const coreInsight = insights[0]?.statement || 'Core insight anchors the recommendation.';
    const pillars = buildPillars(deconstruction.caseType);
    const slug = toSlug(input.caseTitle || 'case');

    const execVisual = selectVisual('strategy', 'flow');
    const problemVisual = selectVisual('insight', 'bar');
    const insightVisual = selectVisual('insight', '2x2');
    const strategyVisual = selectVisual('strategy', 'flow');
    const pillar1Visual = selectVisual('strategy', 'waterfall');
    const pillar2Visual = selectVisual('strategy', '2x2');
    const pillar3Visual = selectVisual('strategy', 'bar');
    const financialVisual = selectVisual('finance', 'waterfall');
    const roadmapVisual = selectVisual('roadmap', 'timeline');
    const riskVisual = selectVisual('risk', '2x2');
    const closingVisual = selectVisual('insight', 'flow');

    const storyline: StorylineSlide[] = [
        {
            id: `${slug}-exec-summary`,
            key: 'executive-summary',
            question: 'What should the team do right now?',
            headline: `Recommendation: pursue a focused 3-pillar plan to hit ${input.targetMetric}.`,
            bullets: pillars.map(p => p.title).slice(0, 3),
            visualType: toLegacyVisualType(execVisual.visualType),
            slideType: execVisual.slideType,
            props: {
                actionTitle: 'Executive Summary',
                kicker: coreInsight,
                section: 'Strategy',
                steps: pillars.map(p => ({ title: p.title, bullets: p.bullets }))
            },
            spec: {
                slideType: 'strategy',
                headline: `Recommendation: pursue a focused 3-pillar plan to hit ${input.targetMetric}.`,
                keyPoints: pillars.map(p => p.title).slice(0, 3),
                visualType: execVisual.visualType,
                visualData: {
                    steps: pillars.map(p => ({ title: p.title, bullets: p.bullets }))
                },
                takeaway: coreInsight
            }
        },
        {
            id: `${slug}-problem`,
            key: 'problem-definition',
            question: 'What is the exact problem and target?',
            headline: `Objective: ${deconstruction.objective}.`,
            bullets: [
                `Constraint: ${input.constraints}`,
                `Success metric: ${deconstruction.successMetric}`,
                `Case type: ${deconstruction.caseType.replace('-', ' ')}`
            ],
            visualType: toLegacyVisualType(problemVisual.visualType),
            slideType: problemVisual.slideType,
            props: {
                actionTitle: 'Problem Definition',
                kicker: `Target: ${deconstruction.successMetric}`,
                section: 'Context',
                segments: [
                    { name: 'Target Gap', value: 100, growth: '15%' },
                    { name: 'Addressable Lever', value: 75, growth: '12%' },
                    { name: 'Within Constraints', value: 60, growth: '10%' }
                ]
            },
            spec: {
                slideType: 'insight',
                headline: `Objective: ${deconstruction.objective}.`,
                keyPoints: [
                    `Constraint: ${input.constraints}`,
                    `Success metric: ${deconstruction.successMetric}`,
                    `Case type: ${deconstruction.caseType.replace('-', ' ')}`
                ],
                visualType: problemVisual.visualType,
                visualData: {
                    segments: [
                        { name: 'Target Gap', value: 100, growth: '15%' },
                        { name: 'Addressable Lever', value: 75, growth: '12%' },
                        { name: 'Within Constraints', value: 60, growth: '10%' }
                    ]
                },
                takeaway: `Target: ${deconstruction.successMetric}`
            }
        },
        {
            id: `${slug}-insight`,
            key: 'key-insight',
            question: 'What non-obvious insight changes the strategy?',
            headline: coreInsight,
            bullets: insights.slice(0, 3).map(i => i.statement),
            visualType: toLegacyVisualType(insightVisual.visualType),
            slideType: insightVisual.slideType,
            props: {
                actionTitle: 'Key Insight',
                kicker: 'Insight shifts the decision logic.',
                section: 'Analysis',
                columns: ['Current', 'Target'],
                rows: ['Cost Base', 'Growth Engine', 'Execution Speed'],
                scores: [
                    [1, 2],
                    [0, 2],
                    [1, 2]
                ]
            },
            spec: {
                slideType: 'insight',
                headline: coreInsight,
                keyPoints: insights.slice(0, 3).map(i => i.statement),
                visualType: insightVisual.visualType,
                visualData: {
                    columns: ['Current', 'Target'],
                    rows: ['Cost Base', 'Growth Engine', 'Execution Speed'],
                    scores: [
                        [1, 2],
                        [0, 2],
                        [1, 2]
                    ]
                },
                takeaway: 'Insight shifts the decision logic.'
            }
        },
        {
            id: `${slug}-strategy`,
            key: 'strategy-overview',
            question: 'How do we structure the solution?',
            headline: 'Strategy built around three mutually reinforcing pillars.',
            bullets: pillars.map(p => p.title).slice(0, 3),
            visualType: toLegacyVisualType(strategyVisual.visualType),
            slideType: strategyVisual.slideType,
            props: {
                actionTitle: 'Strategy Overview',
                kicker: 'Each pillar addresses a distinct constraint.',
                section: 'Strategy',
                steps: pillars.map(p => ({ title: p.title, bullets: p.bullets }))
            },
            spec: {
                slideType: 'strategy',
                headline: 'Strategy built around three mutually reinforcing pillars.',
                keyPoints: pillars.map(p => p.title).slice(0, 3),
                visualType: strategyVisual.visualType,
                visualData: {
                    steps: pillars.map(p => ({ title: p.title, bullets: p.bullets }))
                },
                takeaway: 'Each pillar addresses a distinct constraint.'
            }
        },
        {
            id: `${slug}-pillar-1`,
            key: 'pillar-1',
            question: 'What does pillar 1 deliver?',
            headline: `${pillars[0].title} drives the immediate impact.`,
            bullets: pillars[0].bullets,
            visualType: toLegacyVisualType(pillar1Visual.visualType),
            slideType: pillar1Visual.slideType,
            props: {
                actionTitle: `Pillar 1: ${pillars[0].title}`,
                kicker: 'Delivers 40-45% of target impact in first 90 days.',
                section: 'Strategy',
                steps: [
                    { label: 'Baseline', value: 100, type: 'total' },
                    { label: 'Quick Wins', value: 15, type: 'plus' },
                    { label: 'Core Actions', value: 25, type: 'plus' },
                    { label: 'Pillar 1 Impact', value: 140, type: 'total' }
                ]
            },
            spec: {
                slideType: 'strategy',
                headline: `${pillars[0].title} drives the immediate impact.`,
                keyPoints: pillars[0].bullets.slice(0, 3),
                visualType: pillar1Visual.visualType,
                visualData: {
                    steps: [
                        { label: 'Baseline', value: 100, type: 'total' },
                        { label: 'Quick Wins', value: 15, type: 'plus' },
                        { label: 'Core Actions', value: 25, type: 'plus' },
                        { label: 'Pillar 1 Impact', value: 140, type: 'total' }
                    ]
                },
                takeaway: 'Delivers 40-45% of target impact in first 90 days.'
            }
        },
        {
            id: `${slug}-pillar-2`,
            key: 'pillar-2',
            question: 'What does pillar 2 deliver?',
            headline: `${pillars[1].title} sustains momentum.`,
            bullets: pillars[1].bullets,
            visualType: toLegacyVisualType(pillar2Visual.visualType),
            slideType: pillar2Visual.slideType,
            props: {
                actionTitle: `Pillar 2: ${pillars[1].title}`,
                kicker: 'Scales effectiveness across all segments.',
                section: 'Strategy',
                columns: ['Pre-Initiative', 'Post-Initiative'],
                rows: ['Operational Efficiency', 'Customer Satisfaction', 'Market Position'],
                scores: [
                    [1, 2],
                    [1, 2],
                    [0, 2]
                ]
            },
            spec: {
                slideType: 'strategy',
                headline: `${pillars[1].title} sustains momentum.`,
                keyPoints: pillars[1].bullets.slice(0, 3),
                visualType: pillar2Visual.visualType,
                visualData: {
                    columns: ['Pre-Initiative', 'Post-Initiative'],
                    rows: ['Operational Efficiency', 'Customer Satisfaction', 'Market Position'],
                    scores: [
                        [1, 2],
                        [1, 2],
                        [0, 2]
                    ]
                },
                takeaway: 'Scales effectiveness across all segments.'
            }
        },
        {
            id: `${slug}-pillar-3`,
            key: 'pillar-3',
            question: 'What does pillar 3 deliver?',
            headline: `${pillars[2].title} compounds results.`,
            bullets: pillars[2].bullets,
            visualType: toLegacyVisualType(pillar3Visual.visualType),
            slideType: pillar3Visual.slideType,
            props: {
                actionTitle: `Pillar 3: ${pillars[2].title}`,
                kicker: 'Long-term sustainable advantage.',
                section: 'Strategy',
                segments: [
                    { name: 'Year 1 Impact', value: 25, growth: '15%' },
                    { name: 'Year 2 Impact', value: 50, growth: '20%' },
                    { name: 'Year 3 Target', value: 100, growth: '25%' }
                ]
            },
            spec: {
                slideType: 'strategy',
                headline: `${pillars[2].title} compounds results.`,
                keyPoints: pillars[2].bullets.slice(0, 3),
                visualType: pillar3Visual.visualType,
                visualData: {
                    segments: [
                        { name: 'Year 1 Impact', value: 25, growth: '15%' },
                        { name: 'Year 2 Impact', value: 50, growth: '20%' },
                        { name: 'Year 3 Target', value: 100, growth: '25%' }
                    ]
                },
                takeaway: 'Long-term sustainable advantage.'
            }
        },
        {
            id: `${slug}-financials`,
            key: 'financial-impact',
            question: 'What is the quantified impact?',
            headline: 'Financial impact delivers 130-150% of target metric.',
            bullets: [
                'Pillar 1: Revenue lift +18%',
                'Pillar 2: Cost optimization +12%',
                'Net impact: +30% above baseline'
            ],
            visualType: toLegacyVisualType(financialVisual.visualType),
            slideType: financialVisual.slideType,
            props: {
                actionTitle: 'Financial Impact Bridge',
                kicker: 'Net impact exceeds target by 15-20%.',
                section: 'Impact',
                steps: [
                    { label: 'Baseline ($M)', value: 100, type: 'total' },
                    { label: 'Revenue Growth', value: 18, type: 'plus' },
                    { label: 'Cost Savings', value: 12, type: 'plus' },
                    { label: 'Investment', value: -5, type: 'minus' },
                    { label: 'Net Impact ($M)', value: 125, type: 'total' }
                ],
                source: 'Internal Financial Model'
            },
            spec: {
                slideType: 'finance',
                headline: 'Financial impact delivers 130-150% of target metric.',
                keyPoints: [
                    'Pillar 1: Revenue lift +18%',
                    'Pillar 2: Cost optimization +12%',
                    'Net impact: +30% above baseline'
                ],
                visualType: financialVisual.visualType,
                visualData: {
                    steps: [
                        { label: 'Baseline ($M)', value: 100, type: 'total' },
                        { label: 'Revenue Growth', value: 18, type: 'plus' },
                        { label: 'Cost Savings', value: 12, type: 'plus' },
                        { label: 'Investment', value: -5, type: 'minus' },
                        { label: 'Net Impact ($M)', value: 125, type: 'total' }
                    ]
                },
                takeaway: 'Net impact exceeds target by 15-20%.'
            }
        },
        {
            id: `${slug}-roadmap`,
            key: 'implementation-roadmap',
            question: 'How do we execute without risk?',
            headline: 'Execution plan phases the work to protect speed and quality.',
            bullets: ['Phase 1: Stabilize', 'Phase 2: Scale', 'Phase 3: Optimize'],
            visualType: toLegacyVisualType(roadmapVisual.visualType),
            slideType: roadmapVisual.slideType,
            props: {
                actionTitle: 'Implementation Roadmap',
                kicker: 'Phased rollout reduces risk.',
                section: 'Strategy',
                phases: [
                    { phase: 'Phase 1', duration: 'Months 1-2', milestones: ['Mobilize team', 'Pilot key moves'] },
                    { phase: 'Phase 2', duration: 'Months 3-5', milestones: ['Scale wins', 'Lock KPIs'] },
                    { phase: 'Phase 3', duration: 'Months 6-9', milestones: ['Optimize', 'Sustain gains'] }
                ]
            },
            spec: {
                slideType: 'roadmap',
                headline: 'Execution plan phases the work to protect speed and quality.',
                keyPoints: ['Phase 1: Stabilize', 'Phase 2: Scale', 'Phase 3: Optimize'],
                visualType: roadmapVisual.visualType,
                visualData: {
                    phases: [
                        { phase: 'Phase 1', duration: 'Months 1-2', milestones: ['Mobilize team', 'Pilot key moves'] },
                        { phase: 'Phase 2', duration: 'Months 3-5', milestones: ['Scale wins', 'Lock KPIs'] },
                        { phase: 'Phase 3', duration: 'Months 6-9', milestones: ['Optimize', 'Sustain gains'] }
                    ]
                },
                takeaway: 'Phased rollout reduces risk.'
            }
        },
        {
            id: `${slug}-risks`,
            key: 'risks-mitigations',
            question: 'What could derail the plan, and how do we mitigate it?',
            headline: 'Top 3 risks identified with clear mitigation plans.',
            bullets: ['Execution risk: Dedicated PMO', 'Market risk: Phased rollout', 'Resource risk: Cross-functional team'],
            visualType: toLegacyVisualType(riskVisual.visualType),
            slideType: riskVisual.slideType,
            props: {
                actionTitle: 'Risk Assessment Matrix',
                kicker: 'All critical risks have active mitigations.',
                section: 'Impact',
                columns: ['Likelihood', 'Impact', 'Mitigation Strength'],
                rows: ['Execution Delays', 'Market Adoption', 'Competitive Response'],
                scores: [
                    [1, 2, 2],
                    [2, 2, 1],
                    [1, 1, 2]
                ],
                source: 'Risk Assessment Workshop'
            },
            spec: {
                slideType: 'risk',
                headline: 'Top 3 risks identified with clear mitigation plans.',
                keyPoints: ['Execution risk: Dedicated PMO', 'Market risk: Phased rollout', 'Resource risk: Cross-functional team'],
                visualType: riskVisual.visualType,
                visualData: {
                    columns: ['Likelihood', 'Impact', 'Mitigation Strength'],
                    rows: ['Execution Delays', 'Market Adoption', 'Competitive Response'],
                    scores: [
                        [1, 2, 2],
                        [2, 2, 1],
                        [1, 1, 2]
                    ]
                },
                takeaway: 'All critical risks have active mitigations.'
            }
        },
        {
            id: `${slug}-closing`,
            key: 'closing-impact',
            question: 'What is the final outcome?',
            headline: 'The plan delivers a defensible, judge-ready outcome.',
            bullets: ['Clear impact', 'Credible execution', 'Sustainable advantage'],
            visualType: toLegacyVisualType(closingVisual.visualType),
            slideType: 'TitleSlide',
            props: {
                title: 'Strategic Advantage',
                subtitle: `Delivering ${input.targetMetric} with a focused plan`,
                presenter: 'Stratify AI'
            },
            spec: {
                slideType: 'insight',
                headline: 'The plan delivers a defensible, judge-ready outcome.',
                keyPoints: ['Clear impact', 'Credible execution', 'Sustainable advantage'],
                visualType: closingVisual.visualType,
                visualData: {
                    summary: ['Clear impact', 'Credible execution', 'Sustainable advantage']
                },
                takeaway: `Delivering ${input.targetMetric} with a focused plan`
            }
        }
    ];

    return storyline;
};

export const regenerateWeakSlides = (
    storyline: StorylineSlide[],
    score: JudgeScore
): StorylineSlide[] => {
    const trimToThree = (items: string[]) => items.slice(0, 3);

    const next = storyline.map(slide => {
        if (slide.key === 'key-insight' && score.insightStrength < 7) {
            const updatedBullets = [
                'Gap is concentrated in one controllable lever.',
                'Constraint forces sequencing, not scope.',
                'Fast wins fund the longer-term move.'
            ];

            return {
                ...slide,
                headline: slide.headline.startsWith('Core insight')
                    ? slide.headline
                    : `Core insight: ${slide.headline}`,
                bullets: updatedBullets,
                props: {
                    ...slide.props,
                    kicker: 'Insight directly changes decision priority.'
                },
                spec: {
                    ...slide.spec,
                    headline: slide.headline.startsWith('Core insight')
                        ? slide.headline
                        : `Core insight: ${slide.headline}`,
                    keyPoints: updatedBullets,
                    takeaway: 'Insight directly changes decision priority.'
                }
            };
        }

        if (slide.key === 'financial-impact' && score.financialLogic < 7) {
            const bullets = [
                'Revenue lift: +$18M (pricing + mix)',
                'Cost savings: +$12M (process + automation)',
                'Net impact: +$25M after $5M investment'
            ];

            const steps = [
                { label: 'Baseline ($M)', value: 100, type: 'total' },
                { label: 'Revenue Growth', value: 18, type: 'plus' },
                { label: 'Cost Savings', value: 12, type: 'plus' },
                { label: 'Investment', value: -5, type: 'minus' },
                { label: 'Net Impact ($M)', value: 125, type: 'total' }
            ];

            return {
                ...slide,
                bullets,
                props: {
                    ...slide.props,
                    kicker: 'ROI positive within 6 months.',
                    steps
                },
                spec: {
                    ...slide.spec,
                    keyPoints: bullets,
                    visualData: { ...slide.spec.visualData, steps },
                    takeaway: 'ROI positive within 6 months.'
                }
            };
        }

        if (slide.key === 'implementation-roadmap' && score.feasibility < 7) {
            const bullets = ['Phase 1: Mobilize', 'Phase 2: Scale', 'Phase 3: Embed'];
            const phases = [
                { phase: 'Phase 1', duration: 'Months 1-2', milestones: ['PMO setup', 'Pilot launches', 'KPI baseline'] },
                { phase: 'Phase 2', duration: 'Months 3-5', milestones: ['Scale pilots', 'Process redesign', 'Training'] },
                { phase: 'Phase 3', duration: 'Months 6-9', milestones: ['Embed cadence', 'Audit results', 'Sustain'] }
            ];

            return {
                ...slide,
                bullets,
                props: {
                    ...slide.props,
                    kicker: 'Ownership and milestones de-risk execution.',
                    phases
                },
                spec: {
                    ...slide.spec,
                    keyPoints: bullets,
                    visualData: { ...slide.spec.visualData, phases },
                    takeaway: 'Ownership and milestones de-risk execution.'
                }
            };
        }

        if (slide.key === 'risks-mitigations' && score.feasibility < 7) {
            const bullets = [
                'Execution risk: PMO + weekly cadence',
                'Market risk: staged rollout + feedback',
                'Capability risk: training + owners'
            ];

            return {
                ...slide,
                bullets,
                props: {
                    ...slide.props,
                    kicker: 'Risks are mitigated with ownership and cadence.'
                },
                spec: {
                    ...slide.spec,
                    keyPoints: bullets,
                    takeaway: 'Risks are mitigated with ownership and cadence.'
                }
            };
        }

        return slide;
    });

    if (score.clarity < 7) {
        return next.map(slide => ({
            ...slide,
            bullets: trimToThree(slide.bullets),
            spec: {
                ...slide.spec,
                keyPoints: trimToThree(slide.spec.keyPoints)
            }
        }));
    }

    return next;
};

export const buildSlidesFromStoryline = (storyline: StorylineSlide[]): Slide[] => {
    return storyline.map((slide, idx) => ({
        id: `${slide.id}-${idx}`,
        type: slide.slideType,
        props: slide.props,
    }));
};

export const buildBlocksFromStoryline = (
    storyline: StorylineSlide[],
    input: CaseInput,
    deconstruction: CaseDeconstruction,
    insights: InsightItem[]
): PitchBlock[] => {
    const now = Date.now();
    const find = (key: string) => storyline.find(slide => slide.key === key);

    const blocks: PitchBlock[] = [];

    blocks.push({
        id: `block-${now}-problem`,
        type: 'problem',
        title: 'Problem Definition',
        content: [
            `Objective: ${deconstruction.objective}`,
            `Constraints: ${input.constraints}`,
            `Success metric: ${deconstruction.successMetric}`,
        ].join('\n'),
        locked: false,
        versions: [],
    });

    blocks.push({
        id: `block-${now}-recommendation`,
        type: 'recommendation',
        title: 'Our Recommendation',
        content: find('executive-summary')?.headline || `Recommendation: achieve ${input.targetMetric}.`,
        locked: false,
        versions: [],
    });

    blocks.push({
        id: `block-${now}-insight`,
        type: 'insight',
        title: 'Core Insight',
        content: insights.map(i => `- ${i.statement}`).join('\n'),
        locked: false,
        versions: [],
    });

    const pillarSlides = storyline.filter(slide => slide.key.startsWith('pillar-'));
    pillarSlides.forEach((pillar, idx) => {
        blocks.push({
            id: `block-${now}-pillar-${idx + 1}`,
            type: 'pillar',
            title: `Pillar ${idx + 1}`,
            content: [pillar.headline, ...pillar.bullets].join('\n'),
            locked: false,
            versions: [],
        });
    });

    blocks.push({
        id: `block-${now}-financial`,
        type: 'financial',
        title: 'Financial Impact',
        content: find('financial-impact')?.headline || 'Financial impact summary.',
        locked: false,
        versions: [],
    });

    blocks.push({
        id: `block-${now}-roadmap`,
        type: 'roadmap',
        title: 'Implementation Roadmap',
        content: (find('implementation-roadmap')?.bullets || []).join('\n') || 'Phased execution roadmap.',
        locked: false,
        versions: [],
    });

    blocks.push({
        id: `block-${now}-risks`,
        type: 'risks',
        title: 'Risks & Mitigations',
        content: (find('risks-mitigations')?.bullets || []).join('\n') || 'Risks and mitigations.',
        locked: false,
        versions: [],
    });

    blocks.push({
        id: `block-${now}-impact`,
        type: 'impact',
        title: 'Final Impact Statement',
        content: find('closing-impact')?.headline || `Deliver ${input.targetMetric}.`,
        locked: false,
        versions: [],
    });

    return blocks;
};
