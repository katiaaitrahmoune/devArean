export default function BountyBanner() {
  return (
    <section className="max-w-[1180px] mx-auto px-5 pb-16">
      <div className="bg-[#fff8ec] border-[3px] border-[#2d2150] rounded-[20px] p-6 shadow-[0_5px_0_rgba(45,33,80,0.12)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="font-extrabold text-lg text-[#2d2150] mb-1">Open a Premium Bounty Room</h3>
          <p className="text-sm text-[#5b5180]">Stake into a paid challenge, split the prize pool with the victor, and get verified results via Stripe.</p>
        </div>
        <button className="font-bold text-sm text-[#4a3304] px-6 py-3 bg-gradient-to-b from-[#ffdb85] to-[#ffc94d] border-[3px] border-[#2d2150] rounded-2xl shadow-[0_5px_0_#e8a623] hover:-translate-y-px active:translate-y-1 active:shadow-[0_1px_0_#e8a623] transition-all whitespace-nowrap">
          View Bounties
        </button>
      </div>
    </section>
  )
}