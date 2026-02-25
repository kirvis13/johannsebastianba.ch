import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Github, Mail, Heart } from 'lucide-react';
import SEO from '../components/SEO';

const AboutProjectPage = () => {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 p-6 md:p-12 overflow-y-auto">
            <SEO
                title="Colophon - About Matthäus-Passion Unraveled"
                description="Credits, sources, and technical information about this interactive companion to Bach's St. Matthew Passion."
                schema={[
                    {
                        "@context": "https://schema.org",
                        "@type": "BreadcrumbList",
                        "itemListElement": [
                            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://johannsebastianba.ch/" },
                            { "@type": "ListItem", "position": 2, "name": "Colophon", "item": "https://johannsebastianba.ch/colophon" }
                        ]
                    }
                ]}
            />
            <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700">

                {/* Header */}
                <div className="space-y-4 border-b border-white/10 pb-8">
                    <h1 className="text-4xl md:text-5xl font-serif text-mp-gold tracking-tight">
                        {t('about_project.title') || "About this Project"}
                    </h1>
                    <p className="text-xl text-neutral-400 font-light leading-relaxed">
                        {t('about_project.subtitle') || "Making Bach's masterpiece accessible to everyone."}
                    </p>
                </div>

                {/* Mission */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">
                        {t('about_project.mission_title') || "The Mission"}
                    </h2>
                    <p className="text-lg text-neutral-400 leading-relaxed">
                        {t('about_project.mission_text') || "The St Matthew Passion is one of the greatest works of art ever created, but its complexity can be overwhelming. This project aims to unravel the layers of the music, text, and structure, creating a modern, interactive guide for both newcomers and connoisseurs."}
                    </p>
                </div>

                {/* Contribute Section */}
                <div className="bg-white/5 rounded-xl p-8 border border-white/10 hover:border-mp-gold/30 transition-colors space-y-6">
                    <div className="flex items-center gap-4 text-mp-gold">
                        <Heart className="w-6 h-6" />
                        <h2 className="text-2xl font-serif text-white">
                            {t('about_project.contribute_title') || "Contribute"}
                        </h2>
                    </div>

                    <p className="text-neutral-400 leading-relaxed">
                        {t('about_project.contribute_text') || "This is an open source project. We welcome contributions to improve translations, add musical insights, or fix bugs. Once the project is live, you can contribute directly via GitHub."}
                    </p>

                    <div className="flex flex-col md:flex-row gap-6 pt-4">
                        <a
                            href="mailto:picander@johannsebastianba.ch"
                            className="flex items-center gap-3 text-white hover:text-mp-gold transition-colors group"
                        >
                            <div className="p-3 bg-white/10 rounded-full group-hover:bg-mp-gold/20 transition-colors">
                                <Mail className="w-5 h-5" />
                            </div>
                            <span className="font-medium">picander@johannsebastianba.ch</span>
                        </a>

                        <a
                            href="https://github.com/kirvis13/johannsebastianba.ch"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-neutral-500 hover:text-white transition-colors cursor-pointer"
                        >
                            <div className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
                                <Github className="w-5 h-5" />
                            </div>
                            <span className="italic underline underline-offset-4 decoration-white/30 hover:decoration-white/100 transition-all">{t('about_project.github_soon')}</span>
                        </a>
                    </div>
                </div>

                {/* Credits */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-serif text-white">
                        {t('about_project.credits_title') || "Credits & Sources"}
                    </h2>
                    <ul className="text-neutral-400 leading-relaxed space-y-2 text-sm">
                        <li>
                            <span className="text-neutral-300">🇫🇷 </span>
                            <a
                                href="https://helenedecislartigau.wordpress.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline underline-offset-4 decoration-white/30 hover:decoration-white/100 hover:text-white transition-all"
                            >
                                {t('about_project.french_translation_credit') || "French translation of the libretto by Hélène Decis-Lartigau"}
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Footer / Credits */}
                <div className="pt-12 text-center text-sm text-neutral-600">
                    <p>Designed & Built with passion.</p>
                    <p className="mb-2 text-xs uppercase tracking-widest opacity-50">{t('about_project.video_copyright')}</p>
                    <p className="mt-2 text-xs uppercase tracking-widest opacity-50">© {new Date().getFullYear()} Matthäus-Passion Unraveled</p>
                </div>

            </div>
        </div>
    );
};

export default AboutProjectPage;
