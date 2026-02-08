import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useDeck } from '../context/DeckContext';
import { useTheme } from '../context/ThemeContext';
import { STRATIFY_TOOLS } from '../tambo.config';
import { GlowingEffect } from './ui/glowing-effect';

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
    const { isDark } = useTheme();
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
        <div>
            {isOpen && (
                <div
                    className={`fixed inset-0 z-[100] flex items-center justify-center p-6 ${isDark ? 'bg-black/70 backdrop-blur-sm' : 'bg-black/30'}`}
                >
                    <div
                        className={`relative w-full max-w-6xl rounded-2xl shadow-2xl overflow-hidden ${isDark ? 'bg-slate-950 border border-white/10' : 'bg-white border border-slate-300'}`}
                    >
                        <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
                            <div className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                                Deck Preview {slides.length > 0 ? `(${currentIndex + 1} / ${slides.length})` : ''}
                            </div>
                            <button
                                onClick={onClose}
                                className={`relative p-2 rounded-lg transition-colors overflow-hidden ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'}`}
                                aria-label="Close preview"
                            >
                                <GlowingEffect
                                    spread={22}
                                    glow={true}
                                    disabled={false}
                                    proximity={36}
                                    inactiveZone={0.3}
                                    borderWidth={1}
                                />
                                <X size={18} className="relative z-10" />
                            </button>
                        </div>

                        <div className={`relative p-6 ${isDark ? 'bg-slate-900/50' : 'bg-slate-50'}`}>
                            {slides.length === 0 ? (
                                <div className={`flex items-center justify-center h-[420px] text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                                    No slides to preview yet.
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className={`relative w-full aspect-video rounded-xl overflow-hidden border ${isDark ? 'border-white/10 bg-slate-900' : 'border-slate-300 bg-white'} group`}>
                                        <GlowingEffect
                                            spread={60}
                                            glow={true}
                                            disabled={false}
                                            proximity={100}
                                            inactiveZone={0.15}
                                            borderWidth={3}
                                        />
                                        {SlideComponent ? (
                                            <SlideComponent {...currentSlide.props} />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-600 text-sm">
                                                Unsupported slide type for preview.
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        onClick={handlePrev}
                                        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border transition-all duration-200 ${isDark ? 'bg-slate-900/80 border-white/20 text-white/60 hover:text-white hover:bg-slate-800/90' : 'bg-white/90 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-label="Previous slide"
                                        disabled={slides.length === 0}
                                    >
                                        <GlowingEffect
                                            spread={30}
                                            glow={true}
                                            disabled={slides.length === 0}
                                            proximity={40}
                                            inactiveZone={0.2}
                                            borderWidth={1.5}
                                        />
                                        <ChevronLeft size={20} className="relative z-10" />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full border transition-all duration-200 ${isDark ? 'bg-slate-900/80 border-white/20 text-white/60 hover:text-white hover:bg-slate-800/90' : 'bg-white/90 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-white'} disabled:opacity-50 disabled:cursor-not-allowed`}
                                        aria-label="Next slide"
                                        disabled={slides.length === 0}
                                    >
                                        <GlowingEffect
                                            spread={30}
                                            glow={true}
                                            disabled={slides.length === 0}
                                            proximity={40}
                                            inactiveZone={0.2}
                                            borderWidth={1.5}
                                        />
                                        <ChevronRight size={20} className="relative z-10" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
