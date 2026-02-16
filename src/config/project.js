export const projectConfig = {
    title: "Matthäus-Passion",
    composer: "Johann Sebastian Bach",
    routes: [
        {
            id: 'home',
            path: '/',
            component: 'HomePageV4',
            label: { en: 'Home', nl: 'Home' },
            inMenu: true,
            end: true
        },
        {
            id: 'discover',
            path: 'discover',
            component: 'DiscoverPage',
            label: { en: 'Discover', nl: 'Ontdekken', de: 'Entdecken' },
            inMenu: true
        },
        {
            id: 'story',
            path: 'story',
            component: 'StoryTimeline',
            label: { en: 'Story', nl: 'Het Verhaal', de: 'Die Geschichte' },
            inMenu: true
        },
        {
            id: 'player',
            path: 'play',
            component: 'PlayerPage',
            label: { en: 'Experience', nl: 'De Passie' },
            inMenu: true
        },
        {
            id: 'about',
            path: 'about',
            component: 'AboutPage',
            label: { en: 'About Bach', nl: 'Over Bach' },
            inMenu: true
        },
        {
            id: 'concert',
            path: 'concert',
            component: 'ConcertPage',
            label: { en: 'Concert', nl: 'Concert' },
            inMenu: false
        },
        {
            id: 'colophon',
            path: 'colophon',
            component: 'AboutProjectPage',
            label: { en: 'Colophon', nl: 'Colofon', de: 'Impressum' },
            inMenu: true
        }
    ]
};
