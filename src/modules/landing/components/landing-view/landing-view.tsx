'use client'

import { ReactLenis } from '@studio-freight/react-lenis'
import { ProgressBar, Navbar, Footer } from '../index'
import { HeroSection } from '../hero-section'
import { IntroSection } from '../intro-section'
import { CaseStudiesSection } from '../case-studies-section'
import { WorksSection } from '../works-section'
import { CarouselSection } from '../carousel-section'
import { useLandingView } from './use-landing-view'

export function LandingView() {
  useLandingView()

  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        touchMultiplier: 2,
      }}
    >
      <ProgressBar />
      <Navbar />

      <div className="relative z-10 overflow-x-hidden">
        <HeroSection />
        <IntroSection />
        <CaseStudiesSection />
        <WorksSection />
        <CarouselSection />
        <section className="h-svh pointer-events-none" />
      </div>
      <Footer />
    </ReactLenis>
  )
}
