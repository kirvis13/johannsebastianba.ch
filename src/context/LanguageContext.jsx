import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

const AVAILABLE_LANGUAGES = ['en', 'nl', 'fr'];

const getInitialLanguage = () => {
    try {
        const stored = window.localStorage.getItem('language');
        if (AVAILABLE_LANGUAGES.includes(stored)) return stored;
    } catch {
        // localStorage unavailable (SSR/prerender or privacy mode)
    }
    return 'en';
};

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(getInitialLanguage);

    useEffect(() => {
        try {
            window.localStorage.setItem('language', language);
        } catch {
            // ignore
        }
    }, [language]);

    const toggleLanguage = useCallback(() => {
        setLanguage((prev) => {
            const idx = AVAILABLE_LANGUAGES.indexOf(prev);
            return AVAILABLE_LANGUAGES[(idx + 1) % AVAILABLE_LANGUAGES.length];
        });
    }, []);

    const t = useCallback((key) => {
        const keys = key.split('.');
        let value = translations[language];

        for (let k of keys) {
            if (value && value[k]) {
                value = value[k];
            } else {
                return key; // Return key if not found
            }
        }
        return value;
    }, [language]);

    // Update browser tab title
    useEffect(() => {
        document.title = `${t('title')} — ${t('subtitle')}`;
    }, [t]);

    const value = useMemo(
        () => ({ language, setLanguage, toggleLanguage, availableLanguages: AVAILABLE_LANGUAGES, t }),
        [language, toggleLanguage, t]
    );

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => useContext(LanguageContext);
