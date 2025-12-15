'use client'

import { motion } from 'framer-motion'
import { Lightbulb, Users, Shield, Zap, Heart, Award } from 'lucide-react'

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly explore new technologies and approaches to deliver cutting-edge solutions.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with our clients, treating their success as our own.',
  },
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We maintain the highest ethical standards in all our business dealings.',
  },
  {
    icon: Zap,
    title: 'Excellence',
    description: 'We strive for excellence in every project, no matter how big or small.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We are passionate about technology and its potential to transform businesses.',
  },
  {
    icon: Award,
    title: 'Quality',
    description: 'We never compromise on quality, ensuring every deliverable meets the highest standards.',
  },
]

export default function AboutValues() {
  return (
    <section className="section-padding bg-card/50">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-violet-400 font-medium mb-4 block">Our Values</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            What <span className="gradient-text">Drives Us</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our core values guide everything we do, from how we work with clients 
            to how we build our solutions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-background border border-border hover:border-violet-500/50 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-4">
                <value.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-muted-foreground">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
