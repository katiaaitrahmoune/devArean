import "./globals.css"

export const metadata = {
  title: "DevArena",
  description: "Real-time coding battles",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}