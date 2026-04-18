import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { titleToSlug } from '../utils/slugify';
import VideoPlayer from '../components/VideoPlayer';
import DetailsPanel from '../components/DetailsPanel';
import InterpretationPanel from '../components/InterpretationPanel';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const PlayerPage = ({ chapters, currentChapter, setCurrentChapter, videoPlayerRef }) => {
    const { language } = useLanguage();
    const { chapterSlug } = useParams();
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);
    const [videoUrl] = useState("https://www.youtube.com/watch?v=ZwVW1ttVhuQ");
    const [currentTime, setCurrentTime] = useState(0);

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
                .then(response => {
                    setDetails(response.data);
                })
                .catch(error => {
                    console.error("Error loading details:", error);
                    setDetails(null);
                });
        }
    }, [currentChapter]);

    const handleTimeUpdate = useCallback((time) => {
        setCurrentTime(time);

        const current = chapters.find((chapter, index) => {
            const nextChapter = chapters[index + 1];
            return time >= chapter.start && (!nextChapter || time < nextChapter.start);
        });

        if (current && current.id !== currentChapter?.id) {
            setCurrentChapter(current);
        }
    }, [chapters, currentChapter, setCurrentChapter]);

    const handlePrevChapter = () => {
        if (!chapters.length || !currentChapter) return;
        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        if (currentIndex > 0) {
            const prev = chapters[currentIndex - 1];
            navigate(`/play/${titleToSlug(prev.title)}`);
        }
    };

    const handleNextChapter = () => {
        if (!chapters.length || !currentChapter) return;
        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        if (currentIndex < chapters.length - 1) {
            const next = chapters[currentIndex + 1];
            navigate(`/play/${titleToSlug(next.title)}`);
        }
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

            {/* Left Column: Video + Interpretation (desktop) / Video only (mobile) */}
            <div className="w-full md:w-1/2 flex-shrink-0 flex flex-col md:h-full bg-mp-darker">
                <div className="w-full md:max-w-[720px] md:ml-auto flex flex-col flex-1 min-h-0">

                    {/* Video Player */}
                    <div className="w-full aspect-video bg-black shadow-2xl relative z-10 flex-shrink-0">
                        <VideoPlayer
                            url={videoUrl}
                            onTimeUpdate={handleTimeUpdate}
                            ref={videoPlayerRef}
                            className="absolute inset-0 w-full h-full"
                        />
                    </div>

                    {/* Interpretation Panel — desktop only, scrollable below video */}
                    <div className="hidden md:flex flex-1 overflow-y-auto bg-mp-darker relative min-h-0 scrollbar-hidden">
                        <InterpretationPanel details={details} />
                    </div>
                </div>
            </div>

            {/* Right area: Details + mobile collapsible Interpretation */}
            <div className="flex-1 min-h-0 md:w-1/2 flex flex-col md:h-full overflow-hidden">
                <DetailsPanel
                    chapters={chapters}
                    currentChapter={currentChapter}
                    details={details}
                    currentTime={currentTime}
                    onPrevClick={handlePrevChapter}
                    onNextClick={handleNextChapter}
                    onChapterClick={(chapter) => {
                        navigate(`/play/${titleToSlug(chapter.title)}`);
                    }}
                />

                {/* Interpretation — mobile only, collapsible at the bottom */}
                <div className="md:hidden flex-shrink-0">
                    <InterpretationPanel details={details} collapsible={true} />
                </div>
            </div>
        </div>
    );
};

export default PlayerPage;
