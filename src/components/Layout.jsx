import React, { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Globe, List } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { projectConfig } from '../config/project';

const Layout = ({ chapters, currentChapter, onChapterClick }) => {
    const { language, toggleLanguage, t } = useLanguage();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();
    const isPlayerPage = location.pathname === '/play';
    const isV2Page = location.pathname === '/v2';
    const isV3Page = location.pathname === '/v3';

    // Pages that manage their own scroll and positioning
    // Player: needs overflow-hidden for video player layout
    // V2/V3: uses fixed canvas with ScrollControls managing scroll internally
    const shouldDisableScroll = isPlayerPage || isV2Page || isV3Page;

    const getTypeColor = (type) => {
        const t = type?.toLowerCase() || "";
        if (t.includes('recitativ')) return "border-l-mp-red text-mp-red/80"; // Matches Recitative and Recitativo
        if (t.includes('choral')) return "border-l-mp-green text-mp-green/80"; // Matches Chorale and Choral
        if (t.includes('aria')) return "border-l-mp-blue text-mp-blue/80";
        return "border-l-mp-gold text-mp-gold/80";
    };

    const getTypeTranslation = (type) => {
        const key = type?.toLowerCase();
        if (key?.includes('recitativ')) return t('types.recitative');
        if (key?.includes('choral') && !key?.includes('chorus')) return t('types.chorale'); // Exclude 'Chorus' from matching 'Choral' if overlap exists, though 'choral' vs 'chorus' is distinct enough usually. But wait, 'Recitativo_Chorus' might contain 'chorus'.
        // Actually 'chorale' has 'al', 'chorus' has 'us'. 
        // But 'Choral' matches 'Chorale'.
        // Does 'Chorus' match 'Choral'? No.
        if (key?.includes('choral')) return t('types.chorale');
        if (key?.includes('aria')) return t('types.aria');
        return t('types.chorus');
    }

    return (
        <div className="flex flex-col h-screen bg-mp-dark text-mp-text font-sans selection:bg-mp-gold selection:text-mp-dark">
            {/* Navbar */}
            <nav className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-mp-darker z-50">
                {/* Left: Logo */}
                <Link to="/" className="text-xl font-serif tracking-widest text-mp-gold hover:text-white transition-colors">
                    {t('title')}
                </Link>

                {/* Center: Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                    {projectConfig.routes.filter(item => item.inMenu).map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path}
                            className={({ isActive }) => `text-sm uppercase tracking-widest hover:text-white transition-colors ${isActive ? 'text-mp-gold font-bold' : 'text-gray-400'}`}
                            end={item.end}
                        >
                            {item.label[language]}
                        </NavLink>
                    ))}
                </div>

                {/* Right: Controls */}
                <div className="flex items-center space-x-6">
                    {/* Language Switcher */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center space-x-2 text-sm uppercase tracking-wider hover:text-mp-gold transition-colors"
                    >
                        <Globe size={16} />
                        <span>{language.toUpperCase()}</span>
                    </button>

                    {/* Hamburger Menu - Only on /play */}
                    {isPlayerPage && (
                        <button
                            onClick={() => setIsDrawerOpen(true)}
                            className="p-2 hover:bg-white/5 rounded-full transition-colors text-mp-gold"
                            title="Show Chapters"
                        >
                            <List size={24} />
                        </button>
                    )}
                </div>
            </nav>

            {/* Main Content Area */}
            <main className={`flex-1 relative ${shouldDisableScroll ? 'overflow-hidden' : 'overflow-y-auto'}`}>
                <Outlet />
            </main>

            {/* Navigation Drawer (Sidebar) */}
            {/* Overlay */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm transition-opacity"
                    onClick={() => setIsDrawerOpen(false)}
                />
            )}

            {/* Drawer Panel */}
            <div className={`fixed top-0 right-0 h-full w-80 bg-mp-darker border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center">
                        <h2 className="text-mp-gold font-serif text-lg tracking-wide">Chapters</h2>
                        <button onClick={() => setIsDrawerOpen(false)} className="hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {chapters.map((chapter) => (
                            <button
                                key={chapter.id}
                                onClick={() => {
                                    if (typeof onChapterClick === 'function') {
                                        onChapterClick(chapter);
                                    }
                                    setIsDrawerOpen(false);
                                }}
                                className={`w-full text-left p-3 rounded hover:bg-white/5 transition-all border-l-4 ${getTypeColor(chapter.type)} ${currentChapter?.id === chapter.id ? 'bg-white/10' : 'border-l-transparent opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <div className="text-xs uppercase tracking-wider mb-1 opacity-80 font-bold">
                                    {getTypeTranslation(chapter.type)}
                                </div>
                                <div className="font-serif text-sm truncate text-white">{chapter.title}</div>
                                <div className="text-xs text-gray-500 font-mono mt-1 opacity-50">{chapter.id.replace('part_', 'No. ')}</div>
                            </button>
                        ))}
                    </div>

                    <div className="p-6 border-t border-white/10 text-xs text-center opacity-40">
                        {t('footer')}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Layout;
