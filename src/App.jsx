import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Layout from './components/Layout';
import { projectConfig } from './config/project';
import { componentMap } from './config/componentMap';
import { titleToSlug } from './utils/slugify';

import ConcertPage from './pages/ConcertPage';

function App() {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const videoPlayerRef = useRef(null);
  const navigate = useNavigate();

  // Initial Data Load (Index)
  useEffect(() => {
    axios.get('/data/index.json')
      .then(response => {
        setChapters(response.data.chapters);
        // Don't auto-set currentChapter immediately, let the player logic or user interaction drive it
        // But for initial state it might be good to have the first one ready?
        if (response.data.chapters.length > 0) {
          setCurrentChapter(response.data.chapters[0]);
        }
      })
      .catch(error => console.error("Error loading chapters:", error));
  }, []);

  const handleChapterClick = (chapter) => {
    setCurrentChapter(chapter);
    navigate(`/play/${titleToSlug(chapter.title)}`);
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(chapter.start);
    }
  };

  return (
    // Removed HelmetProvider
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-amber-500">Loading...</div>}>
      <Routes>
        <Route path="/" element={
          <Layout
            chapters={chapters}
            currentChapter={currentChapter}
            onChapterClick={handleChapterClick}
          />
        }>
          <Route path="play" element={<Navigate to="/play/kommt-ihr-toechter" replace />} />
          {projectConfig.routes.filter(r => r.id !== 'concert').map(route => {
            const Component = componentMap[route.component];
            const isIndex = route.path === '/';

            return (
              <Route
                key={route.id}
                path={isIndex ? undefined : route.path}
                index={isIndex}
                element={
                  <Component
                    chapters={chapters}
                    currentChapter={currentChapter}
                    setCurrentChapter={setCurrentChapter}
                    videoPlayerRef={videoPlayerRef}
                  />
                }
              />
            );
          })}
        </Route>

        {/* Standalone Route for Concert Mode (No Layout) */}
        <Route
          path="/concert"
          element={
            <ConcertPage
              chapters={chapters}
              currentChapter={currentChapter}
              setCurrentChapter={setCurrentChapter}
            />
          }
        />
      </Routes>
    </Suspense>
  );
}

export default App;
