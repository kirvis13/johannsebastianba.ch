import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Search } from 'lucide-react';
import { titleToSlug } from '../utils/slugify';
import VideoPlayer from '../components/VideoPlayer';
import DetailsPanel from '../components/DetailsPanel';
import InterpretationPanel from '../components/InterpretationPanel';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const getTypeColor = (type) => {
    const key = type?.toLowerCase() || '';
    if (key.includes('recitativ')) return 'border-l-mp-red text-mp-red/80';
    if (key.includes('choral')) return 'border-l-mp-green text-mp-green/80';
    if (key.includes('aria')) return 'border-l-mp-blue text-mp-blue/80';
    return 'border-l-mp-gold text-mp-gold/80';
};

const PlayerPage = ({ chapters, currentChapter, setCurrentChapter, videoPlayerRef }) => {
    const { language, t } = useLanguage();
    const { chapterSlug } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [videoUrl] = useState("https://www.youtube.com/watch?v=ZwVW1ttVhuQ");
    const [currentTime, setCurrentTime] = useState(0);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredChapters = searchQuery.trim()
        ? chapters.filter(c =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.nba_no && c.nba_no.includes(searchQuery))
          )
        : chapters;

    // Sync URL slug → active chapter
    useEffect(() => {
        if (chapterSlug && chapters.length > 0) {
            const target = chapters.find(c => titleToSlug(c.title) === chapterSlug);
            if (target && target.id !== currentChapter?.id) {
                setCurrentChapter(target);
                if (videoPlayerRef.current) {
                    videoPlayerRef.current.seekTo(target.start);
                }
            }
        }
    }, [chapterSlug, chapters]);

    // Fetch details when chapter changes
    useEffect(() => {
        if (currentChapter) {
            axios.get(`/data/details/${currentChapter.id}.json`)
                .then(response => setDetails(response.data))
                .catch(() => setDetails(null));
        }
    }, [currentChapter]);

    const handleTimeUpdate = useCallback((time) => {
        setCurrentTime(time);
        const current = chapters.find((chapter, index) => {
            const next = chapters[index + 1];
            return time >= chapter.start && (!next || time < next.start);
        });
        if (current && current.id !== currentChapter?.id) {
            setCurrentChapter(current);
        }
    }, [chapters, currentChapter, setCurrentChapter]);

    const handlePrevChapter = () => {
        if (!chapters.length || !currentChapter) return;
        const idx = chapters.findIndex(c => c.id === currentChapter.id);
        if (idx > 0) navigate(`/play/${titleToSlug(chapters[idx - 1].title)}`);
    };

    const handleNextChapter = () => {
        if (!chapters.length || !currentChapter) return;
        const idx = chapters.findIndex(c => c.id === currentChapter.id);
        if (idx < chapters.length - 1) navigate(`/play/${titleToSlug(chapters[idx + 1].title)}`);
    };

    const handleChapterSelect = (chapter) => {
        navigate(`/play/${titleToSlug(chapter.title)}`);
        setIsDrawerOpen(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-full">
            <SEO
                title={currentChapter
                    ? `${currentChapter.nba_no}. ${currentChapter.title}`
                    : "Interactive Player - Matthäus-Passion with Synchronized Libretto"}
                description={currentChapter
                    ? `Listen to ${currentChapter.title} – ${currentChapter.scene_label?.[language] ?? currentChapter.type}. Johann Sebastian Bach's St. Matthew Passion.`
                    : "Watch the Nederlandse Bachvereniging performance with synchronized German text, translations, and real-time musical commentary."}
                image={currentChapter ? `/images/story/story_${currentChapter.id.toString().padStart(2, '0')}.webp` : undefined}
                schema={[
                    {
                        "@context": "https://schema.org",
                        "@type": "VideoObject",
                        "name": "Matthäus-Passion BWV 244 - Nederlandse Bachvereniging",
                        "description": "Complete performance of Bach's St. Matthew Passion by the Nederlandse Bachvereniging, conducted by Jos van Veldhoven. Part of the All of Bach project.",
                        "url": "https://www.youtube.com/watch?v=ZwVW1ttVhuQ",
                        "embedUrl": "https://www.youtube.com/embed/ZwVW1ttVhuQ",
                        "thumbnailUrl": "https://img.youtube.com/vi/ZwVW1ttVhuQ/maxresdefault.jpg",
                        "publisher": {
                            "@type": "Organization",
                            "name": "Nederlandse Bachvereniging",
                            "url": "https://www.bachvereniging.nl"
                        }
                    },
                    {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://johannsebastianba.ch/" },
                            { "@type": "ListItem", "position": 2, "name": currentChapter?.title ?? "Player", "item": `https://johannsebastianba.ch/play/${chapterSlug ?? ''}` }
                        ]
                    }
                ]}
            />

            {/* Left Column: Video + Interpretation */}
            <div className="w-full md:w-1/2 flex-shrink-0 flex flex-col md:h-full bg-mp-darker">
                <div className="w-full md:max-w-[720px] md:ml-auto flex flex-col flex-1 min-h-0">
                    <div className="w-full aspect-video bg-black shadow-2xl relative z-10 flex-shrink-0">
                        <VideoPlayer
                            url={videoUrl}
                            onTimeUpdate={handleTimeUpdate}
                            ref={videoPlayerRef}
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>
                    <div className="hidden md:flex flex-1 overflow-y-auto bg-mp-darker relative min-h-0 scrollbar-hidden">
                        <InterpretationPanel details={details} />
                    </div>
                </div>
            </div>

            {/* Right: Details + mobile Interpretation */}
            <div className="flex-1 min-h-0 md:w-1/2 flex flex-col md:h-full overflow-hidden">
                <DetailsPanel
                    chapters={chapters}
                    currentChapter={currentChapter}
                    details={details}
                    currentTime={currentTime}
                    onPrevClick={handlePrevChapter}
                    onNextClick={handleNextChapter}
                    onChapterClick={(chapter) => navigate(`/play/${titleToSlug(chapter.title)}`)}
                    onOpenChapters={() => setIsDrawerOpen(true)}
                />
            </div>

            {/* === CHAPTERS DRAWER === */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            <div className={`fixed top-0 right-0 h-full w-80 bg-mp-darker border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Drawer header + search */}
                    <div className="p-4 border-b border-white/10 flex-shrink-0">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-mp-gold font-serif text-lg tracking-wide">Chapters</h2>
                            <button onClick={() => setIsDrawerOpen(false)} className="hover:text-white transition-colors p-1">
                                <X size={22} />
                            </button>
                        </div>

                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search chapters…"
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-mp-gold/50 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        {searchQuery.trim() && (
                            <p className="text-xs text-gray-500 mt-2">
                                {filteredChapters.length} result{filteredChapters.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Chapter list */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {filteredChapters.length > 0 ? filteredChapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => handleChapterSelect(chapter)}
                                className={`w-full text-left p-3 rounded hover:bg-white/5 transition-all border-l-4 ${getTypeColor(chapter.type)} ${
                                    currentChapter?.id === chapter.id
                                        ? 'bg-white/10'
                                        : 'border-l-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <div className="text-xs uppercase tracking-wider mb-0.5 font-bold opacity-80">
                                    {chapter.type}
                                </div>
                                <div className="font-serif text-sm text-white leading-snug">{chapter.title}</div>
                                <div className="text-xs text-gray-500 font-mono mt-0.5 opacity-50">No. {chapter.nba_no}</div>
                            </button>
                        )) : (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                No chapters match "{searchQuery}"
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/10 text-xs text-center opacity-40 flex-shrink-0">
                        {t('footer')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
