import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SITE_URL } from '../config/project';

const SEO = ({
    title,
    description,
    image = '/images/story/story_01.webp',
    type = 'website',
    schema = null
}) => {
    const { language } = useLanguage();
    const location = useLocation();
    const siteTitle = "Matthäus-Passion Unraveled";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const baseUrl = SITE_URL;
    const currentUrl = `${SITE_URL}${location.pathname}`;
    const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;
    const path = location.pathname;

    // Default JSON-LD Schema (Website)
    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteTitle,
        "url": baseUrl,
        "description": "An interactive journey through Bach's St Matthew Passion.",
        "inLanguage": language
    };

    const finalSchemas = schema
        ? (Array.isArray(schema) ? schema : [schema])
        : [defaultSchema];

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <html lang={language} />

            {/* Canonical */}
            <link rel="canonical" href={currentUrl} />

            {/* Hreflang */}
            <link rel="alternate" hreflang="en" href={`${SITE_URL}${path}`} />
            <link rel="alternate" hreflang="nl" href={`${SITE_URL}${path}?lang=nl`} />
            <link rel="alternate" hreflang="x-default" href={`${SITE_URL}${path}`} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={fullImage} />
            <meta property="og:site_name" content={siteTitle} />
            <meta property="og:locale" content={language === 'nl' ? 'nl_NL' : (language === 'de' ? 'de_DE' : 'en_US')} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={fullImage} />

            {/* JSON-LD Structured Data */}
            {finalSchemas.map((s, i) => (
                <script key={i} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
};

export default SEO;
