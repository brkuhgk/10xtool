/**
 * Focus Music Addon
 * Play ambient sounds to boost focus and creativity
 */
import React, { useState, useEffect, useRef } from 'react';
import { Music, Play, Pause, Volume2, Volume1, VolumeX, SkipForward, Timer, Settings, Sliders } from 'lucide-react';
import './styles.css';

// Sample sound collections - these would be real audio tracks in a production app
const SOUND_COLLECTIONS = [
  {
    id: 'nature',
    name: 'Nature',
    icon: '🌿',
    sounds: [
      { id: 'rain', name: 'Rainfall', url: 'https://assets.mixkit.co/sfx/preview/mixkit-light-rain-loop-2393.mp3' },
      { id: 'forest', name: 'Forest', url: 'https://assets.mixkit.co/sfx/preview/mixkit-forest-birds-singing-loop-1239.mp3' },
      { id: 'waves', name: 'Ocean Waves', url: 'https://assets.mixkit.co/sfx/preview/mixkit-ocean-waves-1197.mp3' },
      { id: 'creek', name: 'Creek', url: 'https://assets.mixkit.co/sfx/preview/mixkit-small-creek-loop-1248.mp3' },
      { id: 'night', name: 'Night', url: 'https://assets.mixkit.co/sfx/preview/mixkit-deep-forest-crickets-1735.mp3' }
    ]
  },
  {
    id: 'ambient',
    name: 'Ambient',
    icon: '🎵',
    sounds: [
      { id: 'space', name: 'Space', url: 'https://assets.mixkit.co/sfx/preview/mixkit-cinematic-space-drone-781.mp3' },
      { id: 'meditation', name: 'Meditation', url: 'https://assets.mixkit.co/sfx/preview/mixkit-wild-meditation-call-eagle-flute-spiritual-893.mp3' },
      { id: 'drone', name: 'Drone', url: 'https://assets.mixkit.co/sfx/preview/mixkit-airy-cinematic-transition-1294.mp3' },
      { id: 'mystery', name: 'Mystery', url: 'https://assets.mixkit.co/sfx/preview/mixkit-mysterious-wind-whoosh-2128.mp3' }
    ]
  },
  {
    id: 'noise',
    name: 'Noise',
    icon: '🎚️',
    sounds: [
      { id: 'white', name: 'White Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-analog-vinyl-static-noise-1093.mp3' },
      { id: 'brown', name: 'Brown Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-house-vortex-woosh-2470.mp3' },
      { id: 'pink', name: 'Pink Noise', url: 'https://assets.mixkit.co/sfx/preview/mixkit-cosmic-wind-whoosh-1156.mp3' }
    ]
  },
  {
    id: 'cafe',
    name: 'Cafe',
    icon: '☕',
    sounds: [
      { id: 'coffeeshop', name: 'Coffee Shop', url: 'https://assets.mixkit.co/sfx/preview/mixkit-restaurant-crowd-talking-ambience-444.mp3' },
      { id: 'keyboard', name: 'Keyboard', url: 'https://assets.mixkit.co/sfx/preview/mixkit-office-keyboard-ambience-2534.mp3' },
      { id: 'pages', name: 'Page Turning', url: 'https://assets.mixkit.co/sfx/preview/mixkit-turning-magazine-pages-1140.mp3' }
    ]
  }
];

const FocusMusic = () => {
  // State
  const [activeCollection, setActiveCollection] = useState('nature');
  const [activeSound, setActiveSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDuration, setTimerDuration] = useState(25); // minutes
  const [timerRemaining, setTimerRemaining] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Refs
  const audioRef = useRef(null);
  const timerRef = useRef(null);
  
  // Get current collection
  const currentCollection = SOUND_COLLECTIONS.find(c => c.id === activeCollection);
  
  // Get current sound
  const currentSound = activeSound ? 
    currentCollection.sounds.find(s => s.id === activeSound) : 
    null;
  
  // Play/Pause audio
  const togglePlay = () => {
    if (!audioRef.current || !currentSound) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  // Switch sound
  const switchSound = (soundId) => {
    // If same sound, just toggle play/pause
    if (soundId === activeSound) {
      togglePlay();
      return;
    }
    
    // Otherwise, switch to new sound
    setActiveSound(soundId);
    setIsPlaying(true);
  };
  
  // Skip to next sound
  const nextSound = () => {
    if (!currentCollection) return;
    
    const soundIndex = currentSound ? 
      currentCollection.sounds.findIndex(s => s.id === activeSound) : 
      -1;
      
    const nextIndex = (soundIndex + 1) % currentCollection.sounds.length;
    setActiveSound(currentCollection.sounds[nextIndex].id);
    setIsPlaying(true);
  };
  
  // Change volume
  const changeVolume = (newVolume) => {
    if (!audioRef.current) return;
    
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    setVolume(clampedVolume);
    audioRef.current.volume = clampedVolume;
  };
  
  // Format time display
  const formatTime = (minutes) => {
    return `${minutes}:00`;
  };
  
  // Toggle timer
  const toggleTimer = () => {
    if (timerActive) {
      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setTimerActive(false);
      setTimerRemaining(0);
    } else {
      // Start timer
      setTimerRemaining(timerDuration * 60);
      setTimerActive(true);
    }
  };
  
  // Update audio source when sound changes
  useEffect(() => {
    if (!currentSound) return;
    
    if (audioRef.current) {
      audioRef.current.src = currentSound.url;
      audioRef.current.volume = volume;
      
      if (isPlaying) {
        audioRef.current.play().catch(err => {
          console.error("Error playing audio:", err);
          setIsPlaying(false);
        });
      }
    }
  }, [activeSound, currentSound]);
  
  // Handle timer
  useEffect(() => {
    if (timerActive && timerRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimerRemaining(prev => {
          if (prev <= 1) {
            // Timer finished
            clearInterval(timerRef.current);
            setTimerActive(false);
            
            // Stop audio
            if (audioRef.current && isPlaying) {
              audioRef.current.pause();
              setIsPlaying(false);
            }
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timerActive, timerRemaining, isPlaying]);
  
  // Format timer display
  const formatTimerDisplay = () => {
    if (timerRemaining === 0) return '00:00';
    
    const minutes = Math.floor(timerRemaining / 60);
    const seconds = timerRemaining % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={18} />;
    if (volume < 0.5) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };
  
  return (
    <div className="focus-music-addon">
      <div className="music-header">
        <div className="header-title">
          <Music size={18} className="music-icon" />
          <h2 className="music-title">Focus Sounds</h2>
        </div>
        
        <div className="music-actions">
          {timerActive && (
            <div className="timer-display">
              <Timer size={14} />
              <span>{formatTimerDisplay()}</span>
            </div>
          )}
          <button 
            className={`music-action-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Settings"
          >
            <Sliders size={16} />
          </button>
        </div>
      </div>
      
      {showSettings ? (
        <div className="music-settings">
          <h3 className="settings-title">Settings</h3>
          
          <div className="setting-group">
            <div className="setting-label">
              <Volume2 size={16} />
              <span>Volume</span>
            </div>
            <input 
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
          
          <div className="setting-group">
            <div className="setting-label">
              <Timer size={16} />
              <span>Timer</span>
            </div>
            <div className="timer-controls">
              <select 
                value={timerDuration}
                onChange={(e) => setTimerDuration(parseInt(e.target.value))}
                className="timer-select"
                disabled={timerActive}
              >
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="25">25 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
              <button 
                className={`timer-btn ${timerActive ? 'active' : ''}`}
                onClick={toggleTimer}
              >
                {timerActive ? 'Stop' : 'Start'}
              </button>
            </div>
          </div>
          
          <button 
            className="close-settings-btn"
            onClick={() => setShowSettings(false)}
          >
            Back to Sounds
          </button>
        </div>
      ) : (
        <>
          <div className="collection-tabs">
            {SOUND_COLLECTIONS.map(collection => (
              <button 
                key={collection.id}
                className={`collection-tab ${activeCollection === collection.id ? 'active' : ''}`}
                onClick={() => setActiveCollection(collection.id)}
              >
                <span className="collection-icon">{collection.icon}</span>
                <span className="collection-name">{collection.name}</span>
              </button>
            ))}
          </div>
          
          <div className="sounds-list">
            {currentCollection?.sounds.map(sound => (
              <button 
                key={sound.id}
                className={`sound-item ${activeSound === sound.id ? 'active' : ''}`}
                onClick={() => switchSound(sound.id)}
              >
                <span className="sound-name">{sound.name}</span>
                {activeSound === sound.id && (
                  <span className="playing-indicator">
                    {isPlaying ? 'Playing' : 'Paused'}
                  </span>
                )}
              </button>
            ))}
          </div>
          
          <div className="music-controls">
            <div className="music-control-btns">
              <button 
                className="control-btn play-btn"
                onClick={togglePlay}
                disabled={!activeSound}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button 
                className="control-btn"
                onClick={nextSound}
                disabled={!currentCollection?.sounds.length}
              >
                <SkipForward size={20} />
              </button>
            </div>
            
            <div className="volume-control">
              <button 
                className="volume-btn"
                onClick={() => changeVolume(volume === 0 ? 0.7 : 0)}
              >
                {getVolumeIcon()}
              </button>
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="volume-slider"
              />
            </div>
          </div>
          
          <div className="now-playing">
            {currentSound ? (
              <>
                <div className="playing-info">
                  <span className="playing-collection">{currentCollection.name}</span>
                  <span className="playing-divider">•</span>
                  <span className="playing-sound">{currentSound.name}</span>
                </div>
                {timerActive && (
                  <div className="playing-timer">
                    <Timer size={14} />
                    <span>{formatTimerDisplay()}</span>
                  </div>
                )}
              </>
            ) : (
              <span className="no-sound">Select a sound to play</span>
            )}
          </div>
        </>
      )}
      
      <audio ref={audioRef} loop />
    </div>
  );
};

export default FocusMusic;