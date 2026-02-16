import React, { lazy } from 'react';

const HomePageV4 = lazy(() => import('../pages/HomePageV4'));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage'));
const StoryTimeline = lazy(() => import('../pages/StoryTimeline'));
const PlayerPage = lazy(() => import('../pages/PlayerPage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const AboutProjectPage = lazy(() => import('../pages/AboutProjectPage'));
const ConcertPage = lazy(() => import('../pages/ConcertPage'));

export const componentMap = {
    'HomePageV4': HomePageV4,
    'DiscoverPage': DiscoverPage,
    'StoryTimeline': StoryTimeline,
    'PlayerPage': PlayerPage,
    'AboutPage': AboutPage,
    'AboutProjectPage': AboutProjectPage,
    'ConcertPage': ConcertPage
};
