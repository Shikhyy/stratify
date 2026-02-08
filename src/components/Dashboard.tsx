import React, { useState } from 'react';
import { useDeck } from '../context/DeckContext';
import { STRATIFY_TOOLS } from '../tambo.config';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MessageSquare } from 'lucide-react';
import { ChatInterface } from './ChatInterface';
import { SlideEditor } from './SlideEditor';
import { SlideReel } from './ui/SlideReel';
import { useExportDeck } from '../hooks/useExportDeck';
import { DeckPreviewModal } from './DeckPreviewModal';
import { GlowingEffect } from './ui/glowing-effect';
import { StratifyLogo } from './ui/StratifyLogo';

export const Dashboard: React.FC = () => {
    const { slides } = useDeck();
    const { exportToPPT } = useExportDeck();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isChatOpen, setIsChatOpen] = useState(true); // Default open for "Proper AI Agent" feel
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    const currentSlide = slides[currentSlideIndex];

    // Helper to get the component for the current slide type
    const renderSlide = () => {
        if (!currentSlide) return null;

        const toolConfig = STRATIFY_TOOLS.find(t => t.name === currentSlide.type);
        if (!toolConfig) return <div className="text-white">Unknown Slide Type: {currentSlide.type}</div>;

        const Component = toolConfig.component;
        return <Component {...currentSlide.props} />;
    };

    return (
        <div className="h-screen w-full bg-slate-950 flex overflow-hidden">
            {/* Left Panel: Main Content (Slide Canvas) */}
            <div className={`transition-all duration-300 relative flex flex-col ${isChatOpen ? 'w-[65%]' : 'w-full'} bg-slate-950 border-r border-white/10`}>

                {/* Header / Toolbar */}
                <div className="h-16 bg-slate-900/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between z-40">
                    {/* Logo on Left */}
                    <div className="flex-shrink-0">
                        <StratifyLogo size="sm" showText={false} />
                    </div>

                    {/* Export Deck Button */}
                    <div className="flex items-center gap-3 flex-1 px-4">
                        <div className="relative group">
                            <button
                                onClick={() => setIsPreviewOpen(true)}
                                disabled={slides.length === 0}
                                className="relative px-4 py-2 border border-white/15 text-white/80 rounded-xl text-sm hover:bg-white/5 transition-colors disabled:opacity-50 overflow-hidden"
                            >
                                <GlowingEffect
                                    spread={35}
                                    glow={true}
                                    disabled={slides.length === 0}
                                    proximity={50}
                                    inactiveZone={0.2}
                                    borderWidth={1.5}
                                />
                                <span className="relative z-10">Preview Deck</span>
                            </button>
                        </div>
                        <div className="relative group">
                            <button
                                onClick={exportToPPT}
                                className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-magenta/20 hover:from-primary/30 hover:to-magenta/30 border border-primary/30 rounded-xl text-primary font-medium transition-all hover:shadow-lg hover:shadow-primary/20 overflow-hidden"
                            >
                                <GlowingEffect
                                    spread={40}
                                    glow={true}
                                    disabled={false}
                                    proximity={60}
                                    inactiveZone={0.15}
                                    borderWidth={2}
                                />
                                <div className="relative z-10 flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse group-hover:scale-125 transition-transform" />
                                    <span className="text-sm">Crystalize Deck</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isChatOpen && (
                            <button
                                onClick={() => setIsChatOpen(true)}
                                className="relative p-2 hover:bg-white/10 rounded-lg text-white/70 hover:text-white transition-colors overflow-hidden"
                                title="Open AI Copilot"
                            >
                                <GlowingEffect
                                    spread={28}
                                    glow={true}
                                    disabled={false}
                                    proximity={45}
                                    inactiveZone={0.25}
                                    borderWidth={1.5}
                                />
                                <MessageSquare size={20} className="relative z-10" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 flex items-center justify-center p-12 relative">
                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}
                    />

                    {slides.length === 0 ? (
                        // Empty State
                        <div className="text-center max-w-lg z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 flex justify-center"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <StratifyLogo size="lg" showText={false} />
                                </motion.div>
                            </motion.div>

                            <motion.h2
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="font-logo text-6xl font-bold mb-2 tracking-tight bg-gradient-to-r from-amber-400 via-blue-400 to-blue-500 bg-clip-text text-transparent"
                            >
                                STRATIFY
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 }}
                                className="text-sm text-slate-400 font-semibold tracking-widest mb-4"
                            >
                                AI CONSULTANT
                            </motion.p>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="text-slate-300 text-lg mb-10 leading-relaxed"
                            >
                                Your autonomous strategy copilot is ready.<br />
                                <span className="text-slate-400">Describe your pitch to get started.</span>
                            </motion.p>

                            {!isChatOpen && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.4 }}
                                    className="relative inline-block"
                                >
                                    <button
                                        onClick={() => setIsChatOpen(true)}
                                        className="relative px-8 py-3 bg-gradient-to-r from-primary to-magenta text-white font-bold rounded-full hover:shadow-lg hover:shadow-primary/40 transition-all inline-flex items-center gap-2 overflow-hidden group"
                                    >
                                        <GlowingEffect
                                            spread={45}
                                            glow={true}
                                            disabled={false}
                                            proximity={70}
                                            inactiveZone={0.1}
                                            borderWidth={2.5}
                                        />
                                        <div className="relative z-10 flex items-center gap-2">
                                            <MessageSquare size={18} />
                                            <span>Open Copilot</span>
                                        </div>
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        // Slide View
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentSlide.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                className="w-full max-w-[95%] aspect-video shadow-2xl shadow-primary/10 rounded-2xl overflow-hidden ring-1 ring-white/10 z-10 relative group"
                            >
                                <GlowingEffect
                                    spread={60}
                                    glow={true}
                                    disabled={false}
                                    proximity={100}
                                    inactiveZone={0.1}
                                    borderWidth={3}
                                />
                                <div className="relative w-full h-full">
                                    {renderSlide()}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Footer: Slide Reel */}
                {slides.length > 0 && (
                    <div className="h-40 bg-slate-900/50 border-t border-white/10 relative z-20 shrink-0 flex items-center justify-center">
                        <div className="absolute inset-x-0 -top-12 h-12 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none" />
                        <SlideReel currentIndex={currentSlideIndex} onSelect={setCurrentSlideIndex} />
                    </div>
                )}
            </div>

            {/* Right Panel: Chat Interface & Slide Editor */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ x: "100%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "100%", opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="w-[35%] min-w-[420px] border-l border-white/10 bg-slate-900/60 backdrop-blur-xl shadow-2xl relative z-50 flex flex-col h-full overflow-hidden group"
                    >
                        <GlowingEffect
                            spread={80}
                            glow={true}
                            disabled={false}
                            proximity={120}
                            inactiveZone={0.15}
                            borderWidth={4}
                        />
                        {/* Close Button */}
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-50 rounded-lg"
                            title="Collapse Panel"
                        >
                            <Plus size={20} className="rotate-45" />
                        </button>

                        {/* Chat Section */}
                        <div className={`${slides.length > 0 ? 'h-1/2' : 'h-full'} flex flex-col overflow-hidden ${slides.length > 0 ? 'border-b border-white/10' : ''}`}>
                            <ChatInterface currentSlide={currentSlide} />
                        </div>

                        {/* Editor Section */}
                        {slides.length > 0 && currentSlide && (
                            <div className="h-1/2 overflow-hidden bg-slate-900/40">
                                <SlideEditor
                                    currentSlide={currentSlide}
                                    slideIndex={currentSlideIndex}
                                    totalSlides={slides.length}
                                />
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <DeckPreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                initialIndex={currentSlideIndex}
            />
        </div>
    );
};
