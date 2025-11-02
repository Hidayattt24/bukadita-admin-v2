# 🚀 Quick Start - Deploy ke Vercel

## ⚡ Persiapan Cepat (5 Menit)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Setup Environment Variables

Copy file `.env.example` menjadi `.env.local`:

```bash
cd "D:\....Bismillah Sempro\Bukadita REVISI\bukadita-admin-v2"
copy .env.example .env.local
```

Edit `.env.local` dan isi nilai yang sebenarnya:

- `NEXT_PUBLIC_API_URL` → URL API backend Anda
- `NEXT_PUBLIC_SUPABASE_URL` → URL Supabase project
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → Supabase anon key

### 3. Test Build Local

```bash
npm run build
```

✅ Jika berhasil, lanjut ke step 4!

### 4. Deploy ke Vercel

```bash
# Login ke Vercel (sekali saja)
vercel login

# Deploy preview (untuk test)
vercel

# Deploy production
vercel --prod
```

## 📋 Checklist Sebelum Deploy

- [x] ✅ Build berhasil (`npm run build`)
- [ ] 🔐 Environment variables sudah di-set
- [ ] 🔗 API Backend sudah di-deploy
- [ ] 📝 `.env.local` tidak di-commit ke git
- [ ] 🌐 Domain sudah disiapkan (opsional)

## 🔧 Set Environment Variables di Vercel

### Via CLI:

```bash
vercel env add NEXT_PUBLIC_API_URL production
# Masukkan nilai: https://your-api-domain.vercel.app

vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Masukkan nilai dari Supabase Dashboard

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
# Masukkan nilai dari Supabase Dashboard
```

### Via Dashboard:

1. Buka https://vercel.com/dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Tambahkan satu per satu:
   - `NEXT_PUBLIC_API_URL`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Redeploy project

## 🎯 Command Reference

```bash
# Development local
npm run dev

# Build project
npm run build

# Start production local
npm start

# Deploy preview
vercel

# Deploy production
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs

# Rollback deployment
vercel rollback

# Remove project
vercel remove
```

## 🐛 Troubleshooting

### Error: "Build failed"

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "Environment variables not found"

- Pastikan prefix `NEXT_PUBLIC_` untuk client-side variables
- Set ulang di Vercel Dashboard
- Redeploy setelah set env vars

### Error: "Cannot connect to API"

- Check `NEXT_PUBLIC_API_URL` sudah benar
- Pastikan API sudah di-deploy
- Check CORS settings di API

### Error: "Module not found"

- Run `npm install` di local
- Commit `package-lock.json`
- Push dan deploy ulang

## 📊 Post-Deployment

Setelah deploy berhasil:

1. **Test Login**

   - Buka URL Vercel Anda
   - Login dengan akun admin
   - Check semua fitur berfungsi

2. **Setup Custom Domain** (Opsional)

   - Settings → Domains
   - Add domain: `admin.bukadita.com`
   - Update DNS records
   - Tunggu propagasi

3. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor error logs
   - Setup alerts jika perlu

## 📞 Butuh Bantuan?

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Support: https://vercel.com/support

---

**Status:** ✅ Siap Deploy
**Build:** ✅ Berhasil
**Last Check:** 2 November 2025
