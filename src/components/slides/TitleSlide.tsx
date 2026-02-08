import React from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../context/DeckContext';
import { useTheme } from '../../context/ThemeContext';

interface TitleSlideProps {
    title: string;
    subtitle: string;
    presenter: string;
}

export const TitleSlide: React.FC<TitleSlideProps> = ({ title, subtitle, presenter }) => {
    const { isDark } = useTheme();
    
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className={`w-full h-full flex flex-col justify-center items-start p-12 text-left ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}
        >
            <div className="w-12 h-1 mb-6" style={{ backgroundColor: THEME.primary }} />
            <motion.h1
                className={`text-4xl font-semibold mb-4 tracking-tight max-w-[80%] ${isDark ? 'text-white' : 'text-slate-900'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                {title}
            </motion.h1>
            <motion.h2
                className={`text-lg font-medium mb-10 max-w-[70%] ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {subtitle}
            </motion.h2>
            <div className={`mt-auto text-xs uppercase tracking-wider border-t pt-3 w-full ${isDark ? 'text-slate-400 border-white/10' : 'text-slate-500 border-slate-200'}`}>
                Presented by {presenter}
            </div>
        </motion.div>
    );
};
