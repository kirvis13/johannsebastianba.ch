import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const InterpretationPanel = ({ details, collapsible = false }) => {
    const { language, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const interpretation =
        details?.content?.[language]?.interpretation ||
        details?.content?.nl?.interpretation ||
        details?.content?.interpretation?.[language] ||
        details?.content?.interpretation?.nl;

    if (!interpretation) {
        return null;
    }

    const formatText = (text) => {
        return text.split('\n').map((line, i) => {
            if (!line) return <div key={i} className="h-4" />;

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

    if (collapsible) {
        return (
            <div className="border-t border-mp-dark/50 bg-mp-darker">
                <button
                    onClick={() => setIsOpen(v => !v)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                    <span className="text-sm font-serif text-mp-gold tracking-wide font-light">
                        {t('interpretation')}
                    </span>
                    <ChevronDown
                        size={16}
                        className={`text-mp-gold transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>
                {isOpen && (
                    <div className="px-6 pb-6 text-base leading-relaxed font-light text-gray-300 font-serif">
                        {formatText(interpretation)}
                    </div>
                )}
            </div>
        );
    }

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
