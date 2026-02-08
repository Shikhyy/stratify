import React from 'react';

interface StratifyLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    showText?: boolean;
}

const sizeMap = {
    sm: { icon: 24, text: 16 },
    md: { icon: 32, text: 20 },
    lg: { icon: 48, text: 32 },
    xl: { icon: 64, text: 48 },
};

export const StratifyLogo: React.FC<StratifyLogoProps> = ({
    size = 'md',
    className = '',
    showText = true,
}) => {
    const dimensions = sizeMap[size];

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Logo Icon - Geometric Pyramid with Gradient */}
            <div className="relative group">
                <svg
                    width={dimensions.icon}
                    height={dimensions.icon}
                    viewBox="0 0 64 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="relative z-10"
                >
                    <defs>
                        <linearGradient id="pyramidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#d79f1e', stopOpacity: 1 }} />
                            <stop offset="100%" style={{ stopColor: '#dd7bbb', stopOpacity: 1 }} />
                        </linearGradient>
                        <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" style={{ stopColor: '#dd7bbb', stopOpacity: 0.4 }} />
                            <stop offset="100%" style={{ stopColor: '#d79f1e', stopOpacity: 0.15 }} />
                        </linearGradient>
                    </defs>

                    {/* Outer Glow Circle */}
                    <circle cx="32" cy="32" r="30" fill="url(#glowGradient)" opacity="0.6" />

                    {/* Main Pyramid (Triangle) */}
                    <polygon
                        points="32,10 54,54 10,54"
                        fill="url(#pyramidGradient)"
                        strokeWidth="1.5"
                        stroke="rgba(255,255,255,0.3)"
                    />

                    {/* Inner highlights for depth */}
                    <line
                        x1="32"
                        y1="10"
                        x2="32"
                        y2="54"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="1"
                    />
                    <polygon
                        points="32,10 43,32 32,54"
                        fill="rgba(255,255,255,0.08)"
                    />

                    {/* Small accent dot at top */}
                    <circle cx="32" cy="14" r="2" fill="rgba(255,255,255,0.5)" />
                </svg>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-[#dd7bbb]/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Text Branding */}
            {showText && (
                <div className="flex flex-col">
                    <h1
                        className="font-logo leading-none"
                        style={{ fontSize: `${dimensions.text}px` }}
                    >
                        <span className="bg-gradient-to-r from-[#d79f1e] via-[#dd7bbb] to-[#dd7bbb] bg-clip-text text-transparent font-bold">
                            STRATIFY
                        </span>
                    </h1>
                    <p className="text-xs text-[#ffd699] font-medium tracking-widest -mt-1">
                        AI CONSULTANT
                    </p>
                </div>
            )}
        </div>
    );
};
