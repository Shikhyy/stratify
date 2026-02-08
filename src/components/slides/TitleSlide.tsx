import React from 'react';
import { motion } from 'framer-motion';

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
            transition={{ duration: 0.5 }}
            className={`relative w-full h-full flex flex-col justify-between p-16 overflow-hidden ${isDark ? 'bg-slate-950' : 'bg-white'}`}
        >
            {/* Subtle Background Gradient */}
            <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-slate-950 via-slate-900/50 to-slate-950' : 'bg-gradient-to-br from-white via-slate-50/50 to-white'}`} />
            
            {/* Subtle Accent Circle (top right) */}
            <div className={`absolute top-0 right-0 w-96 h-96 rounded-full ${isDark ? 'bg-blue-500/5' : 'bg-blue-400/5'} blur-3xl`} />
            
            {/* Content */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
                {/* Animated Accent Bar */}
                <motion.div 
                    className="h-1 mb-10 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    style={{ 
                        background: 'linear-gradient(90deg, #d79f1e 0%, #3b82f6 100%)',
                    }}
                />
                
                {/* Title */}
                <motion.h1
                    className={`text-6xl font-bold mb-8 tracking-tight leading-tight max-w-4xl ${isDark ? 'text-white' : 'text-slate-900'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.6 }}
                >
                    {title}
                </motion.h1>
                
                {/* Subtitle */}
                <motion.p
                    className={`text-lg font-medium mb-12 max-w-3xl leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                >
                    {subtitle}
                </motion.p>
                
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45, duration: 0.5 }}
                >
                    <div className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border ${isDark ? 'bg-slate-800/40 border-slate-700/50 text-slate-300' : 'bg-slate-100/60 border-slate-300/50 text-slate-700'}`}>
                        <div className='w-2 h-2 rounded-full bg-blue-500' />
                        <span className='text-sm font-semibold uppercase tracking-wide'>
                            {presenter}
                        </span>
                    </div>
                </motion.div>
            </div>
            
            {/* Footer Info */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className={`relative z-10 text-xs uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-500'}`}
            >
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.div>
        </motion.div>
    );
};
