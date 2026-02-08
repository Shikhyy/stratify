import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface CaseInput {
    caseTitle: string;
    problemStatement: string;
    constraints: string;
    targetMetric: string;
    industry: string;
}

export interface PitchBlock {
    id: string;
    type: 'problem' | 'recommendation' | 'insight' | 'pillar' | 'financial' | 'roadmap' | 'risks' | 'impact';
    title: string;
    content: string;
    locked: boolean;
    versions: { timestamp: number; content: string }[];
}

export interface JudgeScore {
    clarity: number;
    insightStrength: number;
    feasibility: number;
    financialLogic: number;
    overall: number;
    feedback: string;
    improvements: string[];
}

interface PitchContextType {
    caseInput: CaseInput | null;
    setCaseInput: (input: CaseInput) => void;
    blocks: PitchBlock[];
    setBlocks: (blocks: PitchBlock[]) => void;
    addBlock: (block: PitchBlock) => void;
    updateBlock: (id: string, content: string) => void;
    regenerateBlock: (id: string, instruction?: string) => Promise<void>;
    lockBlock: (id: string) => void;
    deleteBlock: (id: string) => void;
    judgeScore: JudgeScore | null;
    setJudgeScore: (score: JudgeScore) => void;
    isGenerating: boolean;
    setIsGenerating: (value: boolean) => void;
}

const PitchContext = createContext<PitchContextType | undefined>(undefined);

export const PitchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [caseInput, setCaseInput] = useState<CaseInput | null>(null);
    const [blocks, setBlocks] = useState<PitchBlock[]>([]);
    const [judgeScore, setJudgeScore] = useState<JudgeScore | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const addBlock = (block: PitchBlock) => {
        setBlocks(prev => [...prev, block]);
    };

    const updateBlock = (id: string, content: string) => {
        setBlocks(prev =>
            prev.map(block => {
                if (block.id === id) {
                    return {
                        ...block,
                        content,
                        versions: [...block.versions, { timestamp: Date.now(), content: block.content }],
                    };
                }
                return block;
            })
        );
    };

    const regenerateBlock = async (id: string, instruction?: string) => {
        // This will be connected to Tambo in the Dashboard component
        console.log(`Regenerating block ${id}`, instruction);
    };

    const lockBlock = (id: string) => {
        setBlocks(prev =>
            prev.map(block =>
                block.id === id ? { ...block, locked: !block.locked } : block
            )
        );
    };

    const deleteBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    return (
        <PitchContext.Provider
            value={{
                caseInput,
                setCaseInput,
                blocks,
                setBlocks,
                addBlock,
                updateBlock,
                regenerateBlock,
                lockBlock,
                deleteBlock,
                judgeScore,
                setJudgeScore,
                isGenerating,
                setIsGenerating,
            }}
        >
            {children}
        </PitchContext.Provider>
    );
};

export const usePitch = () => {
    const context = useContext(PitchContext);
    if (!context) {
        throw new Error('usePitch must be used within a PitchProvider');
    }
    return context;
};
