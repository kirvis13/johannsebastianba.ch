import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { X, Play, Pause, ExternalLink } from 'lucide-react';

const MiniPlayer = ({ isOpen, onClose, start, end, title, videoId = "ZwVW1ttVhuQ", playTrigger }) => {
    const playerRef = useRef(null);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const intervalRef = useRef(null);

    // YouTube Player Options
    const opts = React.useMemo(() => ({
        height: '1',
        width: '1',
        playerVars: {
            // autoplay: 1, // Removed to avoid conflict with manual play
            start: start, // Initial start time for new player instance
            controls: 0, // No controls
            fs: 0, // No fullscreen
            modestbranding: 1,
            rel: 0, // No related videos
            showinfo: 0,
            origin: window.location.origin
        },
    }), [start]); // Re-create opts if start changes (though key handles this mostly)

    // Handle Player Ready
    const onReady = (event) => {
        playerRef.current = event.target;
        if (isOpen) {
            // Because we remount on every click (key change), we just play.
            // verifying start time is set via playerVars, but seeking ensures it.
            if (start !== undefined) {
                event.target.seekTo(start);
            }
            event.target.playVideo();
            startProgressInterval();
        }
    };

    const onError = (event) => {
        console.error("MiniPlayer: YouTube Error:", event.data);
    };


    const onStateChange = (event) => {
        // 1 = Playing, 2 = Paused, 0 = Ended
        if (event.data === 1) {
            setPlaying(true);
            startProgressInterval();
        } else if (event.data === 2) {
            setPlaying(false);
            stopProgressInterval();
        } else if (event.data === 0) {
            setPlaying(false);
            stopProgressInterval();
            if (playerRef.current) {
                playerRef.current.seekTo(start);
                setProgress(0);
            }
        }
    };

    const startProgressInterval = () => {
        stopProgressInterval();
        intervalRef.current = setInterval(() => {
            if (playerRef.current && end && start !== undefined) {
                const currentTime = playerRef.current.getCurrentTime();
                const duration = end - start;
                const currentProgress = Math.max(0, Math.min(100, ((currentTime - start) / duration) * 100));

                setProgress(currentProgress);

                if (currentTime >= end) {
                    playerRef.current.pauseVideo();
                    playerRef.current.seekTo(start);
                    setProgress(0);
                    setPlaying(false);
                }
            }
        }, 100);
    };

    const stopProgressInterval = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Effect to handle open/close (but NOT seeking/loading anymore, handled by key remount)
    useEffect(() => {
        if (!isOpen) {
            setPlaying(false);
            stopProgressInterval();
            if (playerRef.current) {
                playerRef.current.pauseVideo();
            }
        }
    }, [isOpen]);

    // Cleanup
    useEffect(() => {
        return () => stopProgressInterval();
    }, []);

    const togglePlay = () => {
        if (!playerRef.current) return;
        if (playing) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    if (!isOpen) return null;

    // Use playTrigger (timestamp) as key to force complete remount of player on new click
    // Fallback to videoId+start if playTrigger is missing
    const playerKey = playTrigger ? `player-${playTrigger}` : `player-${videoId}-${start}`;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-amber-500/30 shadow-2xl z-50 animate-in slide-in-from-bottom duration-300">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">

                {/* Hidden YouTube Player (kept in DOM for reliable playback) */}
                <div className="absolute top-0 left-0 opacity-0 pointer-events-none w-px h-px overflow-hidden">
                    <YouTube
                        key={playerKey}
                        videoId={videoId}
                        opts={opts}
                        onReady={onReady}
                        onStateChange={onStateChange}
                        onError={onError}
                    />
                </div>

                {/* Play/Pause Button */}
                <button
                    onClick={togglePlay}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-900 transition-colors shrink-0"
                >
                    {playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>

                {/* Info & Progress */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="text-sm font-medium text-neutral-200 truncate pr-4">{title}</h4>
                        <span className="text-xs text-amber-500 font-mono hidden sm:inline-block">
                            {Math.floor(end - start)}s clip
                        </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 transition-all duration-200 ease-linear"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="p-2 text-neutral-500 hover:text-neutral-300 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default MiniPlayer;
