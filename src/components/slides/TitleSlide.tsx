import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../context/DeckContext';

interface TitleSlideProps {
    title: string;
    subtitle: string;
    presenter: string;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({ title, subtitle, presenter }) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full h-full flex flex-col justify-center items-center p-12 text-center"
            style={{ backgroundColor: THEME.primary }}
        >
            <motion.h1
                className="text-6xl font-bold text-white mb-6 tracking-tight"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
            >
                {title}
            </motion.h1>
            <motion.h2
                className="text-3xl text-white/90 font-light mb-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {subtitle}
            </motion.h2>
            <div className="mt-auto text-white/80 font-mono text-sm uppercase tracking-widest border-t border-white/30 pt-4">
                Presented by {presenter}
            </div>
        </motion.div>
    );
};
