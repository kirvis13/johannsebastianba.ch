import React from 'react';
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

const AboutPage = () => {
    const { t } = useLanguage();

    return (
        <div className="h-full w-full bg-mp-darker text-white overflow-y-auto">
            <SEO
                title="About Johann Sebastian Bach and the Matthäus-Passion BWV 244"
                description="Learn about the composer, the history of the St. Matthew Passion, and its significance in Western music history."
                schema={[
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
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://johannsebastianba.ch/" },
                            { "@type": "ListItem", "position": 2, "name": "About", "item": "https://johannsebastianba.ch/about" }
                        ]
                    }
                ]}
            />
            <div className="max-w-3xl mx-auto px-8 py-12 space-y-8 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-serif text-mp-gold tracking-wide">
                    {t('about_title')}
                </h1>

                <div className="prose prose-invert prose-lg">
                    <p className="font-light text-xl leading-relaxed text-gray-300">
                        {t('about_content')}
                    </p>
                </div>

                <div className="pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm text-gray-400 uppercase tracking-widest">
                    <div>
                        <div className="text-mp-gold font-bold mb-2">Composed</div>
                        <div>1727</div>
                    </div>
                    <div>
                        <div className="text-mp-gold font-bold mb-2">Composer</div>
                        <div>Johann Sebastian Bach</div>
                    </div>
                    <div>
                        <div className="text-mp-gold font-bold mb-2">Librettist</div>
                        <div>Picander</div>
                    </div>
                </div>

                <section className="pt-8 border-t border-white/10 space-y-8" aria-labelledby="faq-heading">
                    <h2 id="faq-heading" className="text-2xl font-serif text-mp-gold/80 tracking-wide">
                        Frequently Asked Questions
                    </h2>
                    <div className="space-y-2">
                        {FAQ_ITEMS.map((item, i) => (
                            <details key={i} className="group border border-white/10 rounded-lg">
                                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-white font-medium list-none hover:bg-white/5 transition-colors">
                                    {item.question}
                                    <span className="text-mp-gold/60 ml-4 shrink-0 transition-transform group-open:rotate-180">▾</span>
                                </summary>
                                <p className="px-5 pb-5 pt-1 text-gray-400 leading-relaxed border-t border-white/5">
                                    {item.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutPage;
