import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AnatomyVisualizer = ({ activeStep, showTitles }) => {

    // Configuration for the visualizer
    const config = {
        width: 800,
        height: 600,
        centerX: 400,
        centerY: 300,
        choirGap: 100,
    };

    // Helper to generate choir positions (dot matrix)
    const generateChoir = (centerX, centerY, rows = 4, cols = 8) => {
        const dots = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                dots.push({
                    x: centerX - (cols * 15) / 2 + c * 15,
                    y: centerY - (rows * 15) / 2 + r * 15,
                    id: `dot-${centerX}-${r}-${c}`
                });
            }
        }
        return dots;
    };

    const leftChoir = generateChoir(config.centerX - config.choirGap, config.centerY - 50);
    const rightChoir = generateChoir(config.centerX + config.choirGap, config.centerY - 50);
    const orchestra = generateChoir(config.centerX, config.centerY + 50, 3, 10); // orchestra below

    // Animation Variants
    const containerVariants = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 1 } },
        exit: { opacity: 0 }
    };

    return (
        <div className="w-full h-full flex items-center justify-center bg-transparent">
            <svg
                viewBox={`0 0 ${config.width} ${config.height}`}
                className="w-full h-full max-w-4xl opacity-90"
                style={{ filter: 'drop-shadow(0px 0px 10px rgba(212, 175, 55, 0.1))' }}
            >
                {/* STEP 0: TUTTI (All Visible) */}
                <AnimatePresence>
                    {(activeStep === 0 || activeStep === 1) && (
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Left Choir */}
                            {leftChoir.map(dot => (
                                <motion.circle
                                    key={dot.id}
                                    cx={dot.x}
                                    cy={dot.y}
                                    r={2}
                                    fill={activeStep === 1 ? "#D4AF37" : "rgba(255,255,255,0.3)"} // Gold if active? No, let's pulse
                                    animate={activeStep === 1 ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
                                    transition={activeStep === 1 ? { duration: 2, repeat: Infinity, delay: 0 } : {}}
                                />
                            ))}

                            {/* Right Choir */}
                            {rightChoir.map(dot => (
                                <motion.circle
                                    key={dot.id}
                                    cx={dot.x}
                                    cy={dot.y}
                                    r={2}
                                    fill={activeStep === 1 ? "#D4AF37" : "rgba(255,255,255,0.3)"}
                                    animate={activeStep === 1 ? { opacity: [0.3, 1, 0.3] } : { opacity: 0.5 }}
                                    transition={activeStep === 1 ? { duration: 2, repeat: Infinity, delay: 1 } : {}}
                                />
                            ))}

                            {/* Orchestra */}
                            {orchestra.map(dot => (
                                <motion.circle
                                    key={dot.id}
                                    cx={dot.x}
                                    cy={dot.y}
                                    r={3}
                                    fill="rgba(255,255,255,0.5)"
                                    animate={activeStep === 0 ? { scale: [1, 1.2, 1] } : {}}
                                    transition={{ duration: 3, repeat: Infinity }}
                                />
                            ))}
                        </motion.g>
                    )}
                </AnimatePresence>

                {/* STEP 2: CONTINUO (Wave) */}
                <AnimatePresence>
                    {activeStep === 2 && (
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, transition: { duration: 0.5 } }}
                        >
                            <motion.path
                                d={`M ${config.centerX - 300} ${config.centerY + 100} Q ${config.centerX} ${config.centerY + 150} ${config.centerX + 300} ${config.centerY + 100}`}
                                fill="transparent"
                                stroke="#D4AF37"
                                strokeWidth={4}
                                strokeLinecap="round"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 1.5, ease: "easeInOut" }}
                            />
                            {/* Floating lines above to imply silence/fading others */}
                            <motion.path
                                d={`M ${config.centerX - 300} ${config.centerY + 120} Q ${config.centerX} ${config.centerY + 170} ${config.centerX + 300} ${config.centerY + 120}`}
                                fill="transparent"
                                stroke="#D4AF37"
                                strokeWidth={2}
                                opacity={0.5}
                            />
                        </motion.g>
                    )}
                </AnimatePresence>

                {/* STEP 3: HALO (Jesus + Strings) */}
                <AnimatePresence>
                    {activeStep === 3 && (
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Central Jesus Node */}
                            <motion.circle
                                cx={config.centerX}
                                cy={config.centerY}
                                r={10}
                                fill="#D4AF37"
                                shadow="0 0 20px #D4AF37"
                                animate={{ boxShadow: "0 0 30px #D4AF37" }}
                            />
                            {/* Halo Arcs */}
                            {[40, 60, 80].map((radius, i) => (
                                <motion.circle
                                    key={i}
                                    cx={config.centerX}
                                    cy={config.centerY}
                                    r={radius}
                                    fill="transparent"
                                    stroke="#D4AF37"
                                    strokeWidth={1}
                                    strokeDasharray="4 4"
                                    opacity={0.3}
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                                />
                            ))}
                        </motion.g>
                    )}
                </AnimatePresence>

                {/* STEP 4: SOLO (Interweaving) */}
                <AnimatePresence>
                    {activeStep === 4 && (
                        <motion.g
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* Voice Line */}
                            <motion.path
                                d={`M ${config.centerX - 100} ${config.centerY + 100} C ${config.centerX - 50} ${config.centerY - 50}, ${config.centerX + 50} ${config.centerY - 50}, ${config.centerX + 100} ${config.centerY + 100}`}
                                stroke="#D4AF37"
                                strokeWidth={3}
                                fill="transparent"
                                animate={{ d: `M ${config.centerX - 100} ${config.centerY + 100} C ${config.centerX - 50} ${config.centerY - 150}, ${config.centerX + 50} ${config.centerY - 150}, ${config.centerX + 100} ${config.centerY + 100}` }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                            />
                            {/* Instrument Line */}
                            <motion.path
                                d={`M ${config.centerX - 100} ${config.centerY + 100} C ${config.centerX - 50} ${config.centerY + 200}, ${config.centerX + 50} ${config.centerY + 200}, ${config.centerX + 100} ${config.centerY + 100}`}
                                stroke="rgba(255,255,255,0.5)"
                                strokeWidth={2}
                                fill="transparent"
                                animate={{ d: `M ${config.centerX - 100} ${config.centerY + 100} C ${config.centerX - 50} ${config.centerY + 50}, ${config.centerX + 50} ${config.centerY + 50}, ${config.centerX + 100} ${config.centerY + 100}` }}
                                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
                            />
                        </motion.g>
                    )}
                </AnimatePresence>

            </svg>
        </div>
    );
};

export default AnatomyVisualizer;
