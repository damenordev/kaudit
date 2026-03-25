import Link from 'next/link'

export function Footer() {
  return (
    <footer className="fixed left-0 bottom-0 w-screen h-screen overflow-hidden bg-background text-foreground z-0">
      <div className="w-full h-full flex flex-col justify-end px-8 md:px-16 pb-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 mb-16">
          <div className="w-full md:w-1/2">
            <h3 className="text-2xl md:text-4xl font-normal leading-tight max-w-[75%] md:max-w-none text-muted-foreground/80">
              Un viaje al corazón del código seguro por KAudit © 2026 — Todos los derechos reservados.
            </h3>
          </div>
          <div className="w-full md:w-1/2 flex">
            <div className="flex-1 hidden md:block"></div>
            <div className="flex-1 flex flex-col items-start md:items-end">
              <p className="text-foreground uppercase font-mono text-sm mb-4 tracking-widest">[ * Archivo ]</p>
              <div className="flex flex-col items-start md:items-end space-y-1">
                <Link
                  href="#project-01"
                  className="text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  Archivo 101
                </Link>
                <Link
                  href="#project-02"
                  className="text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  Archivo 102
                </Link>
                <Link
                  href="#project-03"
                  className="text-muted-foreground hover:text-primary transition-colors font-mono"
                >
                  Archivo 103
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-muted-foreground/40 font-mono text-2xl md:text-3xl pointer-events-none mb-2">
          <span>+</span>
          <span>+</span>
          <span>+</span>
        </div>

        <div className="pointer-events-none text-center">
          <h1 className="text-8xl md:text-[25vw] leading-[0.8] font-black uppercase tracking-tighter text-muted-foreground/20">
            KAudit
          </h1>
        </div>

        <div className="flex justify-between items-center text-muted-foreground/40 font-mono text-2xl md:text-3xl pointer-events-none mt-2 mb-4">
          <span>+</span>
          <span>+</span>
          <span>+</span>
        </div>
      </div>
    </footer>
  )
}
