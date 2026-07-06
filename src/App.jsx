import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import { projectConfig } from './config/project';
import { componentMap } from './config/componentMap';

const ConcertPage = componentMap['ConcertPage'];

function App() {
  const [chapters, setChapters] = useState([]);
  const [currentChapter, setCurrentChapter] = useState(null);
  const videoPlayerRef = useRef(null);

  // Initial Data Load (Index)
  useEffect(() => {
    fetch('/data/index.json')
      .then(response => response.json())
      .then(data => {
        setChapters(data.chapters);
        if (data.chapters.length > 0) {
          setCurrentChapter(data.chapters[0]);
        }
      })
      .catch(error => console.error("Error loading chapters:", error));
  }, []);

  return (
    // Removed HelmetProvider
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-amber-500">Loading...</div>}>
      <Routes>
        <Route path="/" element={<Layout />}>
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
