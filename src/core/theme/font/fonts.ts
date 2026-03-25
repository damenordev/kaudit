import { Geist, Geist_Mono, Inter, Lora, Outfit, Playfair_Display } from 'next/font/google'

export const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

/**
 * Space-separated CSS variable names for all loaded fonts.
 * Apply to `<html className={fontVariables}>` so Tailwind and theme font groups can use them.
 */
export const fontVariables = [
  geistSans.variable,
  geistMono.variable,
  inter.variable,
  lora.variable,
  outfit.variable,
  playfair.variable,
].join(' ')
