import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Globe, List, ChevronDown, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { projectConfig } from '../config/project';

const Layout = ({ chapters, currentChapter, onChapterClick }) => {
    const { language, setLanguage, availableLanguages, t } = useLanguage();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const isPlayerPage = location.pathname.startsWith('/play/') || location.pathname === '/play';
    const shouldDisableScroll = isPlayerPage || location.pathname === '/v2' || location.pathname === '/v3';

    const filteredChapters = searchQuery.trim()
        ? chapters.filter(c =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (c.nba_no && c.nba_no.includes(searchQuery))
          )
        : chapters;

    const getTypeColor = (type) => {
        const key = type?.toLowerCase() || '';
        if (key.includes('recitativ')) return 'border-l-mp-red text-mp-red/80';
        if (key.includes('choral') && !key.includes('chorus')) return 'border-l-mp-green text-mp-green/80';
        if (key.includes('choral')) return 'border-l-mp-green text-mp-green/80';
        if (key.includes('aria')) return 'border-l-mp-blue text-mp-blue/80';
        return 'border-l-mp-gold text-mp-gold/80';
    };

    const getTypeTranslation = (type) => {
        const key = type?.toLowerCase();
        if (key?.includes('recitativ')) return t('types.recitative');
        if (key?.includes('choral') && !key?.includes('chorus')) return t('types.chorale');
        if (key?.includes('choral')) return t('types.chorale');
        if (key?.includes('aria')) return t('types.aria');
        return t('types.chorus');
    };

    const closeAll = () => {
        setIsDrawerOpen(false);
        setIsMobileNavOpen(false);
        setLangOpen(false);
    };

    return (
        <div className="flex flex-col h-screen bg-mp-dark text-mp-text font-sans selection:bg-mp-gold selection:text-mp-dark">
            {/* Navbar */}
            <nav className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-mp-darker z-50 flex-shrink-0">
                {/* Left: Logo */}
                <Link
                    to="/"
                    className="text-lg md:text-xl font-serif tracking-widest text-mp-gold hover:text-white transition-colors"
                    onClick={closeAll}
                >
                    {t('title')}
                </Link>

                {/* Center: Navigation (desktop only) */}
                <div className="hidden md:flex items-center space-x-8">
                    {projectConfig.routes.filter(item => item.inMenu).map((item) => {
                        const isActive = item.id === 'player'
                            ? location.pathname.startsWith('/play/')
                            : item.end
                                ? location.pathname === item.path
                                : location.pathname.startsWith('/' + item.path);
                        return (
                            <Link
                                key={item.id}
                                to={item.id === 'player' ? '/play/kommt-ihr-toechter' : item.path}
                                className={`text-sm uppercase tracking-widest hover:text-white transition-colors ${isActive ? 'text-mp-gold font-bold' : 'text-gray-400'}`}
                            >
                                {item.label[language]}
                            </Link>
                        );
                    })}
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

                    {/* Chapters button — only on player pages */}
                    {isPlayerPage && (
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-mp-gold"
                            title="Show Chapters"
                            aria-label="Open chapter list"
                        >
                            <List size={22} />
                        </button>
                    )}

                    {/* Mobile site-nav hamburger — hidden on desktop */}
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

            {/* === MOBILE SITE NAV DRAWER === */}
            {(isMobileNavOpen || isDrawerOpen) && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
                    onClick={closeAll}
                />
            )}

            {/* Mobile nav slides from the left */}
            <div className={`fixed top-0 left-0 h-full w-72 bg-mp-darker border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="h-16 border-b border-white/10 flex items-center justify-between px-6">
                        <span className="text-mp-gold font-serif tracking-wide">{t('title')}</span>
                        <button onClick={() => setIsMobileNavOpen(false)} className="hover:text-white transition-colors p-1">
                            <X size={22} />
                        </button>
                    </div>

                    <nav className="flex-1 overflow-y-auto py-4">
                        {projectConfig.routes.filter(item => item.inMenu).map((item) => {
                            const isActive = item.id === 'player'
                                ? location.pathname.startsWith('/play/')
                                : item.end
                                    ? location.pathname === item.path
                                    : location.pathname.startsWith('/' + item.path);
                            return (
                                <Link
                                    key={item.id}
                                    to={item.id === 'player' ? '/play/kommt-ihr-toechter' : item.path}
                                    onClick={() => setIsMobileNavOpen(false)}
                                    className={`flex items-center px-6 py-4 text-sm uppercase tracking-widest border-l-2 transition-colors ${isActive
                                        ? 'border-l-mp-gold text-mp-gold bg-white/5'
                                        : 'border-l-transparent text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    {item.label[language]}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Language switcher in mobile nav */}
                    <div className="p-6 border-t border-white/10">
                        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">Language</p>
                        <div className="flex gap-2">
                            {availableLanguages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => { setLanguage(lang); setIsMobileNavOpen(false); }}
                                    className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded border transition-colors ${language === lang
                                        ? 'border-mp-gold text-mp-gold'
                                        : 'border-white/20 text-neutral-400 hover:border-white/40 hover:text-white'
                                    }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* === CHAPTERS DRAWER (right side) === */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-mp-darker border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10 flex-shrink-0">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-mp-gold font-serif text-lg tracking-wide">Chapters</h2>
                            <button onClick={() => setIsDrawerOpen(false)} className="hover:text-white transition-colors p-1">
                                <X size={22} />
                            </button>
                        </div>

                        {/* Search field */}
                        <div className="relative">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search chapters…"
                                className="w-full bg-white/5 border border-white/10 rounded-lg pl-8 pr-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-mp-gold/50 transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X size={12} />
                                </button>
                            )}
                        </div>

                        {/* Result count when searching */}
                        {searchQuery.trim() && (
                            <p className="text-xs text-gray-500 mt-2">
                                {filteredChapters.length} result{filteredChapters.length !== 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Chapter list */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-1">
                        {filteredChapters.length > 0 ? filteredChapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => {
                                    if (typeof onChapterClick === 'function') {
                                        onChapterClick(chapter);
                                    }
                                    setIsDrawerOpen(false);
                                }}
                                className={`w-full text-left p-3 rounded hover:bg-white/5 transition-all border-l-4 ${getTypeColor(chapter.type)} ${
                                    currentChapter?.id === chapter.id
                                        ? 'bg-white/10 border-l-opacity-100'
                                        : 'border-l-transparent opacity-60 hover:opacity-100'
                                }`}
                            >
                                <div className="text-xs uppercase tracking-wider mb-0.5 font-bold opacity-80">
                                    {getTypeTranslation(chapter.type)}
                                </div>
                                <div className="font-serif text-sm text-white leading-snug">{chapter.title}</div>
                                <div className="text-xs text-gray-500 font-mono mt-0.5 opacity-50">
                                    No. {chapter.nba_no}
                                </div>
                            </button>
                        )) : (
                            <div className="text-center py-12 text-gray-500 text-sm">
                                No chapters match "{searchQuery}"
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t border-white/10 text-xs text-center opacity-40 flex-shrink-0">
                        {t('footer')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
