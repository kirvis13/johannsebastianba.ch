import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Info, HelpCircle } from 'lucide-react';
import { glossary } from '../data/glossary';

const PlayerHeader = ({ currentChapter, details, onSourceClick, onPrevClick, onNextClick }) => {
    const { language, t } = useLanguage();
    const [showTooltip, setShowTooltip] = useState(false);

    if (!currentChapter) return null;

    const hasSourceData = details?.content?.original_source;

    // Data extraction
    const sceneLabel = currentChapter.scene_label?.[language];
    // Normalize type key for glossary lookup (handle variations if any)
    const speaker = currentChapter.speaker;
    const nbaNo = currentChapter.nba_no || currentChapter.id.replace('part_', '');
    const typeKey = currentChapter.type?.toLowerCase();

    // Normalize type key for glossary lookup (handle variations if any)
    const glossaryKey = Object.keys(glossary).find(k => typeKey?.includes(k));
    const glossaryItem = glossaryKey ? glossary[glossaryKey] : null;
    const glossaryText = glossaryItem ? glossaryItem[language] : null;

    const getTypeTranslation = (type) => {
        const key = type?.toLowerCase();
        if (key?.includes('arioso')) return 'Arioso';
        if (key?.includes('recitativ')) return t('types.recitative');
        if (key?.includes('choral') && !key?.includes('chorus')) return t('types.chorale');
        if (key?.includes('aria')) return t('types.aria');
        return t('types.chorus');
    };

    const typeLabel = getTypeTranslation(currentChapter.type);

    const getTypeColor = (type) => {
        const t = type?.toLowerCase() || "";
        if (t.includes('arioso')) return "text-mp-blue border-mp-blue";
        if (t.includes('recitativ')) return "text-mp-red border-mp-red";
        if (t.includes('choral')) return "text-mp-green border-mp-green";
        if (t.includes('aria')) return "text-mp-blue border-mp-blue";
        return "text-mp-gold border-mp-gold";
    };

    const getSourceInfo = (type) => {
        const k = type?.toLowerCase() || "";
        if (k.includes('arioso')) return { icon: "✍️", text: t('sources.poetry') };
        if (k.includes('recitativ')) return { icon: "📖", text: t('sources.bible') };
        if (k.includes('choral')) return { icon: "⛪", text: t('sources.hymn') };
        if (k.includes('aria')) return { icon: "✍️", text: t('sources.poetry') };
        return { icon: "👥", text: t('sources.choir') };
    };

    return (
        <header className="border-b border-mp-gold/30 pb-6 mb-8 relative z-20">
            {/* 1. SCENE LABEL (Eyebrow) */}
            {sceneLabel && (
                <div className="text-yellow-500/80 text-xs font-bold uppercase tracking-widest mb-2">
                    {sceneLabel}
                </div>
            )}

            {/* Main Title */}
            <h2 className="text-3xl font-serif text-mp-gold mb-4 tracking-wide font-light">
                {currentChapter?.title || details?.title || "Matthäus-Passion"}
            </h2>

            {/* Metadata Row */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm">

                {/* 2. SUBTYPE BADGE (with Glyph/Color) */}
                <div
                    className="relative group"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => setShowTooltip(!showTooltip)}
                >
                    <div className={`flex items-center space-x-2 border px-3 py-1 rounded ${getTypeColor(currentChapter.type)} bg-opacity-10 cursor-help hover:bg-white/5 transition-colors`}>
                        <span className="uppercase tracking-widest text-xs font-semibold">
                            {typeLabel}
                        </span>
                        {glossaryText && <HelpCircle size={12} className="opacity-50" />}
                    </div>

                    {/* Tooltip */}
                    {showTooltip && glossaryText && (
                        <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-mp-darker border border-gray-700 rounded shadow-xl z-50 text-xs text-gray-300 leading-relaxed animate-fadeIn">
                            {glossaryText}
                            <div className="absolute -top-1 left-4 w-2 h-2 bg-mp-darker border-l border-t border-gray-700 transform rotate-45"></div>
                        </div>
                    )}
                </div>

                {/* 3. SPEAKER / INSTRUMENTATION */}
                {speaker && (
                    <div className="hidden md:flex items-center text-gray-400 font-serif italic">
                        <span className="text-mp-gold/50 mr-2">•</span>
                        {speaker}
                    </div>
                )}

                <div className="hidden md:block text-gray-600">|</div>

                {/* 4. NBA NUMBER */}
                <span className="text-gray-500 font-mono text-xs">
                    No. {nbaNo}
                </span>

                {/* DEBUG ID */}
                <span className="text-[10px] text-white font-mono opacity-30 ml-2">
                    {currentChapter.id}
                </span>

                {/* Source Link */}
                <button
                    onClick={onSourceClick}
                    disabled={!hasSourceData}
                    className={`flex items-center space-x-2 group ${hasSourceData ? 'cursor-pointer hover:text-white transition-colors' : 'cursor-default text-gray-500'}`}
                >
                    <span className="text-gray-400 group-hover:text-white transition-colors">
                        {getSourceInfo(currentChapter.type)?.icon}
                    </span>
                    {hasSourceData && (
                        <Info size={14} className="text-mp-gold opacity-50 group-hover:opacity-100 transition-opacity" />
                    )}
                </button>

                {/* --- TEMPORARY: Navigation Buttons for Testing --- */}
                <div className="flex items-center space-x-2 ml-auto">
                    <button
                        onClick={onPrevClick}
                        className="p-1.5 bg-mp-dark border border-mp-darker hover:bg-mp-gold hover:text-mp-dark text-gray-400 rounded transition-colors"
                        title="Previous Chapter"
                    >
                        &lt;
                    </button>
                    <button
                        onClick={onNextClick}
                        className="p-1.5 bg-mp-dark border border-mp-darker hover:bg-mp-gold hover:text-mp-dark text-gray-400 rounded transition-colors"
                        title="Next Chapter"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </header>
    );
};

export default PlayerHeader;
