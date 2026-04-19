import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { projectConfig } from '../config/project';

const Layout = () => {
    const { language, setLanguage, availableLanguages, t } = useLanguage();
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const location = useLocation();

    const isPlayerPage = location.pathname.startsWith('/play/') || location.pathname === '/play';
    const shouldDisableScroll = isPlayerPage || location.pathname === '/v2' || location.pathname === '/v3';

    const navIsActive = (item) => item.id === 'player'
        ? location.pathname.startsWith('/play/')
        : item.end
            ? location.pathname === item.path
            : location.pathname.startsWith('/' + item.path);

    const navTarget = (item) => item.id === 'player' ? '/play/kommt-ihr-toechter' : item.path;

    return (
        <div className="flex flex-col h-screen bg-mp-dark text-mp-text font-sans selection:bg-mp-gold selection:text-mp-dark">
            {/* Navbar */}
            <nav className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-mp-darker z-50 flex-shrink-0">
                {/* Left: Logo */}
                <Link
                    to="/"
                    className="text-lg md:text-xl font-serif tracking-widest text-mp-gold hover:text-white transition-colors"
                    onClick={() => setIsMobileNavOpen(false)}
                >
                    {t('title')}
                </Link>

                {/* Center: Navigation (desktop only) */}
                <div className="hidden md:flex items-center space-x-8">
                    {projectConfig.routes.filter(item => item.inMenu).map((item) => (
                        <Link
                            key={item.id}
                            to={navTarget(item)}
                            className={`text-sm uppercase tracking-widest hover:text-white transition-colors ${navIsActive(item) ? 'text-mp-gold font-bold' : 'text-gray-400'}`}
                        >
                            {item.label[language]}
                        </Link>
                    ))}
                </div>

                {/* Right: Controls */}
                <div className="flex items-center space-x-2 md:space-x-6">
                    {/* Language Switcher */}
                    <div className="relative">
                        <button
                            onClick={() => setLangOpen(o => !o)}
                            className="flex items-center space-x-1.5 text-sm uppercase tracking-wider hover:text-mp-gold transition-colors"
                        >
                            <Globe size={16} />
                            <span className="hidden sm:inline">{language.toUpperCase()}</span>
                            <ChevronDown size={12} className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {langOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                                <div className="absolute right-0 top-full mt-2 bg-mp-darker border border-white/10 rounded-lg py-1 shadow-xl z-50 min-w-[80px]">
                                    {availableLanguages.map(lang => (
                                        <button
                                            key={lang}
                                            onClick={() => { setLanguage(lang); setLangOpen(false); }}
                                            className={`w-full text-left px-4 py-2 text-sm uppercase tracking-wider hover:bg-white/5 transition-colors ${language === lang ? 'text-mp-gold font-bold' : 'text-neutral-400'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Mobile site-nav hamburger */}
                    <button
                        onClick={() => setIsMobileNavOpen(true)}
                        className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors text-neutral-400 hover:text-white"
                        aria-label="Open navigation"
                    >
                        <Menu size={22} />
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className={`flex-1 relative min-h-0 ${shouldDisableScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                <Outlet />
            </main>

            {/* Overlay */}
            {isMobileNavOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileNavOpen(false)}
                />
            )}

            {/* Mobile nav drawer — slides from left */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-mp-darker border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
                        <span className="text-mp-gold font-serif tracking-wide">{t('title')}</span>
                        <button onClick={() => setIsMobileNavOpen(false)} className="hover:text-white transition-colors p-1">
                            <X size={22} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        {projectConfig.routes.filter(item => item.inMenu).map((item) => (
                            <Link
                                key={item.id}
                                to={navTarget(item)}
                                onClick={() => setIsMobileNavOpen(false)}
                                className={`flex items-center px-6 py-4 text-sm uppercase tracking-widest border-l-2 transition-colors ${navIsActive(item)
                                    ? 'border-l-mp-gold text-mp-gold bg-white/5'
                                    : 'border-l-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {item.label[language]}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Layout;
