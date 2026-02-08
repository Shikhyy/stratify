import React, { createContext, useContext, useState, type ReactNode } from 'react';

// Define Slide interface
export interface Slide {
    id: string;
    type: 'TitleSlide' | 'MarketSizingSlide' | 'CompetitorBenchmarking' | 'StrategicRoadmap' | 'FinancialImpactSlide' | 'WaterfallBridge' | 'HarveyBallMatrix' | 'ChevronProcess';
    props: any;
}

// CBS-style neutral palette with a single accent
export const THEME = {
    primary: '#2563EB',
    secondary: '#0EA5A4',
    magenta: '#2563EB',
    purple: '#0EA5A4',
};

interface DeckContextType {
    slides: Slide[];
    isGenerating: boolean;
    addSlide: (type: Slide['type'], props: any) => void;
    updateSlide: (id: string, props: any) => void;
    setIsGenerating: (value: boolean) => void;
    duplicateSlide: (id: string) => void;
    deleteSlide: (id: string) => void;
    setSlides: (slides: Slide[]) => void;
}

const DeckContext = createContext<DeckContextType | undefined>(undefined);

export const DeckProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [slides, setSlides] = useState<Slide[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const addSlide = (type: Slide['type'], props: any) => {
        const newSlide: Slide = {
            id: crypto.randomUUID(),
            type,
            props,
        };
        setSlides(prev => [...prev, newSlide]);
    };

    const updateSlide = (id: string, props: any) => {
        setSlides(prev => prev.map(s => s.id === id ? { ...s, props: { ...s.props, ...props } } : s));
    };

    const duplicateSlide = (id: string) => {
        const slideToClone = slides.find(s => s.id === id);
        if (slideToClone) {
            const newSlide: Slide = {
                id: crypto.randomUUID(),
                type: slideToClone.type,
                props: { ...slideToClone.props },
            };
            setSlides(prev => {
                const index = prev.findIndex(s => s.id === id);
                return [...prev.slice(0, index + 1), newSlide, ...prev.slice(index + 1)];
            });
        }
    };

    const deleteSlide = (id: string) => {
        setSlides(prev => prev.filter(s => s.id !== id));
    };

    const setSlidesState = (nextSlides: Slide[]) => {
        setSlides(nextSlides);
    };

    return (
        <DeckContext.Provider value={{ slides, isGenerating, addSlide, updateSlide, setIsGenerating, duplicateSlide, deleteSlide, setSlides: setSlidesState }}>
            {children}
        </DeckContext.Provider>
    );
};

export const useDeck = () => {
    const context = useContext(DeckContext);
    if (!context) {
        throw new Error('useDeck must be used within a DeckProvider');
    }
    return context;
};
