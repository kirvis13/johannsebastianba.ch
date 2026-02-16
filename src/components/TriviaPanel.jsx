import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TriviaPanel = ({ details }) => {
    const { t } = useLanguage();
    const { language } = useLanguage();
    // Extract trivia data for current language only
    const triviaData = details?.content?.[language]?.trivia;

    if (!triviaData) {
        // Optional: Show nothing or a placeholder. 
        // User requested a section "onder de video". If empty, maybe keep the space or collapse?
        // Let's keep it clean: if no trivia, show nothing (or maybe a subtle placeholder if desired, but hidden is safer for now).
        return null; // Or <div className="p-6 text-gray-600 italic">Geen weetjes voor dit deel.</div>
    }

    return (
        <div className="p-6 bg-mp-darker border-t border-mp-dark/50 overflow-y-auto h-full">
            <div className="bg-mp-dark p-6 rounded-sm border-l-2 border-gray-700 shadow-lg">
                <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wide flex items-center">
                    <span className="mr-2">💡</span> {t('trivia')}
                </h3>
                <div className="text-gray-300 italic text-sm space-y-3 leading-relaxed">
                    {Array.isArray(triviaData)
                        ? triviaData.map((t, i) => (
                            <div key={i} className="flex items-start">
                                <span className="mr-2 opacity-50">•</span>
                                <p>{t.fact}</p>
                            </div>
                        ))
                        : (
                            <div className="flex items-start">
                                <span className="mr-2 opacity-50">•</span>
                                <p>{triviaData}</p>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    );
};

export default TriviaPanel;
