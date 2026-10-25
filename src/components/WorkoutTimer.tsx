import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer as TimerIcon, Volume2, VolumeX, X } from 'lucide-react';

export default function WorkoutTimer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'stopwatch' | 'tabata'>('tabata');
  const [seconds, setSeconds] = useState(20);
  const [isActive, setIsActive] = useState(false);
  const [tabataPhase, setTabataPhase] = useState<'WORK' | 'REST'>('WORK');
  const [round, setRound] = useState(1);
  const totalRounds = 8;
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio beep generator using Web Audio API
  const playBeep = (freq = 800, duration = 0.15) => {
    if (!soundEnabled) return;
    try {
      const AudioContext = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext not allowed or unsupported
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive) {
      interval = setInterval(() => {
        if (mode === 'stopwatch') {
          setSeconds((s) => s + 1);
        } else {
          // Tabata mode
          setSeconds((s) => {
            if (s > 1) {
              if (s <= 4) playBeep(600, 0.08); // countdown warning
              return s - 1;
            } else {
              // Phase flip
              if (tabataPhase === 'WORK') {
                playBeep(900, 0.3); // High beep for rest
                setTabataPhase('REST');
                return 10;
              } else {
                playBeep(1200, 0.4); // High double beep for work
                if (round >= totalRounds) {
                  setIsActive(false);
                  setTabataPhase('WORK');
                  setRound(1);
                  return 20;
                } else {
                  setRound((r) => r + 1);
                  setTabataPhase('WORK');
                  return 20;
                }
              }
            }
          });
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, mode, tabataPhase, round, soundEnabled]);

  const handleReset = () => {
    setIsActive(false);
    if (mode === 'stopwatch') {
      setSeconds(0);
    } else {
      setSeconds(20);
      setTabataPhase('WORK');
      setRound(1);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-20 left-4 md:bottom-6 md:left-6 z-40">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-white/95 hover:bg-white border border-[#e8ede6] text-[#192418] px-3.5 py-2.5 rounded-full shadow-md backdrop-blur-md transition-all duration-200 group"
        >
          <TimerIcon className="w-4 h-4 text-[#5ba83c] group-hover:rotate-45 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider font-mono">
            {isActive ? formatTime(seconds) : 'TRAINING TIMER'}
          </span>
          {isActive && (
            <span className="w-2 h-2 rounded-full bg-[#5ba83c] animate-ping" />
          )}
        </button>
      ) : (
        <div className="w-72 bg-white border border-[#e8ede6] rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-fade-in space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-[#f0f4ee]">
            <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase text-[#192418] tracking-wide">
              <TimerIcon className="w-4 h-4 text-[#5ba83c]" />
              <span>INTERVAL CLOCK</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="text-[#7a8c79] hover:text-[#192418] p-1 rounded-lg"
                title={soundEnabled ? 'Mute sound' : 'Enable sound'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#5ba83c]" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[#7a8c79] hover:text-[#192418] p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-1.5 bg-[#f6f8f5] p-1 rounded-xl text-[11px] font-bold">
            <button
              onClick={() => {
                setMode('tabata');
                handleReset();
              }}
              className={`py-1.5 rounded-lg transition-colors ${
                mode === 'tabata' ? 'bg-[#5ba83c] text-white shadow-xs' : 'text-[#5e6f5e] hover:text-[#192418]'
              }`}
            >
              TABATA (20/10)
            </button>
            <button
              onClick={() => {
                setMode('stopwatch');
                setSeconds(0);
                setIsActive(false);
              }}
              className={`py-1.5 rounded-lg transition-colors ${
                mode === 'stopwatch' ? 'bg-[#5ba83c] text-white shadow-xs' : 'text-[#5e6f5e] hover:text-[#192418]'
              }`}
            >
              STOPWATCH
            </button>
          </div>

          {/* Main Display */}
          <div className="text-center py-3 bg-[#f6f8f5] rounded-2xl border border-[#e8ede6]">
            {mode === 'tabata' && (
              <div className="text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
                <span
                  className={
                    tabataPhase === 'WORK'
                      ? 'text-[#3b7e23] font-black'
                      : 'text-sky-600 font-black'
                  }
                >
                  {tabataPhase === 'WORK' ? '⚡ WORK INTERVAL' : '❄ REST / RECOVER'}
                </span>
                <span className="text-[#7a8c79] ml-2">ROUND {round}/{totalRounds}</span>
              </div>
            )}

            <div className="font-mono text-4xl font-black text-[#192418] tracking-wider">
              {formatTime(seconds)}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                isActive
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-[#5ba83c] hover:bg-[#4d9630] text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" /> PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" /> START
                </>
              )}
            </button>
            <button
              onClick={handleReset}
              className="p-2.5 bg-[#f6f8f5] hover:bg-[#edf2ea] text-[#5e6f5e] hover:text-[#192418] rounded-2xl border border-[#e8ede6]"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
