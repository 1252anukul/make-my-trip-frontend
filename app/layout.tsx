import "./globals.css"
import Providers from "@/lib/providers"
import Navbar from "@/components/Navbar"

export const metadata = {
  title: "MakeMyTour",
  description: "Travel App",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>

          {/* Navbar */}
          <Navbar />

          {/* Page Content */}
          {children}

        </Providers>
      </body>
    </html>
  )
}