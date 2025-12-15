# Hilal Technologic Website

Website Company Profile + E-commerce untuk Hilal Technologic dengan tema Dark Mode + Violet Neon.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Animations**: Framer Motion

## Features

### Public Pages
- Homepage dengan Hero, Services, Portfolio, Testimonials
- About - Company profile, visi misi, team
- Services - Daftar layanan IT
- Portfolio - Showcase proyek
- Products - E-commerce catalog
- Blog - Artikel teknologi
- Contact - Form kontak dengan WhatsApp integration

### Admin Dashboard (CMS)
- Dashboard dengan statistik
- Products management
- Categories management
- Orders management
- Services management
- Portfolio management
- Blog management
- Team management
- Testimonials management
- Messages management
- Hero Slides management
- Site Settings

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env` file dan isi dengan kredensial Supabase Anda:

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

### 3. Setup Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Create Admin User

Jalankan script untuk membuat admin user:

```bash
npx ts-node scripts/create-admin.ts
```

Atau buat manual di database dengan role `ADMIN`.

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── (main)/          # Public pages
│   ├── admin/           # Admin dashboard
│   ├── api/             # API routes
│   └── auth/            # Auth pages
├── components/
│   ├── admin/           # Admin components
│   ├── layout/          # Layout components
│   ├── sections/        # Homepage sections
│   └── ui/              # UI components (shadcn)
├── lib/                 # Utilities
└── types/               # TypeScript types
```

## License

MIT
