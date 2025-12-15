'use client'

import { motion } from 'framer-motion'
import { Target, Eye, Rocket } from 'lucide-react'

export default function AboutStory() {
  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Our <span className="gradient-text">Story</span>
            </h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded with a vision to bridge the gap between businesses and technology, 
                Hilal Technologic has grown from a small startup to a trusted IT partner 
                for companies across Indonesia.
              </p>
              <p>
                Our journey began with a simple belief: that every business, regardless 
                of size, deserves access to world-class technology solutions. Today, we 
                continue to uphold this belief by delivering innovative, scalable, and 
                cost-effective solutions.
              </p>
              <p>
                With a team of passionate developers, designers, and strategists, we've 
                successfully delivered over 100 projects, helping businesses achieve 
                their digital transformation goals.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid gap-6"
          >
            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower businesses with innovative technology solutions that drive 
                growth, efficiency, and competitive advantage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Eye className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
              <p className="text-muted-foreground">
                To be the leading technology partner for businesses in Southeast Asia, 
                known for excellence, innovation, and customer success.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Our Goal</h3>
              <p className="text-muted-foreground">
                To deliver 500+ successful projects by 2025 while maintaining our 
                commitment to quality and customer satisfaction.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
