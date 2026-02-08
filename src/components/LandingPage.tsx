import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { GlowingEffect } from './ui/glowing-effect';
import { StratifyLogo } from './ui/StratifyLogo';

interface LandingPageProps {
    onStart: () => void;
}

const Pyramid: React.FC = () => {
    const meshRef = useRef<any>(null);
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += 0.003;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;

        // Animate color between gold and pink
        if (materialRef.current) {
            const t = (Math.sin(state.clock.elapsedTime * 0.5) + 1) / 2; // 0 to 1
            const goldColor = { r: 1, g: 0.8, b: 0.1 };   // brighter gold
            const pinkColor = { r: 1, g: 0.35, b: 0.65 }; // vivid pink

            materialRef.current.color.r = goldColor.r + (pinkColor.r - goldColor.r) * t;
            materialRef.current.color.g = goldColor.g + (pinkColor.g - goldColor.g) * t;
            materialRef.current.color.b = goldColor.b + (pinkColor.b - goldColor.b) * t;
        }
    });

    return (
        <mesh ref={meshRef}>
            <tetrahedronGeometry args={[1.6, 0]} />
            <meshStandardMaterial ref={materialRef} color="#d79f1e" metalness={0.6} roughness={0.25} />
        </mesh>
    );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen w-full bg-[#070B12] text-white overflow-hidden">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(53,212,255,0.15),_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_rgba(46,94,255,0.18),_transparent_45%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(7,11,18,0.2)_0%,_rgba(7,11,18,1)_65%)]" />
            </div>

            {/* Navigation Header */}
            <header className="relative z-40 h-20 px-6 flex items-center justify-between border-b border-white/5 backdrop-blur-sm bg-slate-950/50">
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <StratifyLogo size="md" showText={true} />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="flex items-center gap-6"
                >
                    <a href="#features" className="text-sm text-slate-400 hover:text-white transition-colors">
                        Features
                    </a>
                    <a href="#preview" className="text-sm text-slate-400 hover:text-white transition-colors">
                        How It Works
                    </a>
                    <button
                        onClick={onStart}
                        className="relative px-6 py-2.5 bg-gradient-to-r from-[#d79f1e] to-[#dd7bbb] text-slate-950 font-semibold rounded-full text-sm hover:shadow-lg hover:shadow-[#d79f1e]/40 transition-all duration-300 overflow-hidden"
                    >
                        <GlowingEffect
                            spread={28}
                            glow={true}
                            disabled={false}
                            proximity={50}
                            inactiveZone={0.2}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10">Start Now</span>
                    </button>
                </motion.div>
            </header>

            {/* Hero */}
            <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 max-w-6xl w-full items-center">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#d79f1e]/20 to-[#dd7bbb]/20 border border-[#dd7bbb]/50 mb-4 hover:shadow-lg hover:shadow-[#dd7bbb]/30 transition-all duration-300"
                        >
                            <div className="w-2 h-2 rounded-full bg-[#dd7bbb] animate-pulse" />
                            <span className="text-sm text-[#ffd699] uppercase tracking-wider font-semibold">
                                AI Consultant Engine
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                            className="font-logo text-5xl sm:text-6xl lg:text-7xl font-bold mt-4 leading-tight bg-gradient-to-r from-[#d79f1e] via-[#dd7bbb] to-[#dd7bbb] bg-clip-text text-transparent"
                        >
                            Strategy in Seconds
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            className="text-slate-300 mt-6 text-lg max-w-xl leading-relaxed"
                        >
                            Transform any case prompt into a judge-winning consulting deck with Stratify's AI Consultant Engine. Our advanced AI thinks like a McKinsey partner, provides deep strategic insights, structures your answer with precision, and generates a complete, presentation-ready PowerPoint—all in seconds.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                            className="mt-8 flex flex-wrap items-center gap-4"
                        >
                            <button
                                onClick={onStart}
                                className="relative px-8 py-4 bg-gradient-to-r from-[#d79f1e] to-[#dd7bbb] text-slate-950 font-bold rounded-full shadow-[0_20px_60px_rgba(215,159,30,0.35)] hover:shadow-[0_25px_80px_rgba(221,123,187,0.55)] hover:scale-105 transition-all duration-300 overflow-hidden"
                            >
                                <GlowingEffect
                                    spread={36}
                                    glow={true}
                                    disabled={false}
                                    proximity={60}
                                    inactiveZone={0.2}
                                    borderWidth={1.5}
                                />
                                <span className="relative z-10">Start Your Deck</span>
                            </button>
                            <a
                                href="#preview"
                                className="relative px-8 py-4 border border-[#dd7bbb]/50 text-white rounded-full hover:bg-[#dd7bbb]/10 hover:shadow-lg hover:shadow-[#dd7bbb]/20 transition-all duration-300 overflow-hidden font-semibold"
                            >
                                <GlowingEffect
                                    spread={28}
                                    glow={true}
                                    disabled={false}
                                    proximity={50}
                                    inactiveZone={0.25}
                                    borderWidth={1.5}
                                />
                                <span className="relative z-10">Watch Demo</span>
                            </a>
                        </motion.div>
                    </div>

                    <div className="relative h-[420px] sm:h-[480px]">
                        <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl overflow-hidden">
                            <GlowingEffect
                                spread={60}
                                glow={true}
                                disabled={false}
                                proximity={100}
                                inactiveZone={0.15}
                                borderWidth={2}
                            />
                        </div>
                        <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-[#d79f1e]/10 via-transparent to-[#dd7bbb]/20 blur-2xl" />
                        <div className="relative h-full w-full z-10">
                            <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                                <ambientLight intensity={0.6} />
                                <directionalLight position={[4, 4, 2]} intensity={1.4} />
                                <Pyramid />
                            </Canvas>
                            <div className="absolute bottom-6 left-6 right-6 flex justify-between text-xs uppercase tracking-[0.3em] text-slate-400">
                                <span>Problem</span>
                                <span>Insight</span>
                                <span>Strategy</span>
                                <span>Impact</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Problem Section */}
            <section className="relative py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="grid md:grid-cols-[1fr_1.2fr] gap-10 items-center">
                        <div>
                            <motion.h2
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 12 }}
                                transition={{ duration: 0.6 }}
                                className="font-display text-3xl md:text-4xl"
                            >
                                Why case competitions are so hard
                            </motion.h2>
                            <p className="text-slate-400 mt-4">
                                The problem is not effort. It is structure.
                            </p>
                        </div>
                        <div className="grid gap-4">
                            {[
                                'Generic AI answers that miss the case objective',
                                'Poor structure that confuses judges',
                                'Weak insights that sound obvious',
                                'Messy slides that do not tell a story',
                            ].map((item, idx) => (
                                <motion.div
                                    key={item}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    initial={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                                    whileHover={{ x: 8, scale: 1.02 }}
                                    className="relative group"
                                >
                                    <div className="relative bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-slate-200 group-hover:bg-white/15 group-hover:border-white/20 transition-all overflow-hidden">
                                        <GlowingEffect
                                            spread={25}
                                            glow={true}
                                            disabled={false}
                                            proximity={50}
                                            inactiveZone={0.2}
                                            borderWidth={1.5}
                                        />
                                        <div className="relative z-10 text-slate-200 group-hover:text-white transition-colors">{item}</div>
                                    </div>
                                </motion.div>
                            ))}
                            <motion.div
                                whileInView={{ opacity: 1 }}
                                initial={{ opacity: 0 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="mt-4 text-xs uppercase tracking-[0.3em] text-[#d79f1e]"
                            >
                                The problem isn't effort. It's structure.
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-3xl md:text-4xl text-center"
                    >
                        How Stratify thinks
                    </motion.h2>
                    <p className="text-slate-400 text-center mt-4">
                        This is how real consultants work.
                    </p>

                    <div className="relative mt-12 grid md:grid-cols-4 gap-6">
                        {/* Animated Gradient Connectors */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
                            <defs>
                                <linearGradient id="step-connector-1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#d79f1e">
                                        <animate attributeName="stop-color" values="#d79f1e; #35D4FF; #dd7bbb; #d79f1e" dur="6s" repeatCount="indefinite" />
                                    </stop>
                                    <stop offset="50%" stopColor="#35D4FF">
                                        <animate attributeName="stop-color" values="#35D4FF; #dd7bbb; #d79f1e; #35D4FF" dur="6s" repeatCount="indefinite" />
                                    </stop>
                                    <stop offset="100%" stopColor="#dd7bbb">
                                        <animate attributeName="stop-color" values="#dd7bbb; #d79f1e; #35D4FF; #dd7bbb" dur="6s" repeatCount="indefinite" />
                                    </stop>
                                </linearGradient>
                            </defs>
                            {/* Horizontal connectors between steps */}
                            <motion.path
                                d="M 12% 50%, L 88% 50%"
                                stroke="url(#step-connector-1)"
                                strokeWidth="2"
                                fill="none"
                                strokeDasharray="4 4"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.5 }}
                                transition={{ duration: 2.5, ease: "easeInOut" }}
                            >
                                <animate attributeName="stroke-dashoffset" from="0" to="8" dur="1s" repeatCount="indefinite" />
                            </motion.path>
                        </svg>
                        
                        {[
                            { title: 'Understand the problem', detail: 'Reframe objectives, constraints, success metrics.' },
                            { title: 'Extract non-obvious insights', detail: 'Find the leverage point others miss.' },
                            { title: 'Build a MECE strategy', detail: 'Three pillars that cover the entire solution.' },
                            { title: 'Generate a judge-ready deck', detail: 'Slides, visuals, and takeaways pre-built.' },
                        ].map((step, idx) => (
                            <motion.div
                                key={step.title}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.6, delay: idx * 0.1 }}
                                whileHover={{ y: -6, scale: 1.03 }}
                                className="relative group"
                                style={{ zIndex: 10 }}
                            >
                                <div className="relative h-full bg-gradient-to-b from-white/8 to-white/3 border border-white/10 rounded-2xl p-5 overflow-hidden group-hover:from-white/12 group-hover:to-white/5 transition-all">
                                    <GlowingEffect
                                        spread={30}
                                        glow={true}
                                        disabled={false}
                                        proximity={60}
                                        inactiveZone={0.1}
                                        borderWidth={2}
                                    />
                                    <div className="relative z-10">
                                        <div className="text-xs uppercase tracking-[0.4em] text-[#d79f1e] group-hover:text-white transition-colors">0{idx + 1}</div>
                                        <h3 className="font-display text-lg mt-3 group-hover:text-white transition-colors">{step.title}</h3>
                                        <p className="text-sm text-slate-400 mt-3 group-hover:text-slate-300 transition-colors">{step.detail}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Live Preview */}
            <section id="preview" className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
                    <div>
                        <motion.h2
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.6 }}
                            className="font-display text-3xl md:text-4xl"
                        >
                            Live product preview
                        </motion.h2>
                        <p className="text-slate-400 mt-4">
                            Watch a case input turn into structured blocks and a slide deck in seconds.
                        </p>
                        <button
                            onClick={onStart}
                            className="relative mt-6 px-5 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors overflow-hidden"
                        >
                            <GlowingEffect
                                spread={24}
                                glow={true}
                                disabled={false}
                                proximity={45}
                                inactiveZone={0.3}
                                borderWidth={1}
                            />
                            <span className="relative z-10">Build Your First Case</span>
                        </button>
                    </div>
                    <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6 overflow-hidden">
                        <GlowingEffect
                            spread={50}
                            glow={true}
                            disabled={false}
                            proximity={80}
                            inactiveZone={0.1}
                            borderWidth={2}
                        />
                        <div className="relative z-10">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="relative bg-black/40 border border-white/10 rounded-2xl p-4 overflow-hidden">
                                    <GlowingEffect
                                        spread={25}
                                        glow={true}
                                        disabled={false}
                                        proximity={40}
                                        inactiveZone={0.2}
                                        borderWidth={1}
                                    />
                                    <div className="relative z-10">
                                        <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Case Input</p>
                                        <div className="mt-3 space-y-2 text-sm text-slate-200">
                                            <p>Case: Retail profit decline</p>
                                            <p>Metric: +15% margin in 12 months</p>
                                            <p>Constraint: Capex under $5M</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="relative bg-black/40 border border-white/10 rounded-2xl p-4 overflow-hidden">
                                    <GlowingEffect
                                        spread={25}
                                        glow={true}
                                        disabled={false}
                                        proximity={40}
                                        inactiveZone={0.2}
                                        borderWidth={1}
                                    />
                                    <div className="relative z-10">
                                        <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Blocks Generated</p>
                                        <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                            <li>Problem Definition</li>
                                            <li>Core Insight</li>
                                            <li>3 Strategy Pillars</li>
                                            <li>Financial Impact</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 relative bg-gradient-to-r from-[#d79f1e]/20 to-[#dd7bbb]/20 rounded-2xl p-4 text-sm text-slate-200 overflow-hidden">
                                <GlowingEffect
                                    spread={30}
                                    glow={true}
                                    disabled={false}
                                    proximity={50}
                                    inactiveZone={0.15}
                                    borderWidth={1}
                                />
                                <div className="relative z-10">Slides assembling into a judge-ready deck...</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Breakdown */}
            <section className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-3xl md:text-4xl text-center"
                    >
                        Consulting-grade features
                    </motion.h2>
                    <div className="relative mt-12 grid md:grid-cols-3 gap-6">
                        {/* Animated Gradient Connectors */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
                            <defs>
                                <linearGradient id="connector-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#d79f1e">
                                        <animate attributeName="stop-color" values="#d79f1e; #dd7bbb; #35D4FF; #d79f1e" dur="4s" repeatCount="indefinite" />
                                    </stop>
                                    <stop offset="50%" stopColor="#dd7bbb">
                                        <animate attributeName="stop-color" values="#dd7bbb; #35D4FF; #d79f1e; #dd7bbb" dur="4s" repeatCount="indefinite" />
                                    </stop>
                                    <stop offset="100%" stopColor="#35D4FF">
                                        <animate attributeName="stop-color" values="#35D4FF; #d79f1e; #dd7bbb; #35D4FF" dur="4s" repeatCount="indefinite" />
                                    </stop>
                                </linearGradient>
                                <linearGradient id="connector-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#35D4FF">
                                        <animate attributeName="stop-color" values="#35D4FF; #dd7bbb; #d79f1e; #35D4FF" dur="5s" repeatCount="indefinite" />
                                    </stop>
                                    <stop offset="100%" stopColor="#d79f1e">
                                        <animate attributeName="stop-color" values="#d79f1e; #35D4FF; #dd7bbb; #d79f1e" dur="5s" repeatCount="indefinite" />
                                    </stop>
                                </linearGradient>
                            </defs>
                            {/* Connector between cards */}
                            <motion.path
                                d="M 33% 30%, Q 50% 15%, 66% 30%"
                                stroke="url(#connector-gradient-1)"
                                strokeWidth="2"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.6 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                            />
                            <motion.path
                                d="M 33% 70%, Q 50% 85%, 66% 70%"
                                stroke="url(#connector-gradient-2)"
                                strokeWidth="2"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.6 }}
                                transition={{ duration: 2, delay: 0.3, ease: "easeInOut" }}
                            />
                        </svg>
                        
                        {[
                            'Structured pitch generation',
                            'Block-level editing',
                            'Judge-mode evaluator',
                            'Auto PPT generation',
                            'Consulting infographics',
                            'Insight-first reasoning',
                        ].map((feature, idx) => (
                            <motion.div
                                key={feature}
                                whileHover={{ y: -6 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="relative group"
                                style={{ zIndex: 10 }}
                            >
                                <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-5 overflow-hidden">
                                    <GlowingEffect
                                        spread={40}
                                        glow={true}
                                        disabled={false}
                                        proximity={64}
                                        inactiveZone={0.01}
                                        borderWidth={2}
                                    />
                                    <div className="relative z-10">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#d79f1e]/30 to-[#dd7bbb]/20 mb-4 group-hover:from-[#d79f1e]/50 group-hover:to-[#dd7bbb]/40 transition-all" />
                                        <p className="text-slate-200 group-hover:text-white transition-colors">{feature}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison */}
            <section className="relative py-20 px-6">
                <div className="max-w-5xl mx-auto">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-3xl md:text-4xl text-center"
                    >
                        What makes Stratify different
                    </motion.h2>
                    <div className="relative mt-10 border border-white/10 rounded-2xl overflow-hidden">
                        <GlowingEffect
                            spread={45}
                            glow={true}
                            disabled={false}
                            proximity={70}
                            inactiveZone={0.1}
                            borderWidth={2}
                        />
                        <div className="relative z-10">
                            <div className="grid grid-cols-2 bg-white/5 text-sm uppercase tracking-[0.3em] text-slate-400">
                                <div className="p-4">Generic AI</div>
                                <div className="p-4">Stratify</div>
                            </div>
                            {[
                                ['Long text dumps', 'Structured thinking blocks'],
                                ['No slides', 'Full consulting deck'],
                                ['No judging', 'Judge-mode scoring'],
                                ['Generic visuals', 'Consulting infographics'],
                            ].map((row, idx) => (
                                <motion.div
                                    key={row[0]}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    initial={{ opacity: 0, x: -12 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className="grid grid-cols-2 border-t border-white/10 text-slate-200"
                                >
                                    <div className="p-4 bg-black/30">{row[0]}</div>
                                    <div className="p-4 bg-black/10 text-[#d79f1e]">{row[1]}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Personas */}
            <section className="relative py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-3xl md:text-4xl text-center"
                    >
                        Built for teams that compete
                    </motion.h2>
                    <div className="relative mt-12 grid md:grid-cols-3 gap-6">
                        {/* Animated Gradient Connectors */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none hidden md:block" style={{ zIndex: 0 }}>
                            <defs>
                                <linearGradient id="persona-connector-1" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#dd7bbb">
                                        <animate attributeName="stop-color" values="#dd7bbb; #35D4FF; #5a922c; #dd7bbb" dur="5s" repeatCount="indefinite" />
                                    </stop>
                                    <stop offset="50%" stopColor="#35D4FF">
                                        <animate attributeName="stop-color" values="#35D4FF; #5a922c; #dd7bbb; #35D4FF" dur="5s" repeatCount="indefinite" />
                                    </stop>
                                    <stop offset="100%" stopColor="#5a922c">
                                        <animate attributeName="stop-color" values="#5a922c; #dd7bbb; #35D4FF; #5a922c" dur="5s" repeatCount="indefinite" />
                                    </stop>
                                </linearGradient>
                            </defs>
                            {/* Curved connector through all three */}
                            <motion.path
                                d="M 16% 50%, Q 50% 30%, 84% 50%"
                                stroke="url(#persona-connector-1)"
                                strokeWidth="2"
                                fill="none"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 0.5 }}
                                transition={{ duration: 2.5, delay: 0.2, ease: "easeInOut" }}
                            />
                        </svg>
                        
                        {[
                            { title: 'Case competition teams', detail: 'Win with structured thinking and cleaner slides.' },
                            { title: 'Consulting clubs', detail: 'Train members with consultant-grade outputs.' },
                            { title: 'Hackathon builders', detail: 'Ship a winning story in hours, not weeks.' },
                        ].map((card, idx) => (
                            <motion.div
                                key={card.title}
                                whileHover={{ y: -8, scale: 1.02 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 15 }}
                                transition={{ duration: 0.5, delay: idx * 0.15 }}
                                className="relative group"
                                style={{ zIndex: 10 }}
                            >
                                <div className="relative h-full rounded-2xl border border-white/10 bg-white/5 p-6 overflow-hidden">
                                    <GlowingEffect
                                        spread={50}
                                        glow={true}
                                        disabled={false}
                                        proximity={80}
                                        inactiveZone={0.05}
                                        borderWidth={2}
                                    />
                                    <div className="relative z-10">
                                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#dd7bbb]/40 to-[#5a922c]/20 mb-4 group-hover:from-[#dd7bbb]/60 group-hover:to-[#5a922c]/40 transition-all" />
                                        <h3 className="font-display text-lg group-hover:text-white transition-colors">{card.title}</h3>
                                        <p className="text-sm text-slate-400 mt-3 group-hover:text-slate-300 transition-colors">{card.detail}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="relative py-16 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <motion.p
                        whileInView={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-xs uppercase tracking-[0.4em] text-slate-500"
                    >
                        Built for
                    </motion.p>
                    <motion.h3
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="font-display text-2xl md:text-3xl mt-3"
                    >
                        Case competitions and consulting clubs
                    </motion.h3>
                    <motion.p
                        whileInView={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-slate-400 mt-4"
                    >
                        Designed using real consulting frameworks and pitch formats from top case competitions.
                    </motion.p>
                    <motion.div
                        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-400 text-sm"
                        initial="hidden"
                        whileInView="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                    >
                        {['IIT Case Comps', 'NIT Strategy Cells', 'Consulting Clubs', 'Hackathon Judges'].map((label) => (
                            <motion.div
                                key={label}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8 },
                                    visible: { opacity: 1, scale: 1 },
                                }}
                                className="relative bg-white/5 border border-white/10 rounded-xl py-3 hover:bg-white/10 hover:border-white/20 transition-all overflow-hidden group"
                            >
                                <GlowingEffect
                                    spread={20}
                                    glow={true}
                                    disabled={false}
                                    proximity={35}
                                    inactiveZone={0.3}
                                    borderWidth={1}
                                />
                                <div className="relative z-10 text-center">{label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#d79f1e]/5 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-3xl md:text-4xl"
                    >
                        Stop guessing. Start thinking like a consultant.
                    </motion.h2>
                    <motion.p
                        whileInView={{ opacity: 1 }}
                        initial={{ opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-slate-400 mt-4"
                    >
                        Stratify turns case problems into consulting-grade answers - fast, structured, and judge-ready.
                    </motion.p>
                    <motion.button
                        onClick={onStart}
                        whileInView={{ opacity: 1, scale: 1 }}
                        initial={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        whileHover={{
                            scale: 1.05,
                            boxShadow: "0_30px_100px_rgba(215,159,30,0.5)"
                        }}
                        whileTap={{ scale: 0.95 }}
                        className="relative mt-8 px-8 py-4 bg-gradient-to-r from-[#d79f1e] to-[#dd7bbb] text-slate-950 font-semibold rounded-full shadow-[0_20px_60px_rgba(215,159,30,0.35)] transition-all overflow-hidden"
                    >
                        <GlowingEffect
                            spread={38}
                            glow={true}
                            disabled={false}
                            proximity={65}
                            inactiveZone={0.2}
                            borderWidth={1.5}
                        />
                        <span className="relative z-10">Try Stratify Now</span>
                    </motion.button>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative border-t border-white/10 bg-black/20 backdrop-blur">
                <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                        {/* Product */}
                        <div className="relative p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                            <GlowingEffect
                                spread={20}
                                glow={true}
                                disabled={false}
                                proximity={40}
                                inactiveZone={0.2}
                                borderWidth={1}
                            />
                            <div className="relative z-10">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Product</p>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="#features" className="text-slate-300 hover:text-white transition-colors">Features</a></li>
                                    <li><a href="#preview" className="text-slate-300 hover:text-white transition-colors">How It Works</a></li>
                                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">GitHub</a></li>
                                    <li><a href="https://docs.example.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Documentation</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Company */}
                        <div className="relative p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                            <GlowingEffect
                                spread={20}
                                glow={true}
                                disabled={false}
                                proximity={40}
                                inactiveZone={0.2}
                                borderWidth={1}
                            />
                            <div className="relative z-10">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Company</p>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="mailto:hello@stratify.app" className="text-slate-300 hover:text-white transition-colors">Contact</a></li>
                                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Blog</a></li>
                                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Careers</a></li>
                                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Status</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Legal */}
                        <div className="relative p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                            <GlowingEffect
                                spread={20}
                                glow={true}
                                disabled={false}
                                proximity={40}
                                inactiveZone={0.2}
                                borderWidth={1}
                            />
                            <div className="relative z-10">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Legal</p>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Privacy Policy</a></li>
                                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Terms of Service</a></li>
                                    <li><a href="#" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>

                        {/* Social */}
                        <div className="relative p-4 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                            <GlowingEffect
                                spread={20}
                                glow={true}
                                disabled={false}
                                proximity={40}
                                inactiveZone={0.2}
                                borderWidth={1}
                            />
                            <div className="relative z-10">
                                <p className="text-xs uppercase tracking-[0.3em] text-slate-400 mb-4">Social</p>
                                <ul className="space-y-3 text-sm">
                                    <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Twitter</a></li>
                                    <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">LinkedIn</a></li>
                                    <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">Discord</a></li>
                                    <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-300 hover:text-white transition-colors">GitHub</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-white/10 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <p className="text-xs text-slate-500">© 2026 Stratify. All rights reserved.</p>
                            <p className="text-xs text-slate-500">
                                Built with <span className="text-[#35D4FF]">♡</span> for case competitors
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
