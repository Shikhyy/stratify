export type SlideType =
    | 'TitleSlide'
    | 'MarketSizingSlide'
    | 'CompetitorBenchmarking'
    | 'StrategicRoadmap'
    | 'FinancialImpactSlide'
    | 'WaterfallBridge'
    | 'HarveyBallMatrix'
    | 'ChevronProcess'
    | 'UnitEconomics';

export type Section = 'Context' | 'Analysis' | 'Strategy' | 'Impact';

export interface ConsultingLayoutProps {
    actionTitle?: string;
    kicker?: string;
    section?: Section;
    phase?: Section; // Alias for section often used in AI response
    source?: string;
}

export interface MarketSizingProps extends ConsultingLayoutProps {
    segments?: { name?: string; value?: number; growth?: string; source?: string }[];
}

export interface WaterfallProps extends ConsultingLayoutProps {
    steps?: { label?: string; value?: number; type?: 'plus' | 'minus' | 'total' | 'subtotal' }[];
}

export interface UnitEconomicsProps extends ConsultingLayoutProps {
    cac?: number;
    ltv?: number;
    ltvCacRatio?: number;
    paybackPeriod?: number;
}

export interface FinancialImpactProps extends ConsultingLayoutProps {
    data?: { year: string; revenue: number; ebitda: number }[];
}

export interface HarveyBallProps extends ConsultingLayoutProps {
    columns?: string[];
    rows?: string[];
    scores?: number[][];
}

export interface ChevronProps extends ConsultingLayoutProps {
    steps?: { title?: string; bullets?: string[] }[];
}

export interface SlideData {
    id: string;
    type: SlideType;
    props: any; // We cast this inside the drawers
    theme: {
        primary: string;
        secondary: string;
    };
}
