import React, { createContext, useContext, useState } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en'); // Default to English as requested

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'nl' : 'en'));
    };

    const t = (key) => {
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
    };

    // Update browser tab title
    React.useEffect(() => {
        document.title = `${t('title')} — ${t('subtitle')}`;
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
