'use client'
import { useMusicToggle } from './use-music-toggle'

export function MusicToggle() {
  const { isPlaying, containerRef, toggleMusic } = useMusicToggle()

  return (
    <div className="music-toggle" style={{ cursor: 'pointer' }}>
      <div
        className="music-toggle-btn w-[100px] h-[40px] bg-primary/20 hover:bg-primary/30 rounded-full flex items-center justify-center gap-2 transition-colors"
        onClick={toggleMusic}
      >
        <div ref={containerRef} className="sound-bars" style={{ width: '20px', height: '20px' }} />
        <p className="uppercase text-sm font-mono tracking-widest text-foreground">{isPlaying ? 'on' : 'off'}</p>
      </div>
    </div>
  )
}
