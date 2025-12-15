'use client'

import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const contactInfo = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@hilaltechnologic.com',
    href: 'mailto:hello@hilaltechnologic.com',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+62 812 3456 7890',
    href: 'tel:+6281234567890',
  },
  {
    icon: MapPin,
    title: 'Address',
    value: 'Jakarta, Indonesia',
    href: null,
  },
  {
    icon: Clock,
    title: 'Business Hours',
    value: 'Mon - Fri: 9:00 - 18:00',
    href: null,
  },
]

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="space-y-6"
    >
      <Card className="bg-card/50 border-border">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-4">
            {contactInfo.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.title}</p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="font-medium hover:text-violet-400 transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-violet-600 to-purple-600 border-0">
        <CardContent className="p-6 text-center">
          <MessageCircle className="w-12 h-12 text-white/80 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">
            Need Quick Response?
          </h3>
          <p className="text-white/80 text-sm mb-4">
            Chat with us directly on WhatsApp for faster response.
          </p>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="w-full bg-white text-violet-600 hover:bg-white/90">
              Chat on WhatsApp
            </Button>
          </a>
        </CardContent>
      </Card>

      <Card className="bg-card/50 border-border overflow-hidden">
        <div className="aspect-video bg-muted flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Map will be displayed here</p>
        </div>
      </Card>
    </motion.div>
  )
}
