import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Info, Music, BookOpen, Lightbulb } from 'lucide-react';
import SourceModal from './SourceModal';
import PlayerHeader from './PlayerHeader';

// --- Sub-components (could be separate files, kept here for simplicity/context) ---

const TriviaCard = ({ trivia, language, t }) => {
    if (!trivia) return null;

    // Normalize to array
    const items = Array.isArray(trivia) ? trivia : [trivia];

    return (
        <div className="space-y-4 mt-8">
            {items.map((item, index) => {
                const category = item.category || 'general';
                const factText = (typeof item.fact === 'object')
                    ? (item.fact[language] || item.fact.nl || item.fact.en)
                    : item.fact;

                // Styling based on category
                let borderColor = 'border-mp-gold';
                let icon = <Lightbulb size={16} />;
                let label = t ? t('trivia') : 'Wist je dat?';

                if (category.toLowerCase().includes('theolog')) {
                    borderColor = 'border-purple-500';
                    icon = <BookOpen size={16} className="text-purple-400" />;
                    label = 'Theologie';
                } else if (category.toLowerCase().includes('muzik') || category.toLowerCase().includes('musical')) {
                    borderColor = 'border-blue-500';
                    icon = <Music size={16} className="text-blue-400" />;
                    label = 'Muziektheorie';
                }

                // Helper to render text with *italics*
                const formatTriviaText = (text) => {
                    if (!text) return null;
                    const parts = text.split(/(\*.*?\*)/g);
                    return parts.map((part, i) => {
                        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
                            return <span key={i} className="italic text-white/90">{part.slice(1, -1)}</span>;
                        }
                        return part;
                    });
                };

                return (
                    <div key={index} className={`bg-mp-dark p-4 rounded-sm border-l-4 ${borderColor} animate-fadeIn`}>
                        <div className="flex items-center space-x-2 mb-2 opacity-80">
                            {icon}
                            <span className="text-xs uppercase tracking-widest font-semibold text-gray-400">{label}</span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-2">
                            {formatTriviaText(factText)}
                        </p>
                        {item.source && (
                            <div className="text-xs text-gray-600 italic text-right">
                                — {item.source}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

const ChoraleTracker = ({ meta }) => {
    if (!meta?.passion_chorale_counter) return null;

    // specific format: "1_of_5"
    const [current, total] = meta.passion_chorale_counter.split('_of_').map(Number);
    if (!current || !total) return null;

    return (
        <div className="mt-8 pt-6 border-t border-mp-dark/50">
            <div className="flex items-center justify-between mb-2">
                <span className="text-mp-green text-xs uppercase tracking-widest font-bold">Passiekoraal</span>
                <span className="text-gray-500 text-xs">{current} van {total}</span>
            </div>
            <div className="flex space-x-2">
                {Array.from({ length: total }).map((_, i) => (
                    <div
                        key={i}
                        className={`h-1.5 flex-1 rounded-full transition-colors ${i < current ? 'bg-mp-green' : 'bg-gray-800'
                            }`}
                    />
                ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 italic">
                Volg de muzikale ontwikkeling van de melodie "O Haupt voll Blut und Wunden".
            </p>
        </div>
    );
};


const DetailsPanel = ({ currentChapter, details, currentTime, onPrevClick, onNextClick, onOpenChapters }) => {
    const scrollRef = useRef(null);
    const { language, t } = useLanguage();
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [lyricsTab, setLyricsTab] = useState('translation');

    // Reset tab when chapter changes so we always start on translation
    useEffect(() => {
        setLyricsTab('translation');
    }, [currentChapter]);

    // Auto-scroll to top when chapter changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [currentChapter]);

    // --- Visual Effects Logic ---
    const activeEffect = useMemo(() => {
        const cues = details?.visual_cues || details?.content?.visual_cues || [];
        if (!cues.length) return null;

        const activeCue = cues.find(cue => {
            const endpoint = cue.time + cue.duration;
            return currentTime >= cue.time && currentTime < endpoint;
        });

        return activeCue ? activeCue.type : null;
    }, [details, currentTime]);

    const getEffectStyles = (effect) => {
        switch (effect) {
            case 'lightning':
                return {
                    overlay: 'bg-white/10 shadow-[inset_0_0_50px_rgba(255,255,255,0.2)]',
                    container: ''
                };
            case 'thunder':
                return {
                    overlay: 'bg-red-900/20',
                    container: 'translate-x-[2px] translate-y-[2px]'
                };
            case 'abyss_open':
                return {
                    overlay: 'shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] bg-black/60 border-4 border-red-900/20',
                    container: ''
                };
            case 'storm_intensity_high':
                return {
                    overlay: 'shadow-[inset_0_0_200px_rgba(50,0,0,0.8)] bg-red-950/40',
                    container: ''
                };
            case 'calm':
            default:
                return { overlay: '', container: '' };
        }
    };

    const { overlay: overlayClasses, container: containerClasses } = getEffectStyles(activeEffect);

    // Helper to render text with markdown speakers (**Name:**)
    const TextRenderer = ({ text, className }) => {
        if (!text) return null;

        return (
            <div className={className}>
                {text.split('\n').map((line, i) => {
const legacyMatch = line.match(/^([\p{L}\s]+):(.*)/u);
                    if (legacyMatch && !line.includes('**')) {
                        const role = legacyMatch[1];
                        const content = legacyMatch[2];
                        return (
                            <div key={i} className="mb-2">
                                <span className="text-mp-gold uppercase text-xs tracking-widest font-bold mr-2 opacity-80">
                                    {role}:
                                </span>
                                <span>{content}</span>
                            </div>
                        );
                    }

                    const parts = line.split(/(\*\*.*?\*\*)/g);
                    if (parts.length > 1) {
                        return (
                            <div key={i} className="mb-2">
                                {parts.map((part, j) => {
                                    if (part.startsWith('**') && part.endsWith('**')) {
                                        return (
                                            <span key={j} className="text-mp-gold uppercase text-xs tracking-widest font-bold mr-2 opacity-80">
                                                {part.slice(2, -2)}
                                            </span>
                                        );
                                    }
                                    return <span key={j}>{part}</span>;
                                })}
                            </div>
                        );
                    }

                    return <div key={i} className="mb-1">{line}</div>;
                })}
            </div>
        );
    };

    const hasSourceData = details?.content?.original_source;

    const localizedContent = details?.content?.[language] || details?.content?.nl;
    const germanContent = details?.content?.de;

    // --- Alignment Logic ---
    const parseLyrics = (text) => {
        if (!text) return [];
        const lines = text.split('\n');
        const segments = [];
        let currentSegment = null;

        lines.forEach(line => {
// Match Speaker: or **Speaker:** at start of line (including & for "Soprano & Alto")
            const match = line.match(/^([\p{L}\s&]+):(.*)/u) || line.match(/^(\*\*.*?\*\*):?(.*)/);
            if (match && !line.includes('**') || (line.includes('**') && match)) {
                if (currentSegment) segments.push(currentSegment);

                let speaker = match[1].replace(/\*/g, '').trim();
                let content = match[2].trim();

                currentSegment = { speaker, content };
            } else {
                if (currentSegment) {
                    currentSegment.content += '\n' + line;
                } else {
                    currentSegment = { speaker: '', content: line };
                }
            }
        });
        if (currentSegment) segments.push(currentSegment);

        if (segments.length === 0 && text) {
            return [{ speaker: '', content: text }];
        }

        return segments;
    };

    const germanSegments = parseLyrics(germanContent?.lyrics || details?.german);
    const localizedSegments = parseLyrics(localizedContent?.lyrics || details?.content?.nl?.lyrics || details?.dutch);

    const SegmentContent = ({ content, className }) => (
        <div className={`whitespace-pre-line ${className}`}>
            {content}
        </div>
    );

    const translationLabel = { en: 'English', nl: t('dutch'), fr: t('french') }[language] || t('dutch');

    return (
        <div
            ref={scrollRef}
            className={`w-full flex-1 min-h-0 overflow-y-auto bg-mp-darker text-mp-text p-8 scroll-smooth relative transition-transform duration-100 ${containerClasses}`}
        >

            {/* Lightning Flash Overlay */}
            {activeEffect === 'lightning' && (
                <div className="absolute inset-0 bg-white/5 pointer-events-none animate-pulse z-50"></div>
            )}

            {/* Visual Effects Overlay */}
            <div className={`absolute inset-0 pointer-events-none transition-all duration-300 ease-in-out z-0 ${overlayClasses}`} />

            <div className="max-w-2xl space-y-8 animate-fadeIn pb-24 relative z-10">

                <PlayerHeader
                    currentChapter={currentChapter}
                    details={details}
                    onSourceClick={() => hasSourceData && setShowSourceModal(true)}
                    onPrevClick={onPrevClick}
                    onNextClick={onNextClick}
                    onOpenChapters={onOpenChapters}
                />

                {details || currentChapter ? (
                    details ? (
                        <div className="space-y-8">

                            {/* ── MOBILE: Tab toggle for lyrics ── */}
                            <div className="md:hidden">
                                {/* Tab bar */}
                                <div className="flex border-b border-mp-dark/70 mb-5">
                                    <button
                                        onClick={() => setLyricsTab('translation')}
                                        className={`flex-1 py-2 text-xs uppercase tracking-widest transition-colors ${lyricsTab === 'translation'
                                            ? 'text-mp-gold border-b-2 border-mp-gold'
                                            : 'text-gray-500'}`}
                                    >
                                        {translationLabel}
                                    </button>
                                    <button
                                        onClick={() => setLyricsTab('de')}
                                        className={`flex-1 py-2 text-xs uppercase tracking-widest transition-colors ${lyricsTab === 'de'
                                            ? 'text-mp-gold border-b-2 border-mp-gold'
                                            : 'text-gray-500'}`}
                                    >
                                        {t('german')}
                                    </button>
                                </div>

                                {/* Single-column lyrics for active tab */}
                                <div className="space-y-4">
                                    {(lyricsTab === 'de' ? germanSegments : localizedSegments).map((seg, i) => (
                                        <div key={i} className="space-y-1">
                                            {seg.speaker && (
                                                <div className="text-mp-gold uppercase text-xs tracking-widest font-bold opacity-80 mb-1">
                                                    {seg.speaker}
                                                </div>
                                            )}
                                            <SegmentContent
                                                content={seg.content}
                                                className={`font-serif text-lg leading-relaxed ${lyricsTab === 'de' ? 'text-white/90' : 'text-white/70 italic'}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── DESKTOP: Two-column side-by-side lyrics ── */}
                            <div className="hidden md:block space-y-4">
                                {/* Headers */}
                                <div className="grid grid-cols-2 gap-8 mb-4">
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500">{t('german')}</h3>
                                    <h3 className="text-xs uppercase tracking-widest text-gray-500">{translationLabel}</h3>
                                </div>

                                {/* Synchronized rows */}
                                {germanSegments.map((gerSeg, i) => {
                                    const locSeg = localizedSegments[i] || { speaker: '', content: '' };
                                    return (
                                        <div key={i} className="grid grid-cols-2 gap-8">
                                            {/* German Column */}
                                            <div className="space-y-1">
                                                {gerSeg.speaker && (
                                                    <div className="text-mp-gold uppercase text-xs tracking-widest font-bold opacity-80 mb-1">
                                                        {gerSeg.speaker}
                                                    </div>
                                                )}
                                                <SegmentContent
                                                    content={gerSeg.content}
                                                    className="font-serif text-lg leading-relaxed text-white/90"
                                                />
                                            </div>

                                            {/* Localized Column */}
                                            <div className="space-y-1">
                                                {locSeg.speaker && (
                                                    <div className="text-mp-gold uppercase text-xs tracking-widest font-bold opacity-80 mb-1">
                                                        {locSeg.speaker}
                                                    </div>
                                                )}
                                                <SegmentContent
                                                    content={locSeg.content}
                                                    className="font-serif text-lg leading-relaxed text-white/70 italic"
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Explanation (if any) */}
                            {(details.content?.nl?.explanation) && (
                                <div className="mt-4 pt-4 border-t border-mp-dark/50">
                                    <p className="text-sm text-gray-400 border-l border-gray-600 pl-3 italic">
                                        {details.content.nl.explanation}
                                    </p>
                                </div>
                            )}

                            {/* Modern & Trivia */}
                            <div className="grid grid-cols-1 gap-6 pt-6 border-t border-mp-dark/50">
                                {(localizedContent?.modern || details.content?.modern || details.modern) && (
                                    <div className="bg-mp-dark p-6 rounded-sm border-l-2 border-mp-gold/50">
                                        <h3 className="text-sm font-semibold text-mp-gold mb-2 uppercase tracking-wide">{t('modern')}</h3>
                                        <p className="text-gray-300 leading-relaxed font-light">
                                            {localizedContent?.modern || details.content?.modern || details.modern}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Trivia / Wist je dat? */}
                            <TriviaCard
                                trivia={details?.content?.trivia || localizedContent?.trivia}
                                language={language}
                                t={t}
                            />

                            {/* Chorale Tracker (if applicable) */}
                            <ChoraleTracker meta={details.meta} />

                        </div>
                    ) : (
                        <div className="flex justify-center py-20">
                            <div className="animate-pulse text-mp-gold/50">{t('loading')}</div>
                        </div>
                    )
                ) : (
                    <div className="py-20 text-center opacity-50 italic">
                        {t('select_chapter')}
                    </div>
                )}
            </div>

            {/* Source Overlay Modal */}
            <SourceModal
                isOpen={showSourceModal}
                onClose={() => setShowSourceModal(false)}
                data={details?.content?.original_source}
            />
        </div>
    );
};

export default DetailsPanel;
