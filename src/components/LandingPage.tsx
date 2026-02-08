import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';

interface LandingPageProps {
    onStart: () => void;
}

const Pyramid: React.FC = () => {
    const meshRef = useRef<any>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.y += 0.003;
        meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    });

    return (
        <mesh ref={meshRef}>
            <tetrahedronGeometry args={[1.6, 0]} />
            <meshStandardMaterial color="#35D4FF" metalness={0.6} roughness={0.25} />
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

            {/* Hero */}
            <section className="relative min-h-screen flex items-center justify-center px-6">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '32px 32px' }} />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 max-w-6xl w-full items-center">
                    <div>
                        <motion.p
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="text-sm uppercase tracking-[0.35em] text-slate-400"
                        >
                            Stratify - AI Case Competition Agent
                        </motion.p>
                        <motion.h1
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.1 }}
                            className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold mt-4 leading-tight"
                        >
                            Turn any case problem into a judge-winning consulting deck.
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.2 }}
                            className="text-slate-300 mt-6 text-lg max-w-xl"
                        >
                            Stratify is an AI strategy agent that thinks like a McKinsey consultant, structures your answer, and generates a complete, submission-ready PPT.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.9, delay: 0.3 }}
                            className="mt-8 flex flex-wrap items-center gap-4"
                        >
                            <button
                                onClick={onStart}
                                className="px-6 py-3 bg-gradient-to-r from-[#35D4FF] to-[#2E5EFF] text-slate-950 font-semibold rounded-full shadow-[0_20px_60px_rgba(53,212,255,0.35)] hover:shadow-[0_25px_80px_rgba(46,94,255,0.45)] transition-shadow"
                            >
                                Try Stratify
                            </button>
                            <a
                                href="#preview"
                                className="px-6 py-3 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors"
                            >
                                See How It Works
                            </a>
                        </motion.div>
                    </div>

                    <div className="relative h-[420px] sm:h-[480px]">
                        <div className="absolute inset-0 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl" />
                        <div className="absolute -inset-8 rounded-[40px] bg-gradient-to-br from-[#35D4FF]/10 via-transparent to-[#2E5EFF]/20 blur-2xl" />
                        <div className="relative h-full w-full">
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
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-slate-200"
                                >
                                    {item}
                                </motion.div>
                            ))}
                            <div className="mt-4 text-xs uppercase tracking-[0.3em] text-[#35D4FF]">
                                The problem isn’t effort. It’s structure.
                            </div>
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

                    <div className="mt-12 grid md:grid-cols-4 gap-6">
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
                                className="bg-gradient-to-b from-white/8 to-white/3 border border-white/10 rounded-2xl p-5"
                            >
                                <div className="text-xs uppercase tracking-[0.4em] text-[#35D4FF]">0{idx + 1}</div>
                                <h3 className="font-display text-lg mt-3">{step.title}</h3>
                                <p className="text-sm text-slate-400 mt-3">{step.detail}</p>
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
                            className="mt-6 px-5 py-3 bg-white/10 border border-white/20 rounded-full hover:bg-white/20 transition-colors"
                        >
                            Build Your First Case
                        </button>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Case Input</p>
                                <div className="mt-3 space-y-2 text-sm text-slate-200">
                                    <p>Case: Retail profit decline</p>
                                    <p>Metric: +15% margin in 12 months</p>
                                    <p>Constraint: Capex under $5M</p>
                                </div>
                            </div>
                            <div className="bg-black/40 border border-white/10 rounded-2xl p-4">
                                <p className="text-xs text-slate-400 uppercase tracking-[0.3em]">Blocks Generated</p>
                                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                    <li>Problem Definition</li>
                                    <li>Core Insight</li>
                                    <li>3 Strategy Pillars</li>
                                    <li>Financial Impact</li>
                                </ul>
                            </div>
                        </div>
                        <div className="mt-4 bg-gradient-to-r from-[#35D4FF]/20 to-[#2E5EFF]/20 rounded-2xl p-4 text-sm text-slate-200">
                            Slides assembling into a judge-ready deck...
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
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        {[
                            'Structured pitch generation',
                            'Block-level editing',
                            'Judge-mode evaluator',
                            'Auto PPT generation',
                            'Consulting infographics',
                            'Insight-first reasoning',
                        ].map((feature) => (
                            <motion.div
                                key={feature}
                                whileHover={{ y: -6 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-5"
                            >
                                <div className="h-10 w-10 rounded-xl bg-[#35D4FF]/15 mb-4" />
                                <p className="text-slate-200">{feature}</p>
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
                    <div className="mt-10 border border-white/10 rounded-2xl overflow-hidden">
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
                                <div className="p-4 bg-black/10 text-[#35D4FF]">{row[1]}</div>
                            </motion.div>
                        ))}
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
                    <div className="mt-12 grid md:grid-cols-3 gap-6">
                        {[
                            { title: 'Case competition teams', detail: 'Win with structured thinking and cleaner slides.' },
                            { title: 'Consulting clubs', detail: 'Train members with consultant-grade outputs.' },
                            { title: 'Hackathon builders', detail: 'Ship a winning story in hours, not weeks.' },
                        ].map((card) => (
                            <motion.div
                                key={card.title}
                                whileHover={{ y: -6 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                initial={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.5 }}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6"
                            >
                                <div className="h-12 w-12 rounded-2xl bg-[#2E5EFF]/20 mb-4" />
                                <h3 className="font-display text-lg">{card.title}</h3>
                                <p className="text-sm text-slate-400 mt-3">{card.detail}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="relative py-16 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-xs uppercase tracking-[0.4em] text-slate-500">Built for</p>
                    <h3 className="font-display text-2xl md:text-3xl mt-3">Case competitions and consulting clubs</h3>
                    <p className="text-slate-400 mt-4">
                        Designed using real consulting frameworks and pitch formats from top case competitions.
                    </p>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-400 text-sm">
                        {['IIT Case Comps', 'NIT Strategy Cells', 'Consulting Clubs', 'Hackathon Judges'].map(label => (
                            <div key={label} className="bg-white/5 border border-white/10 rounded-xl py-3">
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="relative py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        whileInView={{ opacity: 1, y: 0 }}
                        initial={{ opacity: 0, y: 12 }}
                        transition={{ duration: 0.6 }}
                        className="font-display text-3xl md:text-4xl"
                    >
                        Stop guessing. Start thinking like a consultant.
                    </motion.h2>
                    <p className="text-slate-400 mt-4">Stratify turns case problems into consulting-grade answers - fast, structured, and judge-ready.</p>
                    <button
                        onClick={onStart}
                        className="mt-8 px-8 py-4 bg-gradient-to-r from-[#35D4FF] to-[#2E5EFF] text-slate-950 font-semibold rounded-full shadow-[0_20px_60px_rgba(53,212,255,0.35)]"
                    >
                        Try Stratify Now
                    </button>
                </div>
            </section>
        </div>
    );
};
