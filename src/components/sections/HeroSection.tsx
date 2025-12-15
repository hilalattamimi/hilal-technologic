'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Play, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HeroSlide {
  id: string
  title: string
  subtitle: string | null
  description: string | null
  buttonText: string | null
  buttonLink: string | null
  image: string | null
}

export default function HeroSection() {
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/hero-slides')
      .then(res => res.json())
      .then(data => {
        setSlides(data.slides || [])
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  useEffect(() => {
    if (slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const activeSlide = slides[currentSlide]
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />

      <div className="container-custom relative z-10 pt-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Dynamic Content from Database or Default */}
          <AnimatePresence mode="wait">
            {slides.length > 0 && activeSlide ? (
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Badge */}
                {activeSlide.subtitle && (
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
                    <span className="w-2 h-2 bg-violet-500 rounded-full mr-2 animate-pulse" />
                    {activeSlide.subtitle}
                  </span>
                )}

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  {activeSlide.title.split(' ').slice(0, -2).join(' ')}{' '}
                  <span className="gradient-text glow-text">
                    {activeSlide.title.split(' ').slice(-2).join(' ')}
                  </span>
                </h1>

                {/* Description */}
                {activeSlide.description && (
                  <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    {activeSlide.description}
                  </p>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  {activeSlide.buttonText && activeSlide.buttonLink && (
                    <Link href={activeSlide.buttonLink}>
                      <Button className="btn-primary text-base px-8 py-6">
                        {activeSlide.buttonText}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  )}
                  <Link href="/portfolio">
                    <Button variant="ghost" className="btn-secondary text-base px-8 py-6">
                      <Play className="mr-2 w-5 h-5" />
                      View Our Work
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Default Content */}
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
                  <span className="w-2 h-2 bg-violet-500 rounded-full mr-2 animate-pulse" />
                  Welcome to Hilal Technologic
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
                  Transforming Ideas Into{' '}
                  <span className="gradient-text glow-text">Digital Reality</span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                  We build innovative software solutions, stunning websites, and powerful mobile apps 
                  that help businesses grow and succeed in the digital age.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/contact">
                    <Button className="btn-primary text-base px-8 py-6">
                      Start Your Project
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/portfolio">
                    <Button variant="ghost" className="btn-secondary text-base px-8 py-6">
                      <Play className="mr-2 w-5 h-5" />
                      View Our Work
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Slide Navigation */}
          {slides.length > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-violet-400" />
              </button>
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentSlide ? 'bg-violet-500' : 'bg-violet-500/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-violet-500/10 hover:bg-violet-500/20 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-violet-400" />
              </button>
            </div>
          )}

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { value: '100+', label: 'Projects Completed' },
              { value: '50+', label: 'Happy Clients' },
              { value: '5+', label: 'Years Experience' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-violet-500 rounded-full"
          />
        </div>
      </motion.div>
    </section>
  )
}
