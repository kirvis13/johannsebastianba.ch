import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLanguage } from '../context/LanguageContext';

const SEO = ({
    title,
    description,
    image = '/images/story/story_01.webp',
    type = 'website',
    schema = null
}) => {
    const { language } = useLanguage();
    const siteTitle = "Matthäus-Passion Unraveled";
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const currentUrl = window.location.href;
    const baseUrl = window.location.origin;
    const fullImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

    // Default JSON-LD Schema (Website)
    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": siteTitle,
        "url": baseUrl,
        "description": "An interactive journey through Bach's St Matthew Passion.",
        "inLanguage": language
    };

    const finalSchema = schema || defaultSchema;

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <html lang={language} />

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

            {/* JSON-LD Structured Data for GEO/AI */}
            <script type="application/ld+json">
                {JSON.stringify(finalSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
