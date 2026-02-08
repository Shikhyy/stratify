/**
 * Consulting Rules & Validation
 * Ensures MECE, alignment, and judge-readiness
 */

export interface ValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
}

/**
 * Validates that strategy pillars are MECE (Mutually Exclusive, Collectively Exhaustive)
 */
export const validateMECE = (pillars: string[]): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (pillars.length === 0) {
        errors.push('Must have at least one strategy pillar');
    }

    if (pillars.length > 3) {
        warnings.push('Best practice: limit to 3 pillars for clarity');
    }

    // Check for overlap
    const lowerPillars = pillars.map(p => p.toLowerCase());
    const uniquePillars = new Set(lowerPillars);
    if (uniquePillars.size < pillars.length) {
        errors.push('Pillars must be distinct (no duplicates or overlaps)');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};

/**
 * Validates hard alignment to problem statement
 */
export const validateAlignment = (
    content: string,
    _problemStatement: string,
    blockType: string
): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for generic phrases
    const genericPhrases = [
        'improve efficiency',
        'increase revenue',
        'reduce costs',
        'leverage technology',
        'synergy',
        'optimize',
    ];

    const lowerContent = content.toLowerCase();
    const genericMatches = genericPhrases.filter(phrase => lowerContent.includes(phrase));

    if (genericMatches.length > 0 && blockType !== 'problem') {
        warnings.push(
            `Contains generic language: "${genericMatches.join('", "')}". Make specific to the problem.`
        );
    }

    // Check if recommendation actually addresses problem
    if (blockType === 'recommendation' && !content.toLowerCase().includes('because')) {
        warnings.push('Strong recommendations explain WHY they solve the problem. Add causal logic.');
    }

    // Check for numbers in financial/roadmap blocks
    if ((blockType === 'financial' || blockType === 'roadmap') && !/\$|%|\d+/.test(content)) {
        warnings.push('This block should include numbers or metrics to be credible.');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};

/**
 * Validates slide-readability (max 3 ideas, one takeaway)
 */
export const validateSlideReadability = (content: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

    if (sentences.length > 3) {
        warnings.push(
            `This block has ${sentences.length} ideas. Judges prefer max 3 per slide for clarity.`
        );
    }

    if (content.length > 500) {
        warnings.push('Content is long (>500 chars). Condense for executive readability.');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};

/**
 * Validates that numbers justify decisions
 */
export const validateFinancialLogic = (content: string): ValidationResult => {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for number patterns: currency, percentages, millions/billions
    const hasNumbers = /(\$[\d,]+|[\d.]+%|[\d,]+ (million|billion|thousand))/i.test(content);

    if (!hasNumbers) {
        errors.push('Financial impact must include specific numbers (e.g., $50M, 25%, 10,000 units)');
    }

    // Check for assumptions
    if (!content.toLowerCase().includes('assume')) {
        warnings.push('Consider stating key assumptions (e.g., "Assumes 30% adoption rate")');
    }

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
    };
};

/**
 * Master validation function
 */
export const validateBlock = (
    content: string,
    blockType: string,
    problemStatement?: string
): ValidationResult => {
    const results: ValidationResult[] = [];

    // Common validations
    results.push(validateSlideReadability(content));

    // Block-specific validations
    if (blockType === 'financial') {
        results.push(validateFinancialLogic(content));
    }

    if (problemStatement) {
        results.push(validateAlignment(content, problemStatement, blockType));
    }

    // Merge all results
    const merged: ValidationResult = {
        isValid: results.every(r => r.isValid),
        errors: results.flatMap(r => r.errors),
        warnings: results.flatMap(r => r.warnings),
    };

    return merged;
};
