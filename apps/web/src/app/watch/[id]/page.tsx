'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Settings,
  SkipBack,
  SkipForward,
  ArrowLeft,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getFilmById } from '@/lib/films';
import { useUserStore } from '@/store/userStore';

const QUALITY_OPTIONS = ['Auto', '1080p', '720p', '480p', '360p'];

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const filmId = params.id as string;
  const film = getFilmById(filmId);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { updateWatchProgress } = useUserStore();

  useEffect(() => {
    if (!film) return;

    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      const progress = (video.currentTime / video.duration) * 100;
      updateWatchProgress(filmId, progress);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [film, filmId, updateWatchProgress]);

  if (!film) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Film Not Found</h1>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  let controlsTimeout: NodeJS.Timeout;

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeout);
    controlsTimeout = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  return (
    <div
      className="relative h-screen w-screen bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      {/* Video Player */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-contain"
        poster={film.backdropUrl}
        onClick={togglePlay}
      >
        <source src="/sample-video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Top Bar */}
      <div
        className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">{film.title}</h1>
            <p className="text-sm text-gray-300">{film.year} • {film.genres.join(', ')}</p>
          </div>
        </div>
      </div>

      {/* Center Play Button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="p-8 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition"
          >
            <Play className="h-16 w-16 fill-current" />
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              {isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 fill-current" />
              )}
            </button>

            {/* Skip Back */}
            <button
              onClick={() => skip(-10)}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <SkipBack className="h-5 w-5" />
            </button>

            {/* Skip Forward */}
            <button
              onClick={() => skip(10)}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <SkipForward className="h-5 w-5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover:w-20 transition-all duration-300 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="text-sm font-medium ml-2">
              {film.title}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Quality Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <Settings className="h-5 w-5" />
              </button>

              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 bg-black/95 rounded-lg p-2 min-w-[150px]">
                  <div className="text-xs font-semibold text-gray-400 mb-2 px-3">Quality</div>
                  {QUALITY_OPTIONS.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => {
                        setSelectedQuality(quality);
                        setShowSettings(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/10 rounded transition text-sm"
                    >
                      <span>{quality}</span>
                      {selectedQuality === quality && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 hover:bg-white/10 rounded-full transition"
            >
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Slider Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
