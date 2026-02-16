import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const InterpretationPanel = ({ details }) => {
    const { language, t } = useLanguage();

    // Extract interpretation data based on language if possible, defaulting to NL
    // Support both old structure (content.nl.interpretation) and new structure (content.interpretation.nl)
    const interpretation =
        details?.content?.[language]?.interpretation ||
        details?.content?.nl?.interpretation ||
        details?.content?.interpretation?.[language] ||
        details?.content?.interpretation?.nl;

    if (!interpretation) {
        return null;
    }

    // Helper to format text with **bold** and newlines
    const formatText = (text) => {
        return text.split('\n').map((line, i) => {
            if (!line) return <div key={i} className="h-4" />; // Spacer for empty lines

            // Parse bold **text**
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
                <p key={i} className="mb-2">
                    {parts.map((part, j) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j} className="text-mp-gold font-normal">{part.slice(2, -2)}</strong>;
                        }
                        return part;
                    })}
                </p>
            );
        });
    };

    return (
        <div className="p-6 bg-mp-darker border-t border-mp-dark/50 overflow-y-auto h-full text-mp-text">
            <h3 className="text-xl font-serif text-mp-gold mb-4 tracking-wide font-light">
                {t('interpretation')}
            </h3>
            <div className="text-lg leading-relaxed font-light text-gray-300 font-serif">
                {formatText(interpretation)}
            </div>
        </div>
    );
};

export default InterpretationPanel;
