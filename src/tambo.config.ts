import { z } from "zod";
// IMPORT COMPONENTS DIRECTLY - DO NOT IMPORT FROM BARREL FILES (index.ts)
import { MarketSizingSlide } from "./components/slides/MarketSizingSlide";
import { HarveyBallMatrix } from "./components/slides/HarveyBallMatrix";
import { ChevronProcess } from "./components/slides/ChevronProcess";
import { WaterfallBridge } from "./components/slides/WaterfallBridge";
import { TitleSlide } from "./components/slides/TitleSlide";
import { StrategicRoadmap } from "./components/slides/StrategicRoadmap";
import { FinancialImpactSlide } from "./components/slides/FinancialImpactSlide";

// Define Schemas SEPARATELY (Best practice for Tambo Registry)
const WaterfallSchema = z.object({
    phase: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    actionTitle: z.string().optional().describe("Full sentence insight. E.g. 'Margins improve by 5% due to cost savings.'"),
    kicker: z.string().optional().describe("Strategic implication."),
    section: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    variant: z.enum(['default', 'minimal']).optional().describe("Use 'minimal' for simple, high-impact slides. NEVER use same layout twice."),
    theme: z.enum(['tech', 'finance', 'healthcare', 'energy', 'retail', 'manufacturing', 'consulting', 'marketing']).optional().describe("Industry theme: tech=blue, finance=green, healthcare=red, energy=amber, retail=purple, manufacturing=indigo, consulting=teal, marketing=pink. Choose based on context."),
    steps: z.array(z.object({
        label: z.string().optional(),
        value: z.number().optional(),
        type: z.enum(['plus', 'minus', 'total', 'subtotal']).optional().describe("'total' for start/end bars. 'plus' for gains, 'minus' for costs.")
    })).optional(),
    source: z.string().optional().describe("Source of data (e.g. 'Annual Report 2023')")
});

const HarveyBallSchema = z.object({
    phase: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    actionTitle: z.string().optional(),
    kicker: z.string().optional(),
    section: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    variant: z.enum(['default', 'minimal']).optional(),
    theme: z.enum(['tech', 'finance', 'healthcare', 'energy', 'retail', 'manufacturing', 'consulting', 'marketing']).optional().describe("Industry theme: tech=blue, finance=green, healthcare=red, energy=amber, retail=purple, manufacturing=indigo, consulting=teal, marketing=pink. Choose based on context."),
    columns: z.array(z.string()).optional().describe("The options being compared (e.g. ['Us', 'Competitor A'])"),
    rows: z.array(z.string()).optional().describe("The criteria (e.g. ['Price', 'Quality'])"),
    scores: z.array(z.array(z.number().optional())).optional().describe("2D Array of scores (0=Empty, 1=Half, 2=Full). Row x Col."),
    source: z.string().optional().describe("Basis of comparison")
});

const ChevronSchema = z.object({
    phase: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    actionTitle: z.string().optional(),
    kicker: z.string().optional(),
    section: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    variant: z.enum(['default', 'minimal']).optional(),
    theme: z.enum(['tech', 'finance', 'healthcare', 'energy', 'retail', 'manufacturing', 'consulting', 'marketing']).optional().describe("Industry theme: tech=blue, finance=green, healthcare=red, energy=amber, retail=purple, manufacturing=indigo, consulting=teal, marketing=pink. Choose based on context."),
    steps: z.array(z.object({
        title: z.string().optional().describe("Phase Name (e.g. 'Mobilize')"),
        bullets: z.array(z.string()).optional().describe("Key activities in this phase")
    })).optional(),
    source: z.string().optional()
});

const MarketSizingSchema = z.object({
    phase: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    actionTitle: z.string().optional(),
    kicker: z.string().optional(),
    theme: z.enum(['tech', 'finance', 'healthcare', 'energy', 'retail', 'manufacturing', 'consulting', 'marketing']).optional().describe("Industry theme: tech=blue, finance=green, healthcare=red, energy=amber, retail=purple, manufacturing=indigo, consulting=teal, marketing=pink. Choose based on context."),
    segments: z.array(z.object({
        name: z.string().optional(),
        value: z.number().optional(),
        growth: z.string().optional().describe("CAGR percentage"),
        source: z.string().optional()
    })).optional(),
    section: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    variant: z.enum(['default', 'minimal']).optional()
});

const TitleSlideSchema = z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    presenter: z.string().optional()
});

const StrategicRoadmapSchema = z.object({
    actionTitle: z.string().optional(),
    kicker: z.string().optional(),
    section: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    phase: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    phases: z.array(z.object({
        phase: z.string().optional(),
        duration: z.string().optional(),
        milestones: z.array(z.string()).optional()
    })).optional(),
    source: z.string().optional()
});

const FinancialImpactSchema = z.object({
    actionTitle: z.string().optional(),
    kicker: z.string().optional(),
    section: z.enum(['Context', 'Analysis', 'Strategy', 'Impact']).optional(),
    assumptions: z.string().optional(),
    data: z.array(z.object({
        year: z.string(),
        value: z.number(),
        type: z.enum(['Base', 'Bull', 'Bear'])
    })).optional(),
    source: z.string().optional()
});

// Export the Tools Array
// CRITICAL: 'component' must be the function reference, NOT <Component />
export const STRATIFY_TOOLS = [
    {
        name: "TitleSlide",
        component: TitleSlide,
        description: "Title slide for case title, subtitle, and presenter.",
        propsSchema: TitleSlideSchema,
    },
    {
        name: "WaterfallBridge",
        component: WaterfallBridge,
        description: "Financial bridge chart. Use for: Profitability Analysis, Cost Reduction, Revenue Bridges, or P&L walks.",
        propsSchema: WaterfallSchema,
    },
    {
        name: "HarveyBallMatrix",
        component: HarveyBallMatrix,
        description: "Qualitative comparison matrix. Use for: Competitor Benchmarking, Vendor Selection, Risk Assessment, or Option Evaluation.",
        propsSchema: HarveyBallSchema,
    },
    {
        name: "ChevronProcess",
        component: ChevronProcess,
        description: "Linear process flow. Use for: Strategic Roadmaps, Implementation Timelines, or Go-to-Market Plans.",
        propsSchema: ChevronSchema,
    },
    {
        name: "StrategicRoadmap",
        component: StrategicRoadmap,
        description: "Chevron roadmap with phases and milestones for implementation plans.",
        propsSchema: StrategicRoadmapSchema,
    },
    {
        name: "MarketSizingSlide",
        component: MarketSizingSlide,
        description: "Market breakdown chart. Use for: TAM/SAM/SOM, Market Segmentation, or Growth Analysis.",
        propsSchema: MarketSizingSchema,
    },
    {
        name: "FinancialImpactSlide",
        component: FinancialImpactSlide,
        description: "Financial impact chart with base/bull/bear scenarios.",
        propsSchema: FinancialImpactSchema,
    }
];
