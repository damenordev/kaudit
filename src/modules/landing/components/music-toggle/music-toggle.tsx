'use client'
import { useMusicToggle } from './use-music-toggle'

export function MusicToggle() {
  const { isPlaying, containerRef, toggleMusic } = useMusicToggle()

  return (
    <>
      <style>{`
        .sound-bars svg path {
          stroke: currentColor !important;
          fill: currentColor !important;
        }
      `}</style>
      <div className="music-toggle" style={{ cursor: 'pointer' }}>
        <div
          className="music-toggle-btn w-[100px] h-[40px] bg-primary/10 hover:bg-primary/20 border border-transparent hover:border-primary/20 rounded-full flex items-center justify-center gap-2 transition-colors text-foreground"
          onClick={toggleMusic}
        >
          <div ref={containerRef} className="sound-bars text-foreground" style={{ width: '20px', height: '20px' }} />
          <p className="uppercase text-sm font-mono tracking-widest text-foreground">{isPlaying ? 'on' : 'off'}</p>
        </div>
      </div>
    </>
  )
}
