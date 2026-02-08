
import React, { useRef, useEffect } from 'react';
import { useTamboThread, useTamboThreadInput } from '@tambo-ai/react';
import { motion } from 'framer-motion';
import { Send, Sparkles, PlusCircle } from 'lucide-react';
import { TextStream } from './ui/TextStream';
import { GenerationAnimation } from './ui/GenerationAnimation';
import { STRATIFY_TOOLS } from '../tambo.config';
import type { Slide } from '../context/DeckContext';
import { useDeck } from '../context/DeckContext';
import { ErrorBoundary } from './ui/ErrorBoundary';

interface ChatInterfaceProps {
    currentSlide?: Slide;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ currentSlide }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const { thread } = useTamboThread();
    const { value, setValue, submit, isPending } = useTamboThreadInput();
    const { addSlide, updateSlide, isGenerating, setIsGenerating } = useDeck();

    useEffect(() => {
        if (sectionRef.current) {
            sectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [thread.messages]);

    // Auto-execute tool calls when AI makes them
    useEffect(() => {
        const lastMessage = thread.messages[thread.messages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage?.tool_calls?.length > 0) {
            // Check if there are slide-generating tool calls
            const hasSlideTools = lastMessage.tool_calls.some((toolCall: any) => {
                try {
                    const toolName = toolCall.function.name;
                    const toolConfig = STRATIFY_TOOLS.find(t => t.name === toolName);
                    return toolConfig && toolConfig.component;
                } catch (e) {
                    return false;
                }
            });

            if (hasSlideTools) {
                setIsGenerating(true);
                // Add a small delay for the animation to show
                setTimeout(() => {
                    lastMessage.tool_calls.forEach((toolCall: any) => {
                        handleToolCall(toolCall);
                    });
                    setIsGenerating(false);
                }, 2000);
            } else {
                lastMessage.tool_calls.forEach((toolCall: any) => {
                    handleToolCall(toolCall);
                });
            }
        }
    }, [thread.messages]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submit(value);
        }
    };

    const handleToolCall = (toolCall: any) => {
        try {
            const toolName = toolCall.function.name;
            const args = JSON.parse(toolCall.function.arguments);

            if (toolName === 'UpdateSlide') {
                if (currentSlide) {
                    updateSlide(currentSlide.id, args.updates || args);
                }
                return;
            }

            // SetTheme is deprecated - using fixed pink/magenta theme
            if (toolName === 'SetTheme') {
                return;
            }

            // Only add actual slides to the deck
            const isSlideTool = STRATIFY_TOOLS.some(t => t.name === toolName && !!t.component && t.name !== 'UpdateSlide' && t.name !== 'SetTheme');
            if (isSlideTool) {
                addSlide(toolName, args);
            }
        } catch (e) {
            console.error("Failed to execute tool:", e);
        }
    };

    // Helper to extract text from message content
    const getMessageText = (content: any): string => {
        if (!content) return '';
        if (typeof content === 'string') return content;
        if (Array.isArray(content)) {
            return content.map(c => c.type === 'text' ? c.text : '').join('');
        }
        if (typeof content === 'object') {
            if ('text' in content) return content.text;
        }
        return '';
    };

    return (
        <div className="flex flex-col h-full bg-slate-900/40 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary/10 to-magenta/10 border-b border-primary/20 p-5 flex items-center gap-3 flex-shrink-0">
                <div className="p-2.5 bg-primary/20 rounded-xl">
                    <Sparkles size={20} className="text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-white text-sm">Stratify Copilot</h3>
                    <p className="text-xs text-white/50">Your AI Strategy Assistant</p>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                <ErrorBoundary name="ChatMessages">
                    {thread.messages.map((msg: any, i: number) => {
                        const isUser = msg.role === 'user';
                        const messageText = getMessageText(msg.content);

                        // Skip displaying raw tool results
                        if (msg.role === 'tool') return null;

                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col gap-4"
                            >
                                {/* Text Message */}
                                {messageText && (
                                    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        <div
                                            className={`max-w-[80%] px-4 py-2.5 rounded-xl text-sm leading-relaxed ${
                                                isUser
                                                ? 'bg-gradient-to-r from-primary to-purple text-white rounded-br-none shadow-lg shadow-primary/20 font-medium'
                                                : 'bg-white/10 text-slate-100 rounded-bl-none'
                                                }`}
                                        >
                                            {isUser ? (
                                                messageText
                                            ) : (
                                                <ErrorBoundary name="TextStream">
                                                    <TextStream text={messageText} />
                                                </ErrorBoundary>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Rendered Component from Tambo */}
                                {msg.renderedComponent && (
                                    <ErrorBoundary name="RenderedComponent">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-slate-900 border border-white/10 rounded-xl overflow-hidden"
                                        >
                                            <div className="p-2 bg-white/5 text-xs text-slate-400 border-b border-white/5 flex justify-between items-center">
                                                <span>✨ GENERATED SLIDE</span>
                                                <button
                                                    onClick={() => {
                                                        // Extract component info and add to deck
                                                        if (msg.tool_calls && msg.tool_calls[0]) {
                                                            handleToolCall(msg.tool_calls[0]);
                                                        }
                                                    }}
                                                    className="flex items-center gap-1 text-primary hover:text-white transition-colors"
                                                >
                                                    <PlusCircle size={14} />
                                                    Add to Deck
                                                </button>
                                            </div>
                                            <div className="aspect-video w-full relative">
                                                {/* Tambo's rendered component */}
                                                {msg.renderedComponent}
                                            </div>
                                        </motion.div>
                                    </ErrorBoundary>
                                )}
                            </motion.div>
                        );
                    })}
                </ErrorBoundary>
                {isPending && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start"
                    >
                        <div className="bg-white/10 px-4 py-2.5 rounded-xl text-slate-400 text-xs flex items-center gap-2 border border-white/10">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                            <span className="w-2 h-2 bg-magenta rounded-full animate-bounce delay-75" />
                            <span className="w-2 h-2 bg-purple rounded-full animate-bounce delay-150" />
                        </div>
                    </motion.div>
                )}
                <div ref={sectionRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-gradient-to-t from-slate-900/60 to-slate-900/40 border-t border-white/10 flex-shrink-0">
                <div className="relative">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Stratify to generate slides..."
                        className="w-full bg-slate-800/50 border border-white/15 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors placeholder:text-white/30"
                    />
                    <button
                        onClick={() => submit(value)}
                        disabled={!value.trim() || isPending}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-primary to-magenta text-white rounded-lg hover:shadow-lg hover:shadow-primary/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>

            {/* Full-screen Generation Animation */}
            <GenerationAnimation isVisible={isGenerating} />
        </div>
    );
};
