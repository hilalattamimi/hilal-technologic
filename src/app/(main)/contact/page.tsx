import { Metadata } from 'next'
import ContactHero from '@/components/contact/ContactHero'
import ContactForm from '@/components/contact/ContactForm'
import ContactInfo from '@/components/contact/ContactInfo'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://hilaltechnologic.com'

export const metadata: Metadata = {
  title: 'Hubungi Kami - Konsultasi IT Gratis',
  description: 'Hubungi Hilal Technologic untuk konsultasi IT gratis. Kami siap membantu kebutuhan website, aplikasi mobile, dan solusi digital bisnis Anda. Respon cepat via WhatsApp.',
  keywords: [
    'Hubungi Hilal Technologic',
    'Konsultasi IT Gratis',
    'Jasa IT Indonesia',
    'Kontak Software House',
    'WhatsApp IT Consultant',
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Hubungi Kami - Hilal Technologic',
    description: 'Konsultasi IT gratis untuk kebutuhan website dan aplikasi bisnis Anda.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="section-padding pt-8">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
            <div>
              <ContactInfo />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
