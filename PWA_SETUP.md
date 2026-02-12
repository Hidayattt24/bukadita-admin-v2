# PWA Setup - BUKADITA Admin

## Overview
BUKADITA Admin sekarang mendukung Progressive Web App (PWA) yang memungkinkan pengguna untuk:
- Install aplikasi di perangkat mereka
- Akses cepat dari home screen
- Bekerja offline (dengan cache)
- Mendapatkan notifikasi install otomatis

## File Structure

```
bukadita-admin-v2/
├── public/
│   ├── manifest.json          # PWA manifest configuration
│   ├── sw.js                  # Service Worker
│   ├── offline.html           # Offline fallback page
│   ├── icons/                 # App icons (72x72 to 512x512)
│   └── screenshots/           # App screenshots for install prompt
├── src/
│   ├── components/
│   │   └── pwa/
│   │       └── PWAInstallPrompt.tsx  # Install prompt component
│   ├── hooks/
│   │   └── usePWA.ts          # PWA registration hook
│   └── providers/
│       └── PWAProvider.tsx    # PWA context provider
```

## Features

### 1. Auto Install Prompt
- Muncul otomatis 3 detik setelah user membuka `/login`
- Dapat di-dismiss dan akan muncul lagi setelah 7 hari
- Menampilkan benefit install aplikasi
- Animasi smooth dengan Framer Motion

### 2. Service Worker
- Cache static assets untuk akses offline
- Network-first strategy untuk API calls
- Auto-update detection dengan prompt
- Offline fallback page

### 3. Manifest Configuration
- App name, description, dan icons
- Theme color: `#578FCA` (brand color)
- Display mode: `standalone` (fullscreen app)
- Shortcuts untuk quick access
- Screenshots untuk install dialog

### 4. Offline Support
- Halaman offline custom dengan status koneksi
- Auto-reload saat koneksi kembali
- Cache management untuk performa optimal

## How It Works

### Install Flow
1. User membuka `http://localhost:3000/login`
2. Browser mendeteksi PWA manifest
3. Setelah 3 detik, muncul install prompt
4. User klik "Install Sekarang"
5. Browser menampilkan native install dialog
6. Setelah install, app muncul di home screen

### Service Worker Registration
```typescript
// Automatically registered in PWAProvider
usePWA() // Registers /sw.js
```

### Cache Strategy
- **Static Assets**: Cache-first (icons, images, CSS, JS)
- **API Calls**: Network-first (always fresh data)
- **Offline**: Serve cached content or offline.html

## Testing PWA

### Local Development
1. Build production version:
   ```bash
   npm run build
   npm start
   ```

2. Open Chrome DevTools > Application > Manifest
3. Check "Service Workers" tab
4. Test "Add to Home Screen"

### Lighthouse Audit
1. Open Chrome DevTools > Lighthouse
2. Select "Progressive Web App"
3. Run audit
4. Should score 90+ for PWA

### Testing Install Prompt
1. Open `http://localhost:3000/login`
2. Wait 3 seconds
3. Install prompt should appear
4. Test "Install" and "Dismiss" buttons

### Testing Offline
1. Install the app
2. Open DevTools > Network
3. Set to "Offline"
4. Refresh page
5. Should show offline.html or cached content

## Configuration

### Manifest (public/manifest.json)
```json
{
  "name": "BUKADITA Admin Dashboard",
  "short_name": "BUKADITA Admin",
  "start_url": "/login",
  "display": "standalone",
  "theme_color": "#578FCA"
}
```

### Service Worker (public/sw.js)
```javascript
const CACHE_NAME = 'bukadita-admin-v1';
// Update version to force cache refresh
```

### Install Prompt Timing
```typescript
// PWAInstallPrompt.tsx
setTimeout(() => {
  setShowPrompt(true);
}, 3000); // Show after 3 seconds
```

### Dismiss Duration
```typescript
// PWAInstallPrompt.tsx
const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
if (daysSinceDismissed < 7) return; // Show again after 7 days
```

## Browser Support

| Browser | Install Support | Service Worker | Offline |
|---------|----------------|----------------|---------|
| Chrome (Desktop) | ✅ | ✅ | ✅ |
| Chrome (Android) | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ |
| Safari (iOS 16.4+) | ✅ | ✅ | ✅ |
| Firefox | ⚠️ Manual | ✅ | ✅ |

## Deployment Checklist

- [x] Manifest.json configured
- [x] Service Worker created
- [x] Icons generated (72x72 to 512x512)
- [x] Screenshots added
- [x] Install prompt component
- [x] Offline fallback page
- [x] HTTPS enabled (required for PWA)
- [x] Meta tags in layout
- [x] Cache headers configured

## Troubleshooting

### Install Prompt Not Showing
1. Check if already installed (standalone mode)
2. Clear localStorage: `pwa-install-dismissed`
3. Check browser console for errors
4. Verify manifest.json is accessible
5. Ensure HTTPS is enabled

### Service Worker Not Registering
1. Check `/sw.js` is accessible
2. Verify production build (`npm run build`)
3. Check browser console for errors
4. Clear browser cache and reload

### Offline Not Working
1. Verify service worker is active
2. Check cache in DevTools > Application > Cache Storage
3. Test with DevTools offline mode
4. Check network requests in Network tab

## Future Enhancements

- [ ] Push notifications untuk update konten
- [ ] Background sync untuk offline actions
- [ ] Periodic background sync
- [ ] Share target API
- [ ] File handling API
- [ ] Badge API untuk notification count

## Resources

- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [Workbox (Advanced SW)](https://developers.google.com/web/tools/workbox)
