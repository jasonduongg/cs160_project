'use client';

import { useEffect, useState } from 'react';

interface SpotifyPlayerProps {
  trackId: string;
  token: string;
  previewUrl?: string;
  externalUrl?: string;
}

declare global {
  interface Window {
    Spotify: {
      Player: new (config: {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume: number;
      }) => any;
    };
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export default function SpotifyPlayer({ trackId, token, previewUrl, externalUrl }: SpotifyPlayerProps) {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [usePreview, setUsePreview] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Handle preview URL playback
  useEffect(() => {
    if (usePreview && previewUrl) {
      const newAudio = new Audio(previewUrl);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      newAudio.addEventListener('play', () => setIsPlaying(true));
      newAudio.addEventListener('pause', () => setIsPlaying(false));
      setAudio(newAudio);

      return () => {
        newAudio.pause();
        newAudio.removeEventListener('ended', () => setIsPlaying(false));
        newAudio.removeEventListener('play', () => setIsPlaying(true));
        newAudio.removeEventListener('pause', () => setIsPlaying(false));
      };
    }
  }, [usePreview, previewUrl]);

  useEffect(() => {
    if (!token) {
      setError('Spotify token is missing');
      setUsePreview(true);
      return;
    }

    // Check if Spotify SDK is already loaded
    if (window.Spotify) {
      initializePlayer();
      return;
    }

    // Load the Spotify Web Playback SDK script
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    script.onerror = () => {
      setError('Failed to load Spotify SDK');
      console.error('Failed to load Spotify SDK script');
      setUsePreview(true);
    };

    document.body.appendChild(script);

    // Initialize the player when the SDK is ready
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('Spotify SDK is ready');
      setIsInitialized(true);
      initializePlayer();
    };

    // Cleanup
    return () => {
      if (player) {
        player.disconnect();
      }
      if (script.parentNode) {
        document.body.removeChild(script);
      }
    };
  }, [token]);

  const initializePlayer = () => {
    try {
      if (!window.Spotify) {
        setError('Spotify SDK not loaded');
        setUsePreview(true);
        return;
      }

      console.log('Initializing Spotify player...');
      const player = new window.Spotify.Player({
        name: 'Journal App Player',
        getOAuthToken: (cb: (token: string) => void) => { 
          console.log('Getting OAuth token...');
          cb(token); 
        },
        volume: 0.5
      });

      // Add event listeners
      player.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('Player ready with Device ID:', device_id);
        setDeviceId(device_id);
        setError(null);
      });

      player.addListener('not_ready', ({ device_id }: { device_id: string }) => {
        console.log('Player not ready, Device ID:', device_id);
        setError('Player is not ready');
        setUsePreview(true);
      });

      player.addListener('player_state_changed', (state: any) => {
        console.log('Player state changed:', state);
        if (state) {
          setIsPlaying(!state.paused);
        }
      });

      player.addListener('initialization_error', ({ message }: { message: string }) => {
        console.error('Initialization Error:', message);
        setError(`Failed to initialize player: ${message}`);
        setUsePreview(true);
      });

      player.addListener('authentication_error', ({ message }: { message: string }) => {
        console.error('Authentication Error:', message);
        setError(`Authentication failed: ${message}`);
        setUsePreview(true);
      });

      player.addListener('account_error', ({ message }: { message: string }) => {
        console.error('Account Error:', message);
        setError(`Account error: ${message}`);
        setUsePreview(true);
      });

      // Connect to the player
      console.log('Connecting to Spotify player...');
      player.connect();
      setPlayer(player);
    } catch (err) {
      console.error('Error initializing player:', err);
      setError(`Failed to initialize player: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setUsePreview(true);
    }
  };

  useEffect(() => {
    if (deviceId && trackId && isInitialized && !usePreview) {
      console.log('Playing track:', trackId, 'on device:', deviceId);
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        body: JSON.stringify({ uris: [`spotify:track:${trackId}`] }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      }).catch(err => {
        console.error('Error playing track:', err);
        setError(`Failed to play track: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setUsePreview(true);
      });
    }
  }, [deviceId, trackId, token, isInitialized, usePreview]);

  const togglePlay = () => {
    if (usePreview && audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play().catch(err => {
          console.error('Error playing preview:', err);
          setError('Failed to play preview');
        });
      }
    } else if (player) {
      console.log('Toggling play/pause');
      player.togglePlay();
    }
  };

  if (!isInitialized && !usePreview) {
    return <div className="text-sm text-gray-500">Initializing Spotify player...</div>;
  }

  return (
    <div className="mt-2">
      <button
        onClick={togglePlay}
        className="flex items-center space-x-2 text-sm text-green-600 hover:text-green-700"
        disabled={(!player && !audio) || !!error}
      >
        <svg
          className={`w-5 h-5 ${isPlaying ? 'animate-pulse' : ''}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          {isPlaying ? (
            <path d="M5.3 3.3a1 1 0 011.4 0l8 8a1 1 0 010 1.4l-8 8a1 1 0 01-1.4-1.4L12.6 12 5.3 4.7a1 1 0 010-1.4z" />
          ) : (
            <path d="M6.3 2.8a1 1 0 011.4 0l8 8a1 1 0 010 1.4l-8 8a1 1 0 01-1.4-1.4L13.6 12 6.3 4.7a1 1 0 010-1.4z" />
          )}
        </svg>
        <span>{isPlaying ? 'Pause' : 'Play'}</span>
      </button>
      {error && (
        <div className="mt-1">
          <p className="text-xs text-red-500">
            {error.includes('Invalid token scopes') 
              ? 'Full playback requires Spotify Premium. Playing preview instead.'
              : error}
          </p>
          {externalUrl && (
            <a 
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline mt-1 block"
            >
              Open in Spotify
            </a>
          )}
        </div>
      )}
      {usePreview && !error && (
        <p className="text-xs text-gray-500 mt-1">Playing preview</p>
      )}
    </div>
  );
} 