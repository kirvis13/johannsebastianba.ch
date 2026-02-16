import React, { useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';
import { Play, ChevronDown, ArrowLeft, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatText } from '../utils/textFormatter';

const StoryTimelineV2 = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const chapters = t('story_page.chapters');

    // Helper to handle scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                    }
                });
            },
            { threshold: 0.1 }
        );

        document.querySelectorAll('.animate-on-scroll').forEach((el) => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, [chapters]);

    const handleListenClick = (partId) => {
        navigate('/play', { state: { autoPlayPart: partId } });
    };

    return (
        <div className="w-full min-h-screen bg-neutral-950 text-neutral-200 font-sans relative">
            <SEO
                title={t('nav_story') || "The Story"}
                description="Follow the timeline of the Passion through the Gospel of Matthew."
                image="/images/story/story_01.webp"
            />
            {/* Hero Section */}
            <header className="relative py-20 px-6 md:px-12 text-center border-b border-neutral-800 bg-gradient-to-b from-mp-gold/10 to-neutral-900">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-5xl font-serif text-mp-gold/90 leading-tight">
                        {t('story_page.title')}
                    </h1>
                    <p className="text-lg text-neutral-400 leading-relaxed whitespace-pre-line">
                        {formatText(t('story_page.intro'))}
                    </p>
                    <ChevronDown className="w-8 h-8 text-mp-gold/50 mx-auto animate-bounce pt-4" />
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 relative">
                {/* Vertical Golden Line */}
                <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-mp-gold/30 md:-translate-x-1/2 z-0" />

                <div className="space-y-48"> {/* Increased spacing for scrolling effect */}
                    {/* Part 1 Divider */}
                    <div className="relative flex flex-col items-center py-12">
                        <div className="bg-neutral-900 z-10 px-6 py-3 border border-mp-gold/30 rounded-full text-mp-gold font-serif text-xl tracking-widest uppercase text-center shadow-lg shadow-black/50 mb-4">
                            {t('story_page.part1_title')}
                        </div>
                        <div className="text-neutral-400 font-sans tracking-widest text-xs uppercase z-10 bg-neutral-900/80 px-4 py-1 rounded-full">
                            {t('story_page.part1_subtitle')}
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto text-center text-neutral-400 italic mb-12 relative z-10 bg-neutral-900/80 backdrop-blur-sm p-4 rounded-xl">
                        {formatText(t('story_page.part1_intro'))}
                    </div>

                    {/* Chapters Part 1 */}
                    {chapters.filter(c => c.part === 1).map((chapter, index) => (
                        <TimelineItemV2
                            key={chapter.id}
                            chapter={chapter}
                            index={index}
                            isLeft={index % 2 === 0}
                            onListen={() => handleListenClick(chapter.listen_link)}
                            buttonText={t('story_page.listen_button')}
                        />
                    ))}

                    {/* Part 2 Divider */}
                    <div className="relative flex flex-col items-center py-12 pt-32">
                        <div className="bg-neutral-900 z-10 px-6 py-3 border border-mp-gold/30 rounded-full text-mp-gold font-serif text-xl tracking-widest uppercase text-center shadow-lg shadow-black/50 mb-4">
                            {t('story_page.part2_title')}
                        </div>
                        <div className="text-neutral-400 font-sans tracking-widest text-xs uppercase z-10 bg-neutral-900/80 px-4 py-1 rounded-full">
                            {t('story_page.part2_subtitle')}
                        </div>
                    </div>

                    <div className="max-w-2xl mx-auto text-center text-neutral-400 italic mb-12 relative z-10 bg-neutral-900/80 backdrop-blur-sm p-4 rounded-xl">
                        {formatText(t('story_page.part2_intro'))}
                    </div>

                    {/* Chapters Part 2 */}
                    {chapters.filter(c => c.part === 2).map((chapter, index) => (
                        <TimelineItemV2
                            key={chapter.id}
                            chapter={chapter}
                            index={index + 4}
                            isLeft={(index + 4) % 2 === 0}
                            onListen={() => handleListenClick(chapter.listen_link)}
                            buttonText={t('story_page.listen_button')}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const TimelineItemV2 = ({ chapter, index, isLeft, onListen, buttonText }) => {
    const itemRef = useRef(null);
    const [isVisible, setIsVisible] = React.useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                // High threshold to ensure text is well within view
                setIsVisible(entry.isIntersecting);
            },
            {
                threshold: 0.5, // Trigger when 50% of the item is visible
                rootMargin: "-10% 0px -10% 0px" // Shrink the viewport check area
            }
        );

        if (itemRef.current) {
            observer.observe(itemRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={itemRef}
            className={`relative flex flex-col md:flex-row items-center ${isLeft ? 'md:flex-row-reverse' : ''} gap-12 md:gap-24 group min-h-[50vh]`}
        >

            {/* 1. IMAGE CONTAINER (Opposite side) */}
            <div className={`flex-1 w-full relative h-[500px] md:h-[700px] perspective-1000 transition-all duration-1000 ease-in-out ${isVisible ? 'opacity-100 translate-x-0 blur-0' : 'opacity-0 blur-xl ' + (isLeft ? '-translate-x-20' : 'translate-x-20')}`}>
                {/* Image Mask / Container */}
                <div
                    className={`relative w-full h-full`}
                    style={{
                        maskImage: 'radial-gradient(ellipse closest-side, black 40%, transparent 100%)',
                        WebkitMaskImage: 'radial-gradient(ellipse closest-side, black 40%, transparent 100%)'
                    }}
                >
                    <img
                        src={`/images/story/story_${chapter.id.toString().padStart(2, '0')}.webp`}
                        alt={chapter.title}
                        className="w-full h-full object-cover opacity-80 mix-blend-normal transform scale-110"
                        onError={(e) => e.target.style.display = 'none'}
                    />
                </div>
            </div>

            {/* Timeline Node (Center) */}
            <div className="absolute left-[-5px] md:left-1/2 md:-translate-x-1/2 w-4 h-4 bg-neutral-900 border-2 border-mp-gold rounded-full z-10 flex items-center justify-center shadow-[0_0_15px_rgba(212,175,55,0.5)]">
                <div className={`w-1.5 h-1.5 bg-mp-gold rounded-full transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`} />
            </div>

            {/* 2. TEXT CONTENT (Original Side) */}
            <div className={`flex-1 pl-8 md:pl-0 z-20 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                <div className="relative">
                    <span className={`text-mp-gold/10 font-serif text-[8rem] leading-none absolute -top-20 -z-10 select-none ${isLeft ? '-right-10' : '-left-10'}`}>
                        {chapter.id}
                    </span>

                    {/* Time Context Eyebrow */}
                    {chapter.time_context && (
                        <div className="flex items-center gap-2 text-mp-gold/80 font-serif italic text-sm mb-2">
                            <span>✦</span>
                            {chapter.time_context}
                        </div>
                    )}

                    <h3 className="text-3xl font-bold text-mp-gold mb-6 font-serif tracking-wide drop-shadow-lg">
                        {chapter.title}
                    </h3>
                    <p className="text-lg text-neutral-300 leading-relaxed mb-8 font-light tracking-wide">
                        {formatText(chapter.text)}
                    </p>

                    <button
                        onClick={onListen}
                        className={`inline-flex items-center gap-3 px-6 py-3 border border-mp-gold/30 rounded-full bg-mp-gold/10 hover:bg-mp-gold/30 text-mp-gold hover:text-mp-gold text-sm font-medium transition-all hover:scale-105 active:scale-95 group/btn ${isLeft ? 'flex-row-reverse' : ''}`}
                    >
                        <Play className="w-4 h-4 fill-current group-hover/btn:scale-110 transition-transform" />
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StoryTimelineV2;
