import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Kebijakan Privasi | Hilal Technologic',
  description: 'Kebijakan privasi Hilal Technologic mengenai pengumpulan dan penggunaan data pengguna.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Kebijakan Privasi</h1>
        
        <div className="prose prose-invert prose-violet max-w-none space-y-8">
          <p className="text-lg text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Informasi yang Kami Kumpulkan</h2>
            <p className="text-muted-foreground">
              Kami mengumpulkan informasi yang Anda berikan secara langsung kepada kami, termasuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Nama dan alamat email saat mendaftar akun</li>
              <li>Informasi profil yang Anda pilih untuk ditambahkan</li>
              <li>Informasi pembayaran saat melakukan transaksi</li>
              <li>Komunikasi yang Anda kirimkan kepada kami</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Penggunaan Informasi</h2>
            <p className="text-muted-foreground">
              Kami menggunakan informasi yang dikumpulkan untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Menyediakan, memelihara, dan meningkatkan layanan kami</li>
              <li>Memproses transaksi dan mengirimkan konfirmasi</li>
              <li>Mengirimkan pemberitahuan teknis dan pembaruan</li>
              <li>Merespons komentar dan pertanyaan Anda</li>
              <li>Mengirimkan informasi pemasaran (dengan persetujuan Anda)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Keamanan Data</h2>
            <p className="text-muted-foreground">
              Kami menerapkan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda 
              dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Ini termasuk enkripsi 
              data, firewall, dan kontrol akses yang ketat.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Berbagi Informasi</h2>
            <p className="text-muted-foreground">
              Kami tidak menjual atau menyewakan informasi pribadi Anda kepada pihak ketiga. 
              Kami hanya membagikan informasi dalam situasi berikut:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Dengan persetujuan Anda</li>
              <li>Untuk mematuhi kewajiban hukum</li>
              <li>Untuk melindungi hak dan keselamatan kami dan pengguna lain</li>
              <li>Dengan penyedia layanan yang membantu operasi kami</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Hak Anda</h2>
            <p className="text-muted-foreground">
              Anda memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Mengakses informasi pribadi yang kami miliki tentang Anda</li>
              <li>Meminta koreksi data yang tidak akurat</li>
              <li>Meminta penghapusan data Anda</li>
              <li>Menolak pemrosesan data untuk tujuan pemasaran</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Hubungi Kami</h2>
            <p className="text-muted-foreground">
              Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di:
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
