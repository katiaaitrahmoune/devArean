import MascotFox from "./MascotFox"
import Cloud from "./Cloud"

export default function Hero() {
  return (
    <section className="relative max-w-[1180px] mx-auto px-5 pt-16 pb-12 text-center flex flex-col items-center overflow-hidden">

      <Cloud top="5%" size={90} duration={70} delay={0} />
      <Cloud top="14%" size={75} duration={95} delay={-30} />
      <Cloud top="2%" size={60} duration={110} delay={-60} />

      <span className="font-bold text-xs tracking-[0.04em] uppercase text-[#7148b0] mb-3">
        REAL-TIME CODING BATTLES
      </span>

      <h1 className="font-extrabold text-4xl md:text-[44px] text-[#2d2150] leading-tight">
        Code. Compete.
      </h1>
      <h1 className="font-extrabold text-4xl md:text-[44px] text-[#e8691b] leading-tight mb-4">
        Conquer.
      </h1>

      <p className="text-[#5b5180] text-base max-w-xl mb-8 leading-relaxed">
        Step into live coding duels, earn rank as you climb the leaderboard,
        and let the AI Oracle reveal what your code is really worth.
      </p>

      <div className="mb-6">
        <MascotFox size={130} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
       <a href="/login" className="font-bold text-sm text-[#08323a] px-6 py-3 bg-gradient-to-b from-[#5fe0e6] to-[#2bc7ce] border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#1a9aa1] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#1a9aa1] transition-all">
  Enter the Arena
</a>
        <a href="/battle" className="font-bold text-sm text-[#2d2150] px-6 py-3 bg-white border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#8a82ab] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#8a82ab] transition-all">
          Watch a Battle
        </a>
      </div>

      {/* .live-strip — petites stats horizontales, font 13px, séparées */}
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] text-[#5b5180] font-medium">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#48b830] inline-block animate-pulse" />
          <b className="text-[#2d2150]">342</b> battles fought today
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="8" r="3" /><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" /><circle cx="17" cy="9" r="2.4" /><path d="M16 14.2c2.3.4 4 2.4 4 4.8" />
          </svg>
          <b className="text-[#2d2150]">1,204</b> warriors online
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#e8a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12l4 6-10 12L2 9l4-6z" /><path d="M2 9h20M9 3l-2 6 5 12 5-12-2-6" />
          </svg>
          <b className="text-[#2d2150]">$890</b> in active prize pools
        </span>
      </div>

    </section>
  )
}