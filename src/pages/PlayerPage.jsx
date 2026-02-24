import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useOutletContext, useLocation } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import DetailsPanel from '../components/DetailsPanel';
import InterpretationPanel from '../components/InterpretationPanel';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const PlayerPage = ({ chapters, currentChapter, setCurrentChapter, videoPlayerRef }) => {
    const { language } = useLanguage();
    const [details, setDetails] = useState(null);
    const [videoUrl] = useState("https://www.youtube.com/watch?v=ZwVW1ttVhuQ");
    const [currentTime, setCurrentTime] = useState(0);

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

    // Handle auto-play from Story Timeline
    const location = useLocation();
    useEffect(() => {
        if ((location.state?.autoPlayPart || location.state?.autoplay) && chapters.length > 0) {

            if (location.state?.autoPlayPart) {
                const targetChapter = chapters.find(c => c.id === location.state.autoPlayPart);
                if (targetChapter) {
                    setCurrentChapter(targetChapter);
                    setTimeout(() => {
                        if (videoPlayerRef.current) {
                            videoPlayerRef.current.seekTo(targetChapter.start);
                            if (videoPlayerRef.current.internalPlayer) {
                                videoPlayerRef.current.internalPlayer.playVideo();
                            }
                        }
                    }, 500);
                }
            } else if (location.state?.autoplay) {
                if (!currentChapter) {
                    setCurrentChapter(chapters[0]);
                }
                setTimeout(() => {
                    if (videoPlayerRef.current) {
                        if (videoPlayerRef.current.internalPlayer) {
                            videoPlayerRef.current.internalPlayer.playVideo();
                        }
                    }
                }, 500);
            }

            window.history.replaceState({}, document.title);
        }
    }, [location.state, chapters, setCurrentChapter]);

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
            setCurrentChapter(prev);
            if (videoPlayerRef.current) videoPlayerRef.current.seekTo(prev.start);
        }
    };

    const handleNextChapter = () => {
        if (!chapters.length || !currentChapter) return;
        const currentIndex = chapters.findIndex(c => c.id === currentChapter.id);
        if (currentIndex < chapters.length - 1) {
            const next = chapters[currentIndex + 1];
            setCurrentChapter(next);
            if (videoPlayerRef.current) videoPlayerRef.current.seekTo(next.start);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-full">
            <SEO
                title={currentChapter ? `${currentChapter.nba_no}. ${currentChapter.title}` : "Player"}
                description={currentChapter ? `Listen to ${currentChapter.title} - Johann Sebastian Bach.` : "Interactive Player"}
                image={currentChapter ? `/images/story/story_${currentChapter.id.toString().padStart(2, '0')}.webp` : undefined}
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
                        setCurrentChapter(chapter);
                        if (videoPlayerRef.current) {
                            videoPlayerRef.current.seekTo(chapter.start);
                        }
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
