import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Info } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const homeSchemas = [
    {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        "name": "Matthäus-Passion Unraveled",
        "url": "https://johannsebastianba.ch",
        "description": "Interactive companion app for Bach's St. Matthew Passion BWV 244 with synchronized video, text, and musical analysis.",
        "applicationCategory": "MusicApplication",
        "operatingSystem": "Web",
        "inLanguage": ["de", "nl", "en"],
        "about": {
            "@type": "MusicComposition",
            "name": "Matthäus-Passion",
            "alternateName": ["St. Matthew Passion", "Mattheuspassie", "BWV 244"],
            "composer": {
                "@type": "Person",
                "name": "Johann Sebastian Bach",
                "birthDate": "1685-03-31",
                "deathDate": "1750-07-28"
            },
            "lyricist": {
                "@type": "Person",
                "name": "Picander",
                "alternateName": "Christian Friedrich Henrici"
            },
            "dateCreated": "1727",
            "genre": ["Passion", "Sacred oratorio", "Baroque music"]
        }
    },
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://johannsebastianba.ch/" }
        ]
    }
];

const HomePageV4 = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/play/kommt-ihr-toechter');
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-neutral-200 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">

            <SEO
                title="Bach's Matthäus-Passion (St. Matthew Passion) - Interactive Guide"
                description="Explore Bach's St. Matthew Passion BWV 244 with synchronized video, German text, Dutch and English translations, and musicological analysis."
                schema={homeSchemas}
            />

            {/* Background Video */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-40 grayscale-[20%]"
                >
                    <source src="/videos/hero.mp4" type="video/mp4" />
                </video>
                {/* Texture overlay for consistent graininess */}
                <div className="absolute inset-0 opacity-20 bg-[url('/images/texture_noise.png')] mix-blend-overlay" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/0 via-neutral-900/50 to-neutral-950 pointer-events-none" />

            {/* Main Content */}
            <article className="z-10 max-w-5xl w-full flex flex-col items-center text-center space-y-8 animate-in fade-in duration-1000 -mt-12">

                {/* Header */}
                <header className="space-y-4 lg:min-h-[14rem]">
                    <span className="text-mp-gold/60 uppercase tracking-[0.3em] text-xs md:text-sm font-medium">
                        Johann Sebastian Bach
                    </span>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-mp-gold tracking-tight drop-shadow-2xl flex flex-col md:block items-center justify-center gap-2">
                        <span>{t('title').split(' ')[0]}</span>
                        <span className="md:ml-4">{t('title').split(' ').slice(1).join(' ')}</span>
                    </h1>
                    <p className="block text-xl md:text-3xl text-neutral-500 mt-2 font-light italic tracking-widest font-sans opacity-80">
                        {t('subtitle')}
                    </p>
                </header>

                {/* Primary Action */}
                <div className="py-4">
                    <button
                        onClick={handleStart}
                        className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-mp-gold text-neutral-950 rounded-sm overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]"
                        aria-label={t('start') || "Start Listening"}
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                        <Play size={20} fill="currentColor" className="relative z-10" />
                        <span className="text-base md:text-lg font-bold uppercase tracking-widest relative z-10">
                            {t('start') || "Start Listening"}
                        </span>
                    </button>
                </div>

                {/* Secondary Options */}
                <nav className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl border-t border-white/5 pt-10 -mt-2">

                    <button
                        onClick={() => navigate('/discover')}
                        className="group p-6 rounded-xl hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/10"
                    >
                        <div className="mb-4 text-mp-gold opacity-70 group-hover:opacity-100 transition-opacity">
                            <BookOpen size={24} />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-2 group-hover:text-mp-gold transition-colors">
                            {t('nav_anatomy') || "Discover"}
                        </h3>
                        <p className="text-sm text-neutral-500 group-hover:text-neutral-400 leading-relaxed">
                            {t('discover_cta') || "Explore the forms, layers, and hidden codes."}
                        </p>
                    </button>

                    <button
                        onClick={() => navigate('/story')}
                        className="group p-6 rounded-xl hover:bg-white/5 transition-all text-left border border-transparent hover:border-white/10"
                    >
                        <div className="mb-4 text-mp-gold opacity-70 group-hover:opacity-100 transition-opacity">
                            <Info size={24} />
                        </div>
                        <h3 className="text-lg font-serif text-white mb-2 group-hover:text-mp-gold transition-colors">
                            {t('nav_story') || "The Story"}
                        </h3>
                        <p className="text-sm text-neutral-500 group-hover:text-neutral-400 leading-relaxed">
                            {t('story_cta') || "Follow the timeline of the Passion."}
                        </p>
                    </button>

                </nav>

            </article>
        </main>
    );
};

export default HomePageV4;
