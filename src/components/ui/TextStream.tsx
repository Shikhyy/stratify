// import React from 'react';
import { motion } from "framer-motion";

export const TextStream = ({ text }: { text: string }) => {
    const words = text.split(" ");

    return (
        <p className="text-slate-300 leading-relaxed font-light tracking-wide">
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    transition={{
                        duration: 0.4,
                        delay: i * 0.02, // Stagger effect
                        ease: "easeOut"
                    }}
                    className="inline-block mr-1.5"
                >
                    {word}
                </motion.span>
            ))}
        </p>
    );
};
