'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Lightbulb, Code, Rocket, Headphones } from 'lucide-react'

const steps = [
  {
    icon: MessageSquare,
    title: 'Discovery',
    description: 'We start by understanding your business, goals, and requirements through detailed discussions.',
  },
  {
    icon: Lightbulb,
    title: 'Planning',
    description: 'Our team creates a comprehensive project plan with timelines, milestones, and deliverables.',
  },
  {
    icon: Code,
    title: 'Development',
    description: 'We build your solution using agile methodology with regular updates and feedback loops.',
  },
  {
    icon: Rocket,
    title: 'Launch',
    description: 'After thorough testing, we deploy your solution and ensure a smooth launch.',
  },
  {
    icon: Headphones,
    title: 'Support',
    description: 'We provide ongoing support and maintenance to keep your solution running optimally.',
  },
]

export default function ServicesProcess() {
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
          <span className="text-violet-400 font-medium mb-4 block">Our Process</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How We <span className="gradient-text">Work</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our proven process ensures successful project delivery every time.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600/0 via-violet-600/50 to-violet-600/0 -translate-y-1/2" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative text-center"
              >
                <div className="relative z-10 w-16 h-16 rounded-full bg-violet-500/20 border-2 border-violet-500 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-violet-400" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-violet-600 text-white text-xs flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
