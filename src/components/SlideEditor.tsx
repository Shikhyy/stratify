import React from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Trash2 } from 'lucide-react';
import type { Slide } from '../context/DeckContext';
import { useDeck } from '../context/DeckContext';
import { useExportDeck } from '../hooks/useExportDeck';

interface SlideEditorProps {
    currentSlide: Slide | undefined;
    slideIndex: number;
    totalSlides: number;
}

export const SlideEditor: React.FC<SlideEditorProps> = ({
    currentSlide,
    slideIndex,
    totalSlides,
}) => {
    const { exportToPPT } = useExportDeck();
    const { duplicateSlide, deleteSlide } = useDeck();

    if (!currentSlide) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <p className="text-slate-400 text-sm">Select a slide to edit</p>
            </div>
        );
    }

    const handleDuplicate = () => {
        duplicateSlide(currentSlide.id);
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this slide?')) {
            deleteSlide(currentSlide.id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="h-full flex flex-col"
        >
            {/* Header */}
            <div className="border-b border-white/10 p-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-white text-sm">Slide {slideIndex + 1} of {totalSlides}</h3>
                    <div className="text-xs text-slate-400 px-2 py-1 bg-white/10 rounded">
                        {currentSlide.type}
                    </div>
                </div>
                <p className="text-xs text-slate-400">
                    {currentSlide.props?.actionTitle || currentSlide.props?.title || 'Slide'}
                </p>
            </div>

            {/* Properties Section */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                        Slide Type
                    </label>
                    <div className="text-sm text-slate-200 bg-white/5 rounded-lg p-3">
                        {currentSlide.type}
                    </div>
                </div>

                {currentSlide.props?.actionTitle && (
                    <div>
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                            Title
                        </label>
                        <div className="text-sm text-slate-200 bg-white/5 rounded-lg p-3">
                            {currentSlide.props.actionTitle}
                        </div>
                    </div>
                )}

                {currentSlide.props?.kicker && (
                    <div>
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                            Kicker / Takeaway
                        </label>
                        <div className="text-sm text-slate-200 bg-white/5 rounded-lg p-3">
                            {currentSlide.props.kicker}
                        </div>
                    </div>
                )}

                {currentSlide.props?.steps && (
                    <div>
                        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                            Steps / Segments
                        </label>
                        <div className="text-xs text-slate-300 space-y-2">
                            {currentSlide.props.steps.length} item(s)
                        </div>
                    </div>
                )}

                <div>
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wide block mb-2">
                        Info
                    </label>
                    <div className="text-xs text-slate-400 space-y-1">
                        <p>Slide ID: {currentSlide.id.slice(0, 8)}...</p>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="border-t border-white/10 p-4 flex-shrink-0 space-y-2">
                <button
                    onClick={exportToPPT}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary to-magenta text-white font-medium rounded-lg hover:shadow-lg hover:shadow-primary/30 transition-all text-sm"
                >
                    <Download size={16} />
                    Download Deck
                </button>

                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={handleDuplicate}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
                    >
                        <Copy size={14} />
                        Duplicate
                    </button>
                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors text-sm"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
