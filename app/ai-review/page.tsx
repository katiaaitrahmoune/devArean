import Navbar from "../components/Navbar"

const TESTS = [
  "Test 1 — basic pair",
  "Test 2 — negative values",
  "Test 3 — duplicates",
  "Test 4 — large input",
  "Test 5 — no match",
]

const FEEDBACK = [
  {
    icon: "✓",
    iconBg: "linear-gradient(160deg,#94ec79,#6fd957)",
    title: "Optimal approach",
    titleColor: "#48b830",
    text: "Using a HashMap for O(1) lookups is the ideal strategy here. You correctly identified that complement lookup beats nested loops.",
  },
  {
    icon: "!",
    iconBg: "linear-gradient(160deg,#ffdb85,#ffc94d)",
    title: "Minor suggestion",
    titleColor: "#e8a623",
    text: "Consider early exit if nums.length < 2. Also, naming seen as map or indexMap is more explicit.",
  },
  {
    icon: "→",
    iconBg: "linear-gradient(160deg,#5fe0e6,#2bc7ce)",
    title: "Next challenge",
    titleColor: "#1a9aa1",
    text: "You're ready for 3Sum — same HashMap principle but with deduplication logic. Try it in your next battle!",
  },
]

export default function AIReviewPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar active="Battle" />

      <div className="max-w-[1180px] mx-auto px-5 py-8">

        {/* ── Battle context header ── */}
        {/* panel: padding 16px 20px, bg gradient #f3eeff→cream, border 3px, radius 20px */}
        <div className="flex items-center gap-4 p-[16px_20px] mb-4 bg-white border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)]" style={{background:"linear-gradient(160deg,#f3eeff,#fff8ec)"}}>

          {/* flame icon — 48x48, radius 14px, purple gradient */}
          <div className="w-[48px] h-[48px] rounded-[14px] grid place-items-center flex-shrink-0 border-[2.5px] border-[#2d2150]" style={{background:"linear-gradient(160deg,#a98cf5,#9b6bd9)"}}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="white">
              <path d="M12 2c2 3-1 4-1 7a3 3 0 106 0c0-1 0-2-1-3 2 1 4 4 4 7a8 8 0 11-16 0c0-4 3-6 5-8 1-1 2-2 3-3z"/>
            </svg>
          </div>

          <div className="flex-1">
            {/* .eyebrow — font-bold, 12px, uppercase, purple, tracking .04em */}
            <div className="font-bold text-[12px] uppercase tracking-[0.04em] text-[#7148b0]">AI Oracle — post-battle review</div>
            <h2 className="font-extrabold text-[18px] text-[#2d2150] mt-[2px]">Two Sum · You won 🎉</h2>
          </div>

          {/* Score + XP cards */}
          <div className="flex gap-[10px]">
            <div className="bg-white border-[3px] border-[#2d2150] rounded-[16px] shadow-[0_4px_0_rgba(45,33,80,0.1)] px-4 py-[10px] text-center">
              <div className="font-extrabold text-[20px] text-[#48b830] leading-none">A+</div>
              <div className="font-semibold text-[10px] text-[#8a82ab] mt-1">Score</div>
            </div>
            <div className="bg-white border-[3px] border-[#2d2150] rounded-[16px] shadow-[0_4px_0_rgba(45,33,80,0.1)] px-4 py-[10px] text-center">
              <div className="font-extrabold text-[20px] text-[#1a9aa1] leading-none">+120</div>
              <div className="font-semibold text-[10px] text-[#8a82ab] mt-1">XP earned</div>
            </div>
          </div>
        </div>

        {/* ── Grid: code panel + complexity/tests ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* Code panel — dark bg, ink header */}
          <div className="bg-white border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] overflow-hidden">
            {/* header — bg ink dark, font-mono */}
            <div className="flex justify-between items-center px-4 py-[10px] rounded-t-[17px]" style={{background:"#2d2150"}}>
              <span className="font-mono font-semibold text-[12px] text-white">Your solution</span>
              <span className="font-mono text-[11px] text-[#8a82ab]">main.js</span>
            </div>
            {/* code — bg #1e1b2e, font-mono 12px, line-height 1.7 */}
            <div className="px-4 py-4 font-mono text-[12px] leading-[1.7] text-[#ccc]" style={{background:"#1e1b2e"}}>
              <div><span style={{color:"#c792ea"}}>function</span> <span style={{color:"#82aaff"}}>twoSum</span><span>(nums, target) {"{"}</span></div>
              <div>&nbsp;&nbsp;<span style={{color:"#c792ea"}}>const</span><span> seen = </span><span style={{color:"#c792ea"}}>new</span><span> Map();</span></div>
              <div>&nbsp;&nbsp;<span style={{color:"#c792ea"}}>for</span><span> (</span><span style={{color:"#c792ea"}}>let</span><span> i = </span><span style={{color:"#f78c6c"}}>0</span><span>; i &lt; nums.length; i++) {"{"}</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"#c792ea"}}>const</span><span> need = target - nums[i];</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span style={{color:"#c792ea"}}>if</span><span> (seen.has(need)) </span><span style={{color:"#c792ea"}}>return</span><span> [seen.get(need), i];</span></div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;<span>seen.set(nums[i], i);</span></div>
              <div>&nbsp;&nbsp;{"}"}</div>
              <div>{"}"}</div>
            </div>
          </div>

          {/* Right col: complexity + test results */}
          <div className="flex flex-col gap-3">

            {/* Complexity analysis */}
            <div className="bg-white border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] p-4">
              <div className="font-bold text-[12px] uppercase tracking-[0.04em] text-[#7148b0] mb-2">Complexity analysis</div>
              <div className="flex gap-[10px] mb-3">
                <div className="flex-1 text-center p-[10px] bg-white border-2 border-[#2d2150] rounded-xl shadow-[0_3px_0_rgba(45,33,80,0.1)]">
                  <div className="font-mono font-bold text-[16px] text-[#48b830]">O(n)</div>
                  <div className="font-semibold text-[10px] text-[#8a82ab] mt-[2px]">Time</div>
                </div>
                <div className="flex-1 text-center p-[10px] bg-white border-2 border-[#2d2150] rounded-xl shadow-[0_3px_0_rgba(45,33,80,0.1)]">
                  <div className="font-mono font-bold text-[16px] text-[#1a9aa1]">O(n)</div>
                  <div className="font-semibold text-[10px] text-[#8a82ab] mt-[2px]">Space</div>
                </div>
              </div>
              <p className="text-[12px] text-[#5b5180] leading-[1.6]">Single-pass with a hash map. Optimal for this problem — you avoided the O(n²) brute-force nested loop.</p>
            </div>

            {/* Test results */}
            <div className="bg-white border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] p-4">
              <div className="font-bold text-[12px] uppercase tracking-[0.04em] text-[#7148b0] mb-2">Test results</div>
              <div className="flex flex-col gap-[6px]">
                {TESTS.map((t) => (
                  <div key={t} className="flex justify-between items-center px-[10px] py-[6px] border border-[#48b830] rounded-[10px]" style={{background:"#d4f7c9"}}>
                    <span className="font-semibold text-[12px] text-[#2d2150]">{t}</span>
                    <span className="font-bold text-[11px] text-[#48b830]">✓ Passed</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Oracle feedback ── */}
        <div className="border-[3px] border-[#2d2150] rounded-[20px] shadow-[0_5px_0_rgba(45,33,80,0.12)] p-5 mb-4" style={{background:"linear-gradient(160deg,#f3eeff,#fff8ec)"}}>

          {/* Oracle header */}
          <div className="flex items-center gap-3 mb-[14px]">
            <div className="w-[38px] h-[38px] rounded-[12px] grid place-items-center flex-shrink-0 border-[2.5px] border-[#2d2150]" style={{background:"linear-gradient(160deg,#a98cf5,#9b6bd9)"}}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <path d="M12 2c2 3-1 4-1 7a3 3 0 106 0c0-1 0-2-1-3 2 1 4 4 4 7a8 8 0 11-16 0c0-4 3-6 5-8 1-1 2-2 3-3z"/>
              </svg>
            </div>
            <div>
              <div className="font-bold text-[12px] uppercase tracking-[0.04em] text-[#7148b0]">Oracle says</div>
              <div className="font-extrabold text-[14px] text-[#2d2150] mt-[1px]">Code quality feedback</div>
            </div>
          </div>

          {/* Feedback cards */}
          <div className="flex flex-col gap-[10px]">
            {FEEDBACK.map((f) => (
              <div key={f.title} className="bg-white border-2 border-[#2d2150] rounded-[14px] shadow-[0_3px_0_rgba(45,33,80,0.08)] px-[14px] py-3">
                <div className="flex items-center gap-2 mb-[6px]">
                  <span className="w-[22px] h-[22px] rounded-[8px] grid place-items-center text-[10px] text-white border-2 border-[#2d2150]" style={{background: f.iconBg}}>
                    {f.icon}
                  </span>
                  <span className="font-extrabold text-[13px]" style={{color: f.titleColor}}>{f.title}</span>
                </div>
                <p className="text-[12px] text-[#5b5180] leading-[1.6] m-0">{f.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Action buttons ── */}
        <div className="flex gap-3 justify-center flex-wrap">
          <a href="/lobby" className="font-bold text-[14px] text-[#08323a] px-6 py-3 bg-gradient-to-b from-[#5fe0e6] to-[#2bc7ce] border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#1a9aa1] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#1a9aa1] transition-all">New battle</a>
          <a href="/lobby" className="font-bold text-[14px] text-[#4a3304] px-6 py-3 bg-gradient-to-b from-[#ffdb85] to-[#ffc94d] border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#e8a623] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#e8a623] transition-all">Practice mode</a>
          <button className="font-bold text-[14px] text-[#2d2150] px-6 py-3 bg-white border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#8a82ab] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#8a82ab] transition-all">View opponent&apos;s code</button>
        </div>

      </div>
    </main>
  )
}