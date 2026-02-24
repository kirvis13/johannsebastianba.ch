import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BookOpen, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const FAQ_ITEMS = [
    {
        question: "What is Bach's Matthäus-Passion?",
        answer: "The Matthäus-Passion (St. Matthew Passion, BWV 244) is a large-scale sacred work by Johann Sebastian Bach for double choir, soloists, orchestra, and basso continuo. It sets the Passion narrative from Matthew 26–27, interspersed with reflective arias and chorales. It is one of the largest and most complex choral works of the Baroque era."
    },
    {
        question: "When was the Matthäus-Passion first performed?",
        answer: "The first documented performance took place on Good Friday, April 11, 1727, at St. Thomas Church (Thomaskirche) in Leipzig. Bach revised the work significantly, and the definitive version was performed in 1736. The work was largely forgotten after Bach's death and was famously revived by Felix Mendelssohn in 1829."
    },
    {
        question: "How many movements does the Matthäus-Passion have?",
        answer: "According to the Neue Bach-Ausgabe (NBA), the authoritative critical edition, the Matthäus-Passion consists of 68 movements in two parts. Part I covers events up to the arrest of Jesus; Part II covers the trial, crucifixion, and burial."
    },
    {
        question: "Who wrote the libretto for the Matthäus-Passion?",
        answer: "The libretto was written by Picander, the pseudonym of Christian Friedrich Henrici (1700–1764), a Leipzig poet and postal official who collaborated closely with Bach on several major works. Picander wrote the free poetry — the arias and ariosi — while the biblical narrative (from Matthew 26–27) and the chorale texts were taken from existing sources."
    },
    {
        question: "What is the 'Three Worlds' concept in the Matthäus-Passion?",
        answer: "The Matthäus-Passion operates in three dramatically distinct layers, or 'worlds.' The first is the biblical narrative, told through recitative and turba (crowd) choruses. The second is theological reflection, expressed through arias and ariosi that comment on the unfolding events. The third is the congregational voice, represented by the chorales — simple hymn melodies that anchor the work in Lutheran devotional practice."
    },
    {
        question: "What is the Halo effect in the Matthäus-Passion?",
        answer: "Whenever Jesus sings, Bach surrounds his words with a sustained halo of string chords — a musical nimbus that sets him apart from every other character in the drama. This device disappears completely at the moment of Jesus' cry of abandonment ('Eli, Eli, lama asabthani'), giving that passage extraordinary dramatic weight. It is one of the most striking examples of text-painting in the entire repertoire."
    },
    {
        question: "What is the significance of 'O Haupt voll Blut und Wunden'?",
        answer: "Known as the Passion Chorale, 'O Haupt voll Blut und Wunden' (O Sacred Head Now Wounded) appears five times in the Matthäus-Passion, each time harmonized differently and set to a different stanza of text. The melody — composed by Hans Leo Hassler in 1601 — tracks the emotional arc of the entire work, shifting from devotion and adoration at the start to desolation and grief at the end."
    },
    {
        question: "Who performed in the recording used by this app?",
        answer: "This app is built around the performance by the Nederlandse Bachvereniging (Netherlands Bach Society), conducted by Jos van Veldhoven, recorded as part of the All of Bach project. All of Bach is a long-running initiative to record and freely publish high-quality performances of Bach's complete works, available at allofbach.com."
    }
];

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
        "@type": "FAQPage",
        "mainEntity": FAQ_ITEMS.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    },
    {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://johannsebastianba.ch/" }
        ]
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

    return (
        <section className="w-full max-w-3xl mt-20 z-10" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl font-serif text-mp-gold/80 mb-8 text-center tracking-wide">
                About the Matthäus-Passion
            </h2>
            <dl className="space-y-2">
                {FAQ_ITEMS.map((item, i) => (
                    <div key={i} className="border border-white/10 rounded-lg overflow-hidden">
                        <dt>
                            <button
                                onClick={() => toggle(i)}
                                className="w-full flex items-center justify-between px-5 py-4 text-left text-neutral-200 hover:text-white hover:bg-white/5 transition-colors gap-4"
                                aria-expanded={openIndex === i}
                            >
                                <span className="font-medium text-sm md:text-base">{item.question}</span>
                                {openIndex === i
                                    ? <ChevronUp size={16} className="shrink-0 text-mp-gold/60" />
                                    : <ChevronDown size={16} className="shrink-0 text-mp-gold/60" />
                                }
                            </button>
                        </dt>
                        {openIndex === i && (
                            <dd className="px-5 pb-5 pt-1 text-sm text-neutral-400 leading-relaxed border-t border-white/5">
                                {item.answer}
                            </dd>
                        )}
                    </div>
                ))}
            </dl>
        </section>
    );
};

const HomePageV4 = () => {
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleStart = () => {
        navigate('/play', { state: { autoPlayPart: 'part_01' } });
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
                <header className="space-y-4">
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

                <FAQSection />

            </article>
        </main>
    );
};

export default HomePageV4;
