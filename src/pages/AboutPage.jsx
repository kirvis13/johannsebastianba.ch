import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import SEO from '../components/SEO';

const AboutPage = () => {
    const { t } = useLanguage();

    return (
        <div className="h-full w-full flex items-center justify-center bg-mp-darker text-white p-8 overflow-y-auto">
            <SEO
                title="About Johann Sebastian Bach and the Matthäus-Passion BWV 244"
                description="Learn about the composer, the history of the St. Matthew Passion, and its significance in Western music history."
                schema={[
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
            <div className="max-w-3xl space-y-8 animate-fadeIn text-center md:text-left">
                <h1 className="text-4xl md:text-5xl font-serif text-mp-gold tracking-wide mb-8">
                    {t('about_title')}
                </h1>

                <div className="prose prose-invert prose-lg">
                    <p className="font-light text-xl leading-relaxed text-gray-300">
                        {t('about_content')}
                    </p>
                </div>

                <div className="pt-12 border-t border-white/10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm text-gray-400 uppercase tracking-widest">
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
            </div>
        </div>
    );
};

export default AboutPage;
