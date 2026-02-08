import type { Slide } from '../context/DeckContext';
import type { SlideIntent, SlideSpec } from '../types/deck';

type VisualChoice = {
    visualType: SlideSpec['visualType'];
    slideType: Slide['type'];
};

const INTENT_VISUAL_MAP: Record<SlideIntent, SlideSpec['visualType']> = {
    strategy: 'flow',
    finance: 'waterfall',
    roadmap: 'timeline',
    risk: '2x2',
    insight: '2x2',
};

const VISUAL_SLIDE_MAP: Record<SlideSpec['visualType'], Slide['type']> = {
    '2x2': 'HarveyBallMatrix',
    flow: 'ChevronProcess',
    pyramid: 'ChevronProcess',
    waterfall: 'WaterfallBridge',
    timeline: 'StrategicRoadmap',
    bar: 'MarketSizingSlide',
};

export const selectVisual = (
    intent: SlideIntent,
    override?: SlideSpec['visualType']
): VisualChoice => {
    const visualType = override || INTENT_VISUAL_MAP[intent];
    const slideType = VISUAL_SLIDE_MAP[visualType] || 'MarketSizingSlide';

    return { visualType, slideType };
};
