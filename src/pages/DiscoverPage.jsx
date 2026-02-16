import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import MiniPlayer from '../components/MiniPlayer';
import SEO from '../components/SEO';
import { Play, Music, Heart, BookOpen, Users, Info, ChevronDown, Activity, Layers, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatText } from '../utils/textFormatter';

const DiscoverPage = ({ chapters }) => {
    const { t } = useLanguage();
    const content = t('discover_page');
    const navigate = useNavigate();

    // MiniPlayer State
    const [playerState, setPlayerState] = useState({
        isOpen: false,
        start: 0,
        end: 0,
        title: ''
    });

    const handlePlay = (playData, title) => {
        if (!playData) return;

        // If playData has id directly, use it, otherwise check part_id
        const partId = playData.part_id || playData.id;

        // Find chapter for absolute start time if using relative offsets
        // But the data seems to have 'start' relative to the chapter/part anyway.
        // We need to pass the part ID to the player or calculate global time if the player needs that.
        // The MiniPlayer likely takes start/end relative to the track if it plays a specific file,
        // OR it takes global time.
        // Let's assume it works like GuidePage:

        // GuidePage logic:
        // const targetChapter = chapters.find(c => c.id === playData.part_id);
        // setPlayerState({ ... start: targetChapter.start + playData.start ... })

        if (!chapters) {
            console.warn("Chapters not loaded");
            return;
        }

        const targetChapter = chapters.find(c => c.id === partId || c.fileName === partId);

        if (targetChapter) {
            setPlayerState({
                isOpen: true,
                start: targetChapter.start + (playData.start || 0),
                end: targetChapter.start + (playData.end || 30),
                title: title,
                playTrigger: Date.now()
            });
        } else {
            console.warn("Could not find chapter:", partId);
        }
    };

    // Scroll Animation Observer
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
    }, [content]); // Re-run if content changes (lang switch)


    if (!content) return <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-mp-gold">Loading...</div>;

    return (
        <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-mp-gold/30">
            <SEO
                title={t('nav_anatomy') || "Discover"}
                description="Explore the structure, symbolism, and musical forms of the St Matthew Passion."
            />

            {/* HERO SECTION */}
            <header className="relative min-h-[70vh] flex flex-col items-center justify-center px-6 md:px-12 text-center border-b border-neutral-800 bg-gradient-to-b from-mp-gold/5 to-neutral-900">
                <div className="absolute inset-0 bg-[url('/images/texture_noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                <div className="max-w-4xl mx-auto space-y-8 z-10 animate-in fade-in zoom-in duration-1000">
                    <span className="text-mp-gold/60 uppercase tracking-[0.2em] text-sm md:text-base font-medium block mb-2">
                        Johann Sebastian Bach
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-mp-gold leading-tight drop-shadow-2xl">
                        {content.title}
                    </h1>
                    <div className="w-24 h-1 bg-mp-gold/30 mx-auto rounded-full my-8" />
                    <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-2xl mx-auto whitespace-pre-line font-light">
                        {formatText(content.intro)}
                    </p>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce text-mp-gold/30">
                    <ChevronDown size={32} />
                </div>
            </header>

            {/* SECTION 1: THE RITUAL */}
            <section className="py-24 px-6 md:px-12 max-w-5xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
                <div className="flex flex-col md:flex-row gap-12 items-center">
                    <div className="flex-1 space-y-6">
                        <h2 className="text-3xl font-serif text-white flex items-center gap-3">
                            <span className="text-mp-gold text-lg md:text-2xl font-sans opacity-50">01</span>
                            {content.section_ritual.title}
                        </h2>
                        <p className="text-lg text-neutral-400 leading-relaxed font-light">
                            {formatText(content.section_ritual.content)}
                        </p>
                    </div>
                    <div className="flex-1 w-full flex justify-center">
                        <div className="relative w-full max-w-md aspect-square rounded-full border border-neutral-800 flex items-center justify-center bg-neutral-900 shadow-2xl overflow-hidden group">
                            <img
                                src="/images/thomaskirche.webp"
                                alt="St. Thomas Church Leipzig"
                                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 scale-105 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                            <div className="relative z-10 text-center p-8">
                                <p className="text-sm uppercase tracking-widest text-white/90 font-medium drop-shadow-md">
                                    1727 Leipzig<br />St. Thomas Church
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 2: THE SOUNDSCAPE (LAYERS) */}
            <section className="py-24 bg-neutral-800/20 border-y border-white/5">
                <div className="px-6 md:px-12 max-w-6xl mx-auto">
                    <div className="text-center mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <h2 className="text-3xl font-serif text-white mb-4">
                            {content.section_layers.title}
                        </h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            {formatText(content.section_layers.intro)}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {content.section_layers.layers.map((layer, idx) => {
                            const Icon = layer.icon === 'heartbeat' ? Activity : layer.icon === 'stereo' ? Radio : Layers;
                            return (
                                <div key={idx} className="bg-neutral-900/60 p-8 rounded-xl border border-white/5 hover:border-mp-gold/30 transition-all duration-300 group animate-on-scroll opacity-0 translate-y-10" style={{ transitionDelay: `${idx * 150}ms` }}>
                                    <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-mp-gold group-hover:scale-110 transition-transform duration-300">
                                        <Icon size={24} />
                                    </div>
                                    <h3 className="text-xl font-serif text-white mb-3">{layer.title}</h3>
                                    <p className="text-neutral-400 leading-relaxed text-sm">
                                        {formatText(layer.text)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* SECTION 3: THE FORMS */}
            <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
                <div className="mb-16 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                    <h2 className="text-3xl font-serif text-white mb-4 flex items-center gap-3">
                        <span className="text-mp-gold text-lg md:text-2xl font-sans opacity-50">03</span>
                        {content.section_forms.title}
                    </h2>
                    <p className="text-neutral-400 max-w-2xl">
                        {formatText(content.section_forms.intro)}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {content.section_forms.items.map((item, idx) => (
                        <div key={idx} className="bg-neutral-800/40 p-6 rounded-xl border border-neutral-700/50 hover:border-mp-gold/40 hover:bg-neutral-800/80 transition-all duration-300 flex flex-col animate-on-scroll opacity-0 translate-y-10" style={{ transitionDelay: `${idx * 100}ms` }}>
                            <div className="mb-4">
                                <span className="text-xs uppercase tracking-wider text-mp-gold/70 block mb-1">{item.subtitle}</span>
                                <h3 className="text-lg font-serif text-white">{item.title}</h3>
                            </div>
                            <p className="text-sm text-neutral-400 leading-relaxed mb-6 flex-grow">
                                {formatText(item.text)}
                            </p>
                            <button
                                onClick={() => handlePlay({ part_id: item.play_id, start: item.play_start, end: item.play_end }, item.title)}
                                className="mt-auto w-full py-3 bg-mp-gold/10 hover:bg-mp-gold/20 text-mp-gold rounded-lg flex items-center justify-center gap-2 transition-colors border border-mp-gold/10 hover:border-mp-gold/30"
                            >
                                <Play size={16} fill="currentColor" />
                                <span>Listen</span>
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* SECTION 4: HIDDEN CODES (HALO & O HAUPT) */}
            <section className="py-24 bg-gradient-to-b from-neutral-900 to-neutral-950 px-6 md:px-12">
                <div className="max-w-7xl mx-auto space-y-24">

                    {/* Intro */}
                    <div className="text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <span className="text-mp-gold text-sm font-sans uppercase tracking-widest opacity-50 block mb-2">04</span>
                        <h2 className="text-3xl font-serif text-white mb-4">
                            {content.section_secrets.title}
                        </h2>
                        <p className="text-neutral-400 max-w-2xl mx-auto">
                            {formatText(content.section_secrets.intro)}
                        </p>
                    </div>

                    {/* The Halo */}
                    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center shadow-2xl animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <div className="flex-1 space-y-6">
                            <h3 className="text-2xl font-serif text-white flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-mp-gold shadow-[0_0_10px_gold]" />
                                {content.section_secrets.halo.title}
                            </h3>
                            <p className="text-neutral-300 leading-relaxed font-light">
                                {formatText(content.section_secrets.halo.text)}
                            </p>
                        </div>
                        <div className="flex-1 flex flex-col gap-4 w-full max-w-sm">
                            <button
                                onClick={() => handlePlay(content.section_secrets.halo.play_halo, "Halo Effect")}
                                className="w-full p-4 bg-mp-gold/10 hover:bg-mp-gold/20 border border-mp-gold/30 rounded-lg flex items-center justify-between group transition-all"
                            >
                                <span className="text-mp-gold font-serif">{content.section_secrets.halo.play_halo.text}</span>
                                <Play size={20} className="text-mp-gold fill-current group-hover:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={() => handlePlay(content.section_secrets.halo.play_human, "Human Effect")}
                                className="w-full p-4 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg flex items-center justify-between group transition-all"
                            >
                                <span className="text-neutral-400 font-serif group-hover:text-white transition-colors">{content.section_secrets.halo.play_human.text}</span>
                                <Play size={20} className="text-neutral-500 group-hover:text-white fill-current transition-colors" />
                            </button>
                        </div>
                    </div>

                    {/* O Haupt Carousel */}
                    <div className="space-y-12 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                        <div className="text-center max-w-3xl mx-auto">
                            <h3 className="text-2xl font-serif text-white mb-4">{content.section_secrets.ohaupt.title}</h3>
                            <p className="text-neutral-400">
                                {formatText(content.section_secrets.ohaupt.text)}
                            </p>
                        </div>

                        {/* Horizontal Scroll Container */}
                        <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
                            {content.section_secrets.ohaupt.variations.map((item, i) => {
                                const isPlaying = playerState.isOpen && playerState.title === item.title;
                                return (
                                    <div key={i} className={`min-w-[280px] md:min-w-[320px] snap-center bg-neutral-800/50 p-6 rounded-xl border transition-all duration-300 flex flex-col ${isPlaying ? 'border-mp-gold bg-neutral-800 shadow-[0_0_20px_rgba(212,175,55,0.1)]' : 'border-neutral-700/50 hover:border-neutral-600'}`}>
                                        <div className="mb-4">
                                            <span className="text-xs font-mono text-neutral-500 block mb-1">VAR {i + 1}</span>
                                            <h4 className="text-lg font-serif text-white">{item.title}</h4>
                                        </div>

                                        <div className="flex-1 space-y-4 mb-6">
                                            <div>
                                                <span className="text-[10px] uppercase text-neutral-500 tracking-wider">Context</span>
                                                <p className="text-sm text-neutral-300">{item.context}</p>
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase text-neutral-500 tracking-wider">Music</span>
                                                <p className="text-sm text-neutral-400 italic">"{item.music}"</p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handlePlay(item.play_data, item.title)}
                                            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${isPlaying ? 'bg-mp-gold text-black font-bold' : 'bg-neutral-700 hover:bg-neutral-600 text-white'}`}
                                        >
                                            <Play size={16} fill="currentColor" />
                                            {isPlaying ? 'Playing...' : 'Listen'}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* CONCLUSION */}
            <section className="py-24 px-6 text-center animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
                <div className="max-w-3xl mx-auto space-y-8 bg-neutral-900/80 p-12 rounded-2xl border border-mp-gold/20">
                    <h2 className="text-3xl lg:text-4xl font-serif text-mp-gold">
                        {content.conclusion.title}
                    </h2>
                    <p className="text-lg text-neutral-300 leading-relaxed font-light">
                        {formatText(content.conclusion.text)}
                    </p>
                    <button
                        onClick={() => navigate('/play')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-mp-gold hover:bg-white hover:text-black hover:scale-105 text-neutral-900 rounded-full font-bold uppercase tracking-wider transition-all duration-300 shadow-xl shadow-mp-gold/20"
                    >
                        <Play fill="currentColor" />
                        Start Journey
                    </button>
                </div>
            </section>

            <MiniPlayer
                isOpen={playerState.isOpen}
                onClose={() => setPlayerState(prev => ({ ...prev, isOpen: false }))}
                start={playerState.start}
                end={playerState.end}
                title={playerState.title}
                playTrigger={playerState.playTrigger}
            />

        </div>
    );
};

export default DiscoverPage;
