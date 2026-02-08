import type { JudgeScore } from '../context/PitchContext';

/**
 * Judge Evaluator Hook
 * Simulates a case competition judge evaluating the pitch
 */

export const useJudgeEvaluator = () => {
    const evaluatePitch = async (blocks: any[], _problemStatement: string): Promise<JudgeScore> => {
        // In production, this would call a Tambo tool for the judge evaluation
        // For now, we'll simulate a realistic scoring based on block content

        const clarity = calculateClarity(blocks);
        const insightStrength = calculateInsightStrength(blocks);
        const feasibility = calculateFeasibility(blocks);
        const financialLogic = calculateFinancialLogic(blocks);

        const overall = (clarity + insightStrength + feasibility + financialLogic) / 4;

        const feedback = generateFeedback(clarity, insightStrength, feasibility, financialLogic);
        const improvements = generateImprovements(blocks, clarity, insightStrength, feasibility);

        return {
            clarity,
            insightStrength,
            feasibility,
            financialLogic,
            overall: Math.round(overall * 10) / 10,
            feedback,
            improvements,
        };
    };

    const calculateClarity = (blocks: any[]): number => {
        let score = 8;
        blocks.forEach(block => {
            const length = block.content.length;
            if (length > 500) score -= 1;
            if (length < 50) score -= 0.5;
        });
        return Math.max(1, Math.min(10, score));
    };

    const calculateInsightStrength = (blocks: any[]): number => {
        const insightBlock = blocks.find((b: any) => b.type === 'insight');
        if (!insightBlock) return 5;

        let score = 7;
        const content = insightBlock.content.toLowerCase();

        // Bonus for non-obvious language
        if (content.includes('non-obvious') || content.includes('counter') || content.includes('leverage')) {
            score += 1;
        }

        // Check if it connects to problem
        if (content.length < 100) {
            score -= 1;
        }

        return Math.max(1, Math.min(10, score));
    };

    const calculateFeasibility = (blocks: any[]): number => {
        const roadmapBlock = blocks.find((b: any) => b.type === 'roadmap');
        const risksBlock = blocks.find((b: any) => b.type === 'risks');

        let score = 7;

        if (!roadmapBlock || roadmapBlock.content.length < 50) score -= 2;
        if (!risksBlock || risksBlock.content.length < 50) score -= 1;

        return Math.max(1, Math.min(10, score));
    };

    const calculateFinancialLogic = (blocks: any[]): number => {
        const financialBlock = blocks.find((b: any) => b.type === 'financial');
        if (!financialBlock) return 4;

        let score = 6;
        const hasNumbers = /(\$[\d,]+|[\d.]+%|[\d,]+ (million|billion|thousand))/i.test(
            financialBlock.content
        );

        if (hasNumbers) score += 2;
        if (financialBlock.content.includes('assume')) score += 1;

        return Math.max(1, Math.min(10, score));
    };

    const generateFeedback = (clarity: number, insight: number, feasibility: number, finance: number): string => {
        if (clarity < 6) {
            return 'Your pitch is unclear. Simplify language and reduce content per slide. Judges need clarity.';
        }
        if (insight < 6) {
            return 'Your core insight is weak. Push deeper: what is non-obvious about this problem?';
        }
        if (feasibility < 6) {
            return 'Your implementation plan lacks detail. Judges want to see how you would actually execute.';
        }
        if (finance < 6) {
            return 'Your financial logic is missing. Add concrete numbers and assumptions to justify ROI.';
        }
        return 'Solid pitch. Strong across clarity, insight, feasibility, and financial logic.';
    };

    const generateImprovements = (blocks: any[], clarity: number, insight: number, feasibility: number): string[] => {
        const improvements: string[] = [];

        if (clarity < 7) {
            improvements.push('Condense each block to max 3 ideas. Judges read fast.');
        }
        if (insight < 7) {
            improvements.push('Strengthen your core insight: ask "What is non-obvious here?" and state it explicitly.');
        }
        if (feasibility < 7) {
            improvements.push('Add a detailed roadmap: phases, timeline, ownership, and milestones.');
        }

        const financialBlock = blocks.find((b: any) => b.type === 'financial');
        if (!financialBlock || financialBlock.content.length < 100) {
            improvements.push('Add financial impact with concrete numbers (revenue, cost savings, ROI %).');
        }

        const risksBlock = blocks.find((b: any) => b.type === 'risks');
        if (!risksBlock || risksBlock.content.length < 50) {
            improvements.push('Identify top 2-3 risks and clear mitigations. Shows thinking maturity.');
        }

        return improvements.slice(0, 3); // Top 3 improvements
    };

    return { evaluatePitch };
};
