'use client'

import { motion } from 'framer-motion'

export default function PortfolioHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-violet-400 font-medium mb-4 block">Our Portfolio</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our{' '}
            <span className="gradient-text">Success Stories</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Discover how we&apos;ve helped businesses transform their digital presence 
            and achieve remarkable results.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
