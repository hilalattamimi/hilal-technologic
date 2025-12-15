import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Syarat & Ketentuan | Hilal Technologic',
  description: 'Syarat dan ketentuan penggunaan layanan Hilal Technologic.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 gradient-text">Syarat & Ketentuan</h1>
        
        <div className="prose prose-invert prose-violet max-w-none space-y-8">
          <p className="text-lg text-muted-foreground">
            Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">1. Penerimaan Syarat</h2>
            <p className="text-muted-foreground">
              Dengan mengakses dan menggunakan layanan Hilal Technologic, Anda menyetujui untuk terikat 
              oleh syarat dan ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari syarat ini, 
              Anda tidak boleh menggunakan layanan kami.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">2. Layanan Kami</h2>
            <p className="text-muted-foreground">
              Hilal Technologic menyediakan layanan pengembangan web, aplikasi mobile, dan solusi teknologi lainnya. 
              Kami berhak untuk memodifikasi atau menghentikan layanan kapan saja tanpa pemberitahuan sebelumnya.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">3. Akun Pengguna</h2>
            <p className="text-muted-foreground">
              Untuk menggunakan beberapa fitur layanan kami, Anda mungkin perlu membuat akun. Anda bertanggung jawab untuk:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Menjaga kerahasiaan kata sandi akun Anda</li>
              <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
              <li>Memberikan informasi yang akurat dan terkini</li>
              <li>Memberitahu kami segera jika ada penggunaan tidak sah</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">4. Pembayaran dan Pengembalian Dana</h2>
            <p className="text-muted-foreground">
              Semua pembayaran harus dilakukan sesuai dengan ketentuan yang disepakati dalam kontrak proyek. 
              Kebijakan pengembalian dana akan ditentukan berdasarkan kesepakatan individual untuk setiap proyek.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">5. Hak Kekayaan Intelektual</h2>
            <p className="text-muted-foreground">
              Semua konten, desain, dan kode yang dibuat oleh Hilal Technologic tetap menjadi milik kami 
              sampai pembayaran penuh diterima. Setelah pembayaran penuh, hak kepemilikan akan dialihkan 
              sesuai dengan perjanjian proyek.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">6. Batasan Tanggung Jawab</h2>
            <p className="text-muted-foreground">
              Hilal Technologic tidak bertanggung jawab atas kerugian tidak langsung, insidental, khusus, 
              atau konsekuensial yang timbul dari penggunaan layanan kami. Tanggung jawab maksimum kami 
              terbatas pada jumlah yang Anda bayarkan untuk layanan tersebut.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">7. Perubahan Syarat</h2>
            <p className="text-muted-foreground">
              Kami berhak untuk memperbarui syarat dan ketentuan ini kapan saja. Perubahan akan berlaku 
              segera setelah dipublikasikan di situs web kami. Penggunaan berkelanjutan atas layanan kami 
              setelah perubahan tersebut merupakan penerimaan Anda terhadap syarat yang diperbarui.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">8. Hubungi Kami</h2>
            <p className="text-muted-foreground">
              Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, silakan hubungi kami di:
            </p>
            <p className="text-muted-foreground">
              Email: <a href="mailto:legal@hilaltechnologic.com" className="text-violet-400 hover:text-violet-300">legal@hilaltechnologic.com</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
