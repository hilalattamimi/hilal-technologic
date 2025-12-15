'use client'

import { motion } from 'framer-motion'

export default function AboutHero() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-background to-background" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[128px]" />
      
      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <span className="text-violet-400 font-medium mb-4 block">About Us</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            We Build{' '}
            <span className="gradient-text">Digital Excellence</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Hilal Technologic is a leading IT solutions company dedicated to helping 
            businesses transform and thrive in the digital age.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
