import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = forwardRef(({ url, onTimeUpdate, onReady, className }, ref) => {
    const internalPlayerRef = useRef(null);
    const progressInterval = useRef(null);

    // Extract video ID from URL
    const getVideoId = (url) => {
        if (!url) return null;
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : null;
    };

    const videoId = getVideoId(url);

    useImperativeHandle(ref, () => ({
        seekTo: (seconds) => {
            if (internalPlayerRef.current && internalPlayerRef.current.seekTo) {
                const time = typeof seconds === 'number' ? seconds : parseFloat(seconds);
                internalPlayerRef.current.seekTo(time, true);
                internalPlayerRef.current.playVideo();
            }
        },
        getCurrentTime: () => {
            return internalPlayerRef.current ? internalPlayerRef.current.getCurrentTime() : 0;
        }
    }));

    // Poll for progress
    useEffect(() => {
        // Clear any existing interval
        if (progressInterval.current) clearInterval(progressInterval.current);

        progressInterval.current = setInterval(() => {
            const player = internalPlayerRef.current;
            // Check if player has the method (it might be loading)
            if (player && typeof player.getCurrentTime === 'function' && typeof player.getPlayerState === 'function') {
                const state = player.getPlayerState();
                if (state === 1) { // 1 = Playing
                    const time = player.getCurrentTime();
                    if (onTimeUpdate) {
                        onTimeUpdate(time);
                    }
                }
            }
        }, 250); // chapter granularity is seconds; 250ms keeps sync tight without re-rendering the page 20×/s

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, [onTimeUpdate]);

    const onPlayerReady = (event) => {
        internalPlayerRef.current = event.target;
        if (onReady) onReady();
    };

    const onError = (e) => {
        console.error("YouTube Player Error:", e);
    }

    const opts = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            modestbranding: 1,
            controls: 1,
            origin: window.location.origin
        },
    };

    return (
        <div className={`relative bg-black shadow-2xl z-10 flex items-center justify-center overflow-hidden ${className || 'w-full h-full'}`}>
            {videoId ? (
                <YouTube
                    videoId={videoId}
                    opts={opts}
                    onReady={onPlayerReady}
                    onError={onError}
                    className="absolute top-0 left-0 w-full h-full"
                />
            ) : (
                <div className="text-gray-500">Video laden...</div>
            )}
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';
export default VideoPlayer;
