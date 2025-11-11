import './globals.css'
import { Inter, Inknut_Antiqua } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })
const inknut = Inknut_Antiqua({ subsets: ['latin'], weight: ['400', '700'] })
const geistSans = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata = {
  title: 'Idea Star',
  description: 'A platform for managing and sharing ideas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inknut.className}>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${inter.className}`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  )
}