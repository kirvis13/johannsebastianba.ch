import React, { useState, useEffect, useRef, useMemo } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Mic2, Menu, X, ArrowLeft, Lightbulb } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const ConcertPage = ({ chapters, currentChapter, setCurrentChapter }) => {
    const { t, language, toggleLanguage } = useLanguage();
    const [details, setDetails] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('de'); // 'de' or 'nl' (or 'en')
    const scrollRef = useRef(null);

    // Cache for loaded details to enable instant navigation
    const detailsCache = useRef({});

    // --- Wake Lock ---
    useEffect(() => {
        let wakeLock = null;

        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator) {
                    wakeLock = await navigator.wakeLock.request('screen');
                }
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        };

        requestWakeLock();

        const handleVisibilityChange = () => {
            if (wakeLock !== null && document.visibilityState === 'visible') {
                requestWakeLock();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            if (wakeLock !== null) {
                wakeLock.release().then(() => {
                });
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // --- Data Loading & Caching ---
    const fetchChapterDetails = async (chapterId) => {
        if (detailsCache.current[chapterId]) {
            return detailsCache.current[chapterId];
        }
        try {
            const response = await axios.get(`/data/details/${chapterId}.json`);
            detailsCache.current[chapterId] = response.data;
            return response.data;
        } catch (error) {
            console.error(`Error loading details for ${chapterId}:`, error);
            return null;
        }
    };

    useEffect(() => {
        if (currentChapter) {
            // 1. Load current chapter
            if (detailsCache.current[currentChapter.id]) {
                setDetails(detailsCache.current[currentChapter.id]);
                if (scrollRef.current) scrollRef.current.scrollTop = 0;
            } else {
                setDetails(null); // Only clear if we don't have it cached
                fetchChapterDetails(currentChapter.id).then(data => {
                    if (data && currentChapter.id === data.id) { // Ensure race condition safety
                        setDetails(data);
                        if (scrollRef.current) scrollRef.current.scrollTop = 0;
                    }
                });
            }

            // 2. Pre-fetch neighbors (Next and Previous)
            const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
            if (currentIndex !== -1) {
                const nextChapter = chapters[currentIndex + 1];
                const prevChapter = chapters[currentIndex - 1];

                if (nextChapter && !detailsCache.current[nextChapter.id]) {
                    fetchChapterDetails(nextChapter.id);
                }
                if (prevChapter && !detailsCache.current[prevChapter.id]) {
                    fetchChapterDetails(prevChapter.id);
                }
            }

        } else if (chapters.length > 0 && !currentChapter) {
            // Initialize with first chapter if none selected
            setCurrentChapter(chapters[0]);
        }
    }, [currentChapter, chapters, setCurrentChapter]);

    // --- Navigation ---
    const handlePrev = () => {
        if (!chapters.length || !currentChapter) return;
        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        if (currentIndex > 0) {
            setCurrentChapter(chapters[currentIndex - 1]);
        }
    };

    const handleNext = () => {
        if (!chapters.length || !currentChapter) return;
        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        if (currentIndex < chapters.length - 1) {
            setCurrentChapter(chapters[currentIndex + 1]);
        }
    };

    // --- Parsing Logic (Reused/Simplified from DetailsPanel) ---
    const parseLyrics = (text) => {
        if (!text) return [];
        const lines = text.split('\n');
        const segments = [];
        let currentSegment = null;

        lines.forEach(line => {
            const match = line.match(/^([A-Za-zäöüÄÖÜß\s&]+):(.*)/) || line.match(/^(\*\*.*?\*\*):?(.*)/);
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
        if (segments.length === 0 && text) return [{ speaker: '', content: text }];
        return segments;
    };

    const germanContent = details?.content?.de;
    const localizedContent = details?.content?.[language] || details?.content?.nl;

    // Trivia Logic: Only show if current language has trivia
    const triviaData = localizedContent?.trivia;



    // MEMOIZATION OPTIMIZATION:
    const combinedSegments = useMemo(() => {
        const germanSegments = parseLyrics(germanContent?.lyrics || details?.german);
        const localizedSegments = parseLyrics(localizedContent?.lyrics || details?.content?.nl?.lyrics || details?.dutch);

        return germanSegments.map((gerSeg, index) => {
            const locSeg = localizedSegments[index] || {};
            return { gerSeg, locSeg };
        });
    }, [germanContent, localizedContent, details]);

    // --- Render Helpers ---
    const renderTextColumn = (segments, isGerman) => (
        <div className="space-y-6">
            {segments.map((seg, i) => {
                const { gerSeg, locSeg } = seg;
                const activeSeg = isGerman ? gerSeg : locSeg;
                return (
                    <div key={i} className="mb-4">
                        {activeSeg.speaker && (
                            <div className="text-mp-gold uppercase text-xs tracking-widest font-bold opacity-80 mb-1">
                                {activeSeg.speaker}
                            </div>
                        )}
                        <div className={`whitespace-pre-line text-lg leading-relaxed ${isGerman ? 'text-gray-200' : 'text-white/70 italic font-serif'}`}>
                            {activeSeg.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // --- Trivia Component ---
    const TriviaSection = ({ trivia }) => {
        const [isOpen, setIsOpen] = useState(false);

        if (!trivia || trivia.length === 0) return null;

        return (
            <div className="mt-8 mb-4">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 p-4 rounded-lg transition-colors group"
                >
                    <div className="flex items-center space-x-3 text-mp-gold">
                        <div className="p-1.5 bg-mp-gold/10 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-1 1.5-2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" /><path d="M9 18h6" /><path d="M10 22h4" /></svg>
                        </div>
                        <span className="uppercase tracking-widest text-xs font-bold">{t('trivia')}</span>
                    </div>
                    {isOpen ? <ChevronRight className="rotate-90 transition-transform" /> : <ChevronRight className="transition-transform" />}
                </button>

                {isOpen && (
                    <div className="mt-2 bg-black/20 rounded-lg p-4 space-y-4 animate-fadeIn">
                        {trivia.map((item, idx) => (
                            <div key={idx} className="border-l-2 border-mp-gold/30 pl-4 py-1">
                                <div className="text-mp-gold text-[10px] uppercase tracking-wider mb-1 opacity-70">{item.category}</div>
                                <div className="text-xl text-gray-300 leading-relaxed font-serif">{item.fact}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // --- Type Translation ---
    const getTypeTranslation = (type) => {
        const key = type?.toLowerCase();
        if (key?.includes('recitativ')) return t('types.recitative');
        if (key?.includes('choral') && !key?.includes('chorus')) return t('types.chorale');
        if (key?.includes('choral')) return t('types.chorale');
        if (key?.includes('aria')) return t('types.aria');
        return t('types.chorus');
    };

    if (!currentChapter) return <div className="bg-mp-dark h-[100dvh] flex items-center justify-center text-mp-gold">Loading...</div>;

    return (
        <div className="bg-mp-dark h-[100dvh] overflow-hidden flex flex-col text-white font-sans">
            <SEO
                title="Concert Mode - Matthäus-Passion Live Companion"
                description="A distraction-free companion for live performances with synchronized text and translations."
                schema={[
                    {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://johannsebastianba.ch/" },
                            { "@type": "ListItem", "position": 2, "name": "Concert Mode", "item": "https://johannsebastianba.ch/concert" }
                        ]
                    }
                ]}
            />

            {/* Header - Fixed - Hidden in Landscape */}
            <div className="h-16 flex-none flex items-center justify-between px-4 border-b border-white/10 bg-mp-darker z-30 relative landscape:hidden">
                {/* Left: Home Button */}
                <a href="/" className="p-2 hover:bg-white/10 rounded-full text-mp-gold flex-none">
                    <ArrowLeft size={24} />
                </a>

                {/* Center: Title */}
                <div className="flex flex-col overflow-hidden text-center mx-2">
                    <span className="text-mp-gold text-xs uppercase tracking-widest truncate">
                        {currentChapter.nba_no}. {getTypeTranslation(currentChapter.type)}
                    </span>
                    <span className="font-serif text-lg truncate max-w-[160px] md:max-w-md block">{currentChapter.title}</span>
                </div>

                {/* Right: Language & Menu */}
                <div className="flex items-center space-x-1 flex-none">
                    <button
                        onClick={toggleLanguage}
                        className="p-2 hover:bg-white/10 rounded-full text-xs font-bold tracking-wider text-mp-gold border border-mp-gold/30 h-8 w-8 flex items-center justify-center"
                    >
                        {language.toUpperCase()}
                    </button>
                    <button onClick={() => setIsMenuOpen(true)} className="p-2 hover:bg-white/10 rounded-full text-mp-gold">
                        <Menu size={24} />
                    </button>
                </div>
            </div>

            {/* Language Tabs - Fixed below header (Portrait Only) */}
            <div className="flex-none bg-mp-dark border-b border-white/10 z-20 landscape:hidden">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('de')}
                        className={`flex-1 py-3 text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === 'de' ? 'text-mp-gold border-b-2 border-mp-gold' : 'text-gray-500'}`}
                    >
                        Deutsch
                    </button>
                    <button
                        onClick={() => setActiveTab('nl')}
                        className={`flex-1 py-3 text-sm uppercase tracking-widest font-bold transition-colors ${activeTab === 'nl' ? 'text-mp-gold border-b-2 border-mp-gold' : 'text-gray-500'}`}
                    >
                        {language === 'en' ? 'ENGLISH' : 'NEDERLANDS'}
                    </button>
                </div>
            </div>

            {/* Main Content - Scrollable */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-6xl mx-auto h-full">
                    {/* Portrait View (Tabs content) */}
                    <div className="landscape:hidden pb-24">
                        {activeTab === 'de' ? (
                            <>
                                {renderTextColumn(combinedSegments, true)}
                                <TriviaSection trivia={triviaData} />
                            </>
                        ) : (
                            <>
                                {renderTextColumn(combinedSegments, false)}
                                <TriviaSection trivia={triviaData} />
                            </>
                        )}
                    </div>

                    {/* Landscape View (Side-by-Side) */}
                    <div className="hidden landscape:grid grid-cols-2 gap-8 h-full pb-24 pt-4 relative">
                        {/* Hidden Home Button for Landscape (Absolute Top Left) */}
                        <a href="/" className="absolute top-0 left-0 p-2 hover:bg-white/10 rounded-full text-mp-gold z-20 opacity-50 hover:opacity-100">
                            <ArrowLeft size={20} />
                        </a>

                        <div>
                            <h3 className="text-mp-gold text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-2 sticky top-0 bg-mp-dark z-10 pl-8">Original</h3>
                            {renderTextColumn(combinedSegments, true)}
                        </div>
                        <div>
                            <h3 className="text-mp-gold text-xs uppercase tracking-widest mb-4 border-b border-white/10 pb-2 sticky top-0 bg-mp-dark z-10">Translation</h3>
                            {renderTextColumn(combinedSegments, false)}
                            <TriviaSection trivia={triviaData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation - Fixed */}
            <div className="min-h-20 flex-none bg-mp-darker border-t border-white/10 flex items-center justify-between px-4 z-30 py-4">
                <button
                    onClick={handlePrev}
                    disabled={chapters.findIndex(c => c.id === currentChapter.id) === 0}
                    className="flex items-center justify-center space-x-2 text-gray-400 hover:bg-white/5 disabled:opacity-30 transition-colors py-3 px-6 min-w-[100px] rounded-lg"
                >
                    <ChevronLeft size={24} />
                    <span className="uppercase tracking-widest text-sm font-bold">{t('previous')}</span>
                </button>

                <div className="text-gray-500 text-xs uppercase tracking-widest hidden md:block">
                    {chapters.findIndex(c => c.id === currentChapter.id) + 1} / {chapters.length}
                </div>

                <button
                    onClick={handleNext}
                    disabled={chapters.findIndex(c => c.id === currentChapter.id) === chapters.length - 1}
                    className="flex items-center justify-center space-x-2 text-mp-gold hover:bg-mp-gold/10 disabled:opacity-30 transition-colors py-3 px-6 min-w-[100px] rounded-lg"
                >
                    <span className="uppercase tracking-widest text-sm font-bold">{t('next')}</span>
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Chapter List Modal */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
                    <div className="w-full md:w-96 bg-mp-darker h-full shadow-2xl flex flex-col border-l border-white/10 animate-slideInRight">
                        <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                            <h2 className="text-mp-gold font-serif text-lg">Hoofdstukken</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="text-gray-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {chapters.map((chapter, index) => {
                                // Part 2 detection (NBA 30 starts art 2)
                                return (
                                    <React.Fragment key={chapter.id}>
                                        {chapter.nba_no === "30" && (
                                            <div className="py-4 text-center text-mp-gold border-t border-b border-white/10 my-4 uppercase tracking-widest text-sm font-bold bg-white/5">
                                                Deel 2
                                            </div>
                                        )}

                                        <button
                                            onClick={() => {
                                                setCurrentChapter(chapter);
                                                setIsMenuOpen(false);
                                            }}
                                            className={`w-full text-left p-3 rounded-lg flex items-start space-x-3 transition-colors ${currentChapter.id === chapter.id ? 'bg-mp-gold/20 text-mp-gold border border-mp-gold/30' : 'hover:bg-white/5 text-gray-300'}`}
                                        >
                                            <span className="text-xs font-mono opacity-50 mt-1 min-w-[24px]">{chapter.nba_no}</span>
                                            <div className="flex-1">
                                                <div className="font-serif text-sm">{chapter.title}</div>
                                                <div className="text-xs uppercase tracking-widest opacity-50 mt-1">{getTypeTranslation(chapter.type)}</div>
                                            </div>
                                        </button>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConcertPage;
