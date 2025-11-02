# ✅ Checklist Deployment Vercel - Bukadita Admin v2

## 📋 Persiapan Sebelum Deploy

### 1. ✅ Build Berhasil (SUDAH SELESAI)

- [x] `npm run build` berhasil tanpa error
- [x] Semua TypeScript errors sudah diperbaiki
- [x] Warnings yang ada hanya minor (tidak menghalangi deployment)

### 2. 🔐 Environment Variables

Buat file `.env.local` untuk development dan siapkan environment variables untuk Vercel:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.vercel.app
# atau
NEXT_PUBLIC_API_URL=https://your-custom-api-domain.com

# Supabase Configuration (jika digunakan)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Bukadita Admin
NEXT_PUBLIC_APP_URL=https://admin.bukadita.com
```

**⚠️ PENTING:** Jangan commit file `.env.local` ke git!

### 3. 📁 Vercel Configuration

Buat/update file `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url"
  }
}
```

### 4. 📦 Package.json Scripts

Pastikan scripts sudah lengkap (sudah ada):

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

## 🚀 Langkah-langkah Deploy ke Vercel

### Opsi A: Deploy via Vercel CLI (Desktop)

1. **Install Vercel CLI**

```bash
npm install -g vercel
```

2. **Login ke Vercel**

```bash
vercel login
```

3. **Deploy ke Vercel**

```bash
# Di folder bukadita-admin-v2
cd "D:\....Bismillah Sempro\Bukadita REVISI\bukadita-admin-v2"

# Deploy preview
vercel

# Deploy production
vercel --prod
```

4. **Set Environment Variables**

```bash
# Set environment variables via CLI
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### Opsi B: Deploy via Vercel Dashboard

1. **Buka Vercel Dashboard**

   - Kunjungi https://vercel.com
   - Login dengan akun GitHub/GitLab/Bitbucket

2. **Import Project**

   - Klik "Add New" → "Project"
   - Import repository dari GitHub
   - Atau upload folder secara manual

3. **Configure Project**

   - Framework Preset: Next.js
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

4. **Set Environment Variables**

   - Masuk ke Settings → Environment Variables
   - Tambahkan semua environment variables yang diperlukan
   - Pilih environment: Production, Preview, Development

5. **Deploy**
   - Klik "Deploy"
   - Tunggu proses build selesai

## 🔗 Integrasi dengan API Backend

### 1. Deploy API Backend Terlebih Dahulu

Pastikan `bukadita-api-v2` sudah di-deploy dan berjalan:

```bash
cd "D:\....Bismillah Sempro\Bukadita REVISI\bukadita-api-v2"
vercel --prod
```

### 2. Update Environment Variables

Setelah API di-deploy, update `NEXT_PUBLIC_API_URL` dengan URL API yang baru:

```bash
# Via CLI
vercel env add NEXT_PUBLIC_API_URL production

# Atau via Dashboard
# Settings → Environment Variables → Edit NEXT_PUBLIC_API_URL
```

### 3. Redeploy Admin

```bash
vercel --prod
```

## 🔍 Troubleshooting

### Build Error di Vercel

**Jika build gagal dengan error "Module not found":**

1. Pastikan semua dependencies ada di `package.json`
2. Hapus `node_modules` dan `package-lock.json`
3. Run `npm install` ulang
4. Commit dan push perubahan

**Jika build gagal dengan TypeScript error:**

1. Run `npm run build` di local
2. Fix semua error yang muncul
3. Commit dan push

### Environment Variables Tidak Terbaca

**Pastikan:**

- Environment variables di-prefix dengan `NEXT_PUBLIC_` untuk client-side
- Variables sudah di-set di Vercel Dashboard
- Sudah redeploy setelah menambah/mengubah env vars

### CORS Error

**Jika ada CORS error saat connect ke API:**

1. Tambahkan domain Vercel ke CORS whitelist di API
2. Update file API `cors` configuration:

```typescript
const corsOptions = {
  origin: [
    "http://localhost:3000",
    "https://your-admin-domain.vercel.app",
    "https://admin.bukadita.com",
  ],
  credentials: true,
};
```

## 📊 Post-Deployment Checklist

- [ ] Website bisa diakses di URL Vercel
- [ ] Login berhasil (koneksi ke API OK)
- [ ] Semua halaman bisa diakses tanpa error
- [ ] Data bisa ditampilkan dari API
- [ ] CRUD operations berfungsi normal
- [ ] Upload file/media berfungsi (jika ada)
- [ ] Session/Auth persisten
- [ ] Custom domain sudah di-setup (opsional)

## 🎯 Optimasi Production

### 1. Custom Domain

1. Beli domain di Namecheap/GoDaddy/etc
2. Di Vercel Dashboard → Settings → Domains
3. Tambah custom domain: `admin.bukadita.com`
4. Update DNS records sesuai instruksi Vercel
5. Tunggu propagasi DNS (5-48 jam)

### 2. Performance Optimization

Sudah dioptimasi dengan:

- ✅ Next.js 15 dengan Turbopack
- ✅ Automatic code splitting
- ✅ Image optimization
- ✅ Server-side rendering (SSR)

### 3. Monitoring

Setup monitoring di:

- Vercel Analytics (built-in)
- Google Analytics (optional)
- Sentry untuk error tracking (optional)

## 🔒 Security Checklist

- [ ] `.env.local` tidak di-commit ke Git
- [ ] API keys tidak hardcoded di code
- [ ] CORS sudah dikonfigurasi dengan benar
- [ ] Authentication middleware berfungsi
- [ ] Rate limiting di-enable di API
- [ ] HTTPS enforced (otomatis di Vercel)

## 📞 Support

Jika ada masalah:

1. Check Vercel deployment logs
2. Check browser console untuk error
3. Check API logs untuk backend issues
4. Dokumentasi Vercel: https://vercel.com/docs

---

**Status:** ✅ Build berhasil - Siap untuk deployment!
**Last Updated:** 2 November 2025
