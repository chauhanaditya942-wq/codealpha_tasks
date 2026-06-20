export default function SilhouetteSVG() {
  return (
    <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-[160px_160px_0_0] overflow-hidden bg-slate-900 dark:bg-black self-end">

      {/* Ambient glow layers */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_30%,rgba(255,255,255,0.06)_0%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_80%_80%,rgba(255,140,0,0.1)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_20%_70%,rgba(59,130,246,0.08)_0%,transparent_55%)]" />

      {/* Scanline animation */}
      <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[scan_4s_ease-in-out_infinite]" />

      {/* Light streak */}
      <div className="absolute top-0 bottom-0 left-[30%] w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

      {/* Floating particles */}
      {[
        { top: "15%", left: "20%", size: 3, delay: "0.2s" },
        { top: "25%", left: "75%", size: 2, delay: "0.8s" },
        { top: "10%", left: "55%", size: 4, delay: "1.2s" },
        { top: "40%", left: "15%", size: 2, delay: "0.5s" },
        { top: "60%", left: "80%", size: 3, delay: "1.5s" },
        { top: "70%", left: "30%", size: 2, delay: "0.9s" },
        { top: "20%", left: "85%", size: 5, delay: "0.3s" },
        { top: "50%", left: "60%", size: 2, delay: "1.8s" },
      ].map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-white/40 animate-[twinkle_3s_ease-in-out_infinite]"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* SVG Silhouette */}
      <svg
        viewBox="0 0 300 420"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-[90%]"
      >
        {/* Body */}
        <path d="M90 420 L90 280 Q90 240 110 230 L130 225 Q150 220 170 225 L190 230 Q210 240 210 280 L210 420 Z" fill="#1a1a1a" />
        <path d="M110 230 L130 225 L150 235 L170 225 L190 230 Q200 245 195 270 L175 265 L150 270 L125 265 L105 270 Q100 245 110 230 Z" fill="#222" />
        <line x1="150" y1="235" x2="150" y2="420" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        {/* Neck */}
        <rect x="138" y="195" width="24" height="32" rx="8" fill="#1a1a1a" />
        {/* Head */}
        <ellipse cx="150" cy="175" rx="38" ry="44" fill="#1c1c1c" />
        {/* Hair */}
        <path d="M112 165 Q115 130 150 128 Q185 130 188 165 Q182 148 170 145 Q158 140 150 142 Q138 140 130 145 Q118 148 112 165 Z" fill="#0d0d0d" />
        <path d="M112 165 Q108 155 112 145 Q115 138 120 140" stroke="#0d0d0d" strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M188 165 Q192 155 188 145 Q185 138 180 140" stroke="#0d0d0d" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* Eyes */}
        <ellipse cx="138" cy="172" rx="5" ry="4" fill="#0a0a0a" />
        <ellipse cx="162" cy="172" rx="5" ry="4" fill="#0a0a0a" />
        <circle cx="140" cy="170" r="1.5" fill="rgba(255,255,255,0.5)" />
        <circle cx="164" cy="170" r="1.5" fill="rgba(255,255,255,0.5)" />
        {/* Glasses */}
        <rect x="130" y="167" width="18" height="12" rx="4" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
        <rect x="152" y="167" width="18" height="12" rx="4" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" fill="rgba(255,255,255,0.03)" />
        <line x1="148" y1="173" x2="152" y2="173" stroke="rgba(255,255,255,0.22)" strokeWidth="1.5" />
        <line x1="130" y1="173" x2="124" y2="172" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        <line x1="170" y1="173" x2="176" y2="172" stroke="rgba(255,255,255,0.18)" strokeWidth="1.2" />
        {/* Nose & mouth */}
        <path d="M148 178 Q150 183 152 178" stroke="rgba(255,255,255,0.08)" strokeWidth="1" fill="none" />
        <path d="M143 188 Q150 192 157 188" stroke="rgba(255,255,255,0.13)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        {/* Arms */}
        <path d="M105 270 Q85 300 80 340 Q78 360 82 380 L95 378 Q93 360 96 340 Q102 305 118 275 Z" fill="#1a1a1a" />
        <ellipse cx="88" cy="384" rx="10" ry="8" fill="#1c1c1c" />
        <path d="M195 270 Q215 295 222 330 Q226 355 220 375 L208 373 Q214 355 210 332 Q204 300 182 272 Z" fill="#1a1a1a" />
        <ellipse cx="214" cy="379" rx="10" ry="8" fill="#1c1c1c" />
        {/* Laptop */}
        <rect x="72" y="358" width="32" height="22" rx="3" fill="#222" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
        <rect x="74" y="360" width="28" height="16" rx="1" fill="#0d0d0d" />
        <rect x="74" y="360" width="28" height="16" rx="1" fill="rgba(59,130,246,0.07)" />
        <line x1="76" y1="363" x2="88" y2="363" stroke="rgba(100,200,255,0.4)" strokeWidth="1" />
        <line x1="76" y1="366" x2="84" y2="366" stroke="rgba(255,150,100,0.4)" strokeWidth="1" />
        <line x1="76" y1="369" x2="90" y2="369" stroke="rgba(100,200,255,0.3)" strokeWidth="1" />
        <line x1="76" y1="372" x2="82" y2="372" stroke="rgba(150,255,150,0.3)" strokeWidth="1" />
        {/* VS Code icon hint on screen */}
        <text x="91" y="373" fontSize="5" fill="rgba(100,160,255,0.5)" fontFamily="monospace">&lt;/&gt;</text>
        {/* Edge highlights */}
        <path d="M112 230 Q95 270 90 320 Q88 360 90 420" stroke="rgba(255,255,255,0.04)" strokeWidth="2" fill="none" />
        <path d="M188 230 Q205 270 210 320 Q212 360 210 420" stroke="rgba(255,255,255,0.03)" strokeWidth="2" fill="none" />
        {/* Ground shadow */}
        <ellipse cx="150" cy="418" rx="80" ry="5" fill="rgba(0,0,0,0.6)" />
      </svg>

      {/* Rotating badge */}
      <div className="absolute bottom-8 -left-5 w-[110px] h-[110px]">
        <div className="relative w-full h-full animate-[spin_14s_linear_infinite]">
          <svg viewBox="0 0 110 110" className="w-full h-full">
            <defs>
              <path id="bp" d="M 55,55 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
            </defs>
            <circle cx="55" cy="55" r="53" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            <text fontSize="8.5" fill="rgba(255,255,255,0.7)" fontFamily="Syne,sans-serif" fontWeight="700" letterSpacing="3">
              <textPath href="#bp">Full Stack Dev · Digital Marketing ·</textPath>
            </text>
          </svg>
        </div>
        {/* Center button — counter-rotates */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-slate-900 text-[9px] font-black text-center leading-tight animate-[spin_14s_linear_infinite_reverse]">
            Hire<br />Me
          </div>
        </div>
      </div>

      {/* Bottom reflection */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/5 to-transparent" />
    </div>
  );
}