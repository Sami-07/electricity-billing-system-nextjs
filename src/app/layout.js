import { Work_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import NextAuthProvider from '@/provider/NextAuthProvider'

const worksans = Work_Sans({ subsets: ['latin'] })

export const metadata = {
  title: 'TSSPDCL College Project',
  description: 'TSSPDCL College Project built with Next.js and MongoDB',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <body suppressHydrationWarning={true} className={worksans.className}>
        <NextAuthProvider>

          <Navbar />

          {children}
          <Footer />
        </NextAuthProvider>
      </body>

    </html>
  )
}
