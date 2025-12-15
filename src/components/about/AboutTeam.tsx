'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Linkedin, Twitter, Github, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface TeamMember {
  id: string
  name: string
  position: string | null
  bio: string | null
  image: string | null
  linkedin: string | null
  twitter: string | null
  github: string | null
}

export default function AboutTeam() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await fetch('/api/public/team')
        if (response.ok) {
          const data = await response.json()
          setTeam(data)
        }
      } catch (error) {
        console.error('Error fetching team:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTeam()
  }, [])

  // Don't render section if no team members
  if (!isLoading && team.length === 0) {
    return null
  }

  return (
    <section id="team" className="section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-violet-400 font-medium mb-4 block">Our Team</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Meet the <span className="gradient-text">Experts</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Our talented team of professionals is dedicated to delivering 
            exceptional results for every project.
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="p-6 rounded-2xl bg-card border border-border hover:border-violet-500/50 transition-all text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.image || ''} alt={member.name} />
                  <AvatarFallback className="bg-violet-500/20 text-violet-400 text-2xl">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-violet-400 text-sm mb-2">{member.position}</p>
                <p className="text-muted-foreground text-sm mb-4">{member.bio}</p>
                <div className="flex items-center justify-center gap-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-violet-400 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {member.twitter && (
                    <a
                      href={member.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-violet-400 transition-colors"
                    >
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {member.github && (
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-violet-400 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
