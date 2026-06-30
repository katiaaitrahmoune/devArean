export default function Cloud({
  top,
  size = 100,
  duration = 80,
  delay = 0,
}: {
  top: string
  size?: number
  duration?: number
  delay?: number
}) {
  return (
    <svg
      viewBox="0 0 100 50"
      width={size}
      className="cloud-drift absolute opacity-80 pointer-events-none"
      style={{
        top,
        left: "-15%",
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <path
        fill="#fff"
        d="M20 38c-9 0-16-6-16-14 0-7 5-12 12-13 2-7 9-11 16-11s14 4 16 11c9 0 16 6 16 14s-7 13-16 13H20z"
      />
    </svg>
  )
}