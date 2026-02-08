import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDeck } from '../context/DeckContext';
import { STRATIFY_TOOLS } from '../tambo.config';

interface DeckPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialIndex?: number;
}

export const DeckPreviewModal: React.FC<DeckPreviewModalProps> = ({
    isOpen,
    onClose,
    initialIndex = 0,
}) => {
    const { slides } = useDeck();
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            const safeIndex = Math.max(0, Math.min(initialIndex, slides.length - 1));
            setCurrentIndex(Number.isFinite(safeIndex) ? safeIndex : 0);
        }
    }, [initialIndex, isOpen, slides.length]);

    const handlePrev = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentIndex(prev => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const handleNext = useCallback(() => {
        if (slides.length === 0) return;
        setCurrentIndex(prev => (prev + 1) % slides.length);
    }, [slides.length]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
            if (event.key === 'ArrowLeft') handlePrev();
            if (event.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, handlePrev, handleNext]);

    const currentSlide = slides[currentIndex];
    const SlideComponent = useMemo(() => {
        const tool = STRATIFY_TOOLS.find(t => t.name === currentSlide?.type);
        return tool?.component || null;
    }, [currentSlide]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-6"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98, y: 10 }}
                        className="relative w-full max-w-6xl bg-slate-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                            <div className="text-sm text-white/80">
                                Deck Preview {slides.length > 0 ? `(${currentIndex + 1} / ${slides.length})` : ''}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                                aria-label="Close preview"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <div className="relative bg-slate-900/50 p-6">
                            {slides.length === 0 ? (
                                <div className="flex items-center justify-center h-[420px] text-slate-400 text-sm">
                                    No slides to preview yet.
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-900">
                                        {SlideComponent ? (
                                            <SlideComponent {...currentSlide.props} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-400 text-sm">
                                                Unsupported slide type for preview.
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 p-3 bg-slate-900/90 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-slate-800 transition-colors"
                                        aria-label="Previous slide"
                                        disabled={slides.length === 0}
                                    >
                                        <ChevronLeft size={18} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 p-3 bg-slate-900/90 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-slate-800 transition-colors"
                                        aria-label="Next slide"
                                        disabled={slides.length === 0}
                                    >
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
