import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Cookie | Hilal Technologic',
  description: 'Kebijakan penggunaan cookie di situs web Hilal Technologic.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Kebijakan Cookie</h1>
        
        <div className="prose prose-invert prose-violet max-w-none space-y-8">
          <p className="text-lg text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Apa itu Cookie?</h2>
            <p className="text-muted-foreground">
              Cookie adalah file teks kecil yang disimpan di perangkat Anda saat Anda mengunjungi situs web. 
              Cookie membantu situs web mengingat preferensi Anda dan meningkatkan pengalaman pengguna.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Jenis Cookie yang Kami Gunakan</h2>
            
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <h3 className="text-lg font-medium text-violet-400">Cookie Esensial</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Cookie ini diperlukan agar situs web berfungsi dengan baik. Termasuk cookie untuk autentikasi, 
                  keamanan, dan preferensi dasar pengguna.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <h3 className="text-lg font-medium text-violet-400">Cookie Analitik</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Cookie ini membantu kami memahami bagaimana pengunjung berinteraksi dengan situs web kami, 
                  sehingga kami dapat meningkatkan layanan kami.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-card/50 border border-border">
                <h3 className="text-lg font-medium text-violet-400">Cookie Fungsional</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Cookie ini memungkinkan situs web mengingat pilihan yang Anda buat (seperti bahasa atau wilayah) 
                  dan menyediakan fitur yang ditingkatkan.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Mengelola Cookie</h2>
            <p className="text-muted-foreground">
              Anda dapat mengontrol dan mengelola cookie melalui pengaturan browser Anda. Perlu diingat bahwa 
              menonaktifkan cookie tertentu dapat memengaruhi fungsionalitas situs web kami.
            </p>
            <p className="text-muted-foreground">
              Berikut cara mengelola cookie di browser populer:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Chrome:</strong> Pengaturan → Privasi dan keamanan → Cookie</li>
              <li><strong>Firefox:</strong> Pengaturan → Privasi & Keamanan → Cookie</li>
              <li><strong>Safari:</strong> Preferensi → Privasi → Cookie</li>
              <li><strong>Edge:</strong> Pengaturan → Cookie dan izin situs</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Cookie Pihak Ketiga</h2>
            <p className="text-muted-foreground">
              Kami mungkin menggunakan layanan pihak ketiga yang juga menggunakan cookie, seperti:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Google Analytics untuk analisis lalu lintas</li>
              <li>Penyedia pembayaran untuk memproses transaksi</li>
              <li>Platform media sosial untuk fitur berbagi</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Perubahan Kebijakan</h2>
            <p className="text-muted-foreground">
              Kami dapat memperbarui kebijakan cookie ini dari waktu ke waktu. Perubahan akan dipublikasikan 
              di halaman ini dengan tanggal pembaruan yang baru.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Hubungi Kami</h2>
            <p className="text-muted-foreground">
              Jika Anda memiliki pertanyaan tentang kebijakan cookie kami, silakan hubungi kami di:
            </p>
            <p className="text-muted-foreground">
              Email: <a href="mailto:privacy@hilaltechnologic.com" className="text-violet-400 hover:text-violet-300">privacy@hilaltechnologic.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
