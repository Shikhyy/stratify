
import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDeck } from '../../context/DeckContext';
import { STRATIFY_TOOLS } from '../../tambo.config';
import { clsx } from 'clsx';
import { Plus } from 'lucide-react';

interface SlideReelProps {
    currentIndex: number;
    onSelect: (index: number) => void;
}

export const SlideReel: React.FC<SlideReelProps> = ({ currentIndex, onSelect }) => {
    const { slides, addSlide } = useDeck();
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Scroll to active slide
    useEffect(() => {
        if (scrollContainerRef.current) {
            const activeEl = scrollContainerRef.current.children[currentIndex] as HTMLElement;
            if (activeEl) {
                activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }
        }
    }, [currentIndex, slides.length]);

    const handleAddSlide = () => {
        addSlide('MarketSizingSlide', {
            actionTitle: "New Market Analysis",
            kicker: "Initial market assessment shows strong potential.",
            segments: [
                { name: "Segment A", value: 50, growth: "10%" },
            ]
        });
    };

    return (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 max-w-[80vw] bg-slate-900/80 backdrop-blur-md rounded-2xl border border-white/10 p-2 flex items-center gap-2 shadow-2xl">
            <div
                ref={scrollContainerRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth px-2 max-w-[60vw]"
            >
                {slides.map((slide, idx) => {
                    const isActive = idx === currentIndex;
                    const Tool = STRATIFY_TOOLS.find(t => t.name === slide.type);
                    const Component = Tool?.component;

                    return (
                        <div key={slide.id} style={{ perspective: '800px' }}>
                            <motion.button
                                onClick={() => onSelect(idx)}
                                layoutId={`slide-thumb-${slide.id}`}
                                whileHover={{ rotateX: 6, rotateY: -6, scale: 1.06 }}
                                transition={{ duration: 0.2 }}
                                style={{ transformStyle: 'preserve-3d' }}
                                className={clsx(
                                    "relative flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden border-2 transition-all duration-300 group",
                                    isActive ? "border-primary scale-105 shadow-[0_0_20px_rgba(236,72,153,0.4)]" : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                                )}
                            >
                                {/* Tiny Preview */}
                                <div className="absolute inset-0 pointer-events-none origin-top-left transform scale-[0.066] w-[1920px] h-[1080px] bg-slate-900">
                                    {Component && <Component {...slide.props} variant="minimal" />}
                                </div>

                                {/* Overlay Number */}
                                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/60 rounded text-[8px] font-mono text-white/80">
                                    {idx + 1}
                                </div>
                            </motion.button>
                        </div>
                    );
                })}
            </div>

            {/* Add Slide Button */}
            <button
                onClick={handleAddSlide}
                className="flex-shrink-0 w-12 h-16 rounded-lg border border-dashed border-white/20 flex items-center justify-center text-white/30 hover:text-primary hover:border-primary/50 transition-colors"
            >
                <Plus size={20} />
            </button>
        </div>
    );
};
