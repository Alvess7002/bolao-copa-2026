import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Bolão Copa do Mundo FIFA 2026',
  description: 'O melhor bolão da Copa do Mundo FIFA 2026',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={cn("font-sans", geist.variable)}>
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 pb-20">
          {children}
        </main>
      </body>
    </html>
  )
}
