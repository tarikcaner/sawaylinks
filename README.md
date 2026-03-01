# SawayLinks

**Self-hosted, open-source Linktree alternative.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)

A mobile-first link page with a built-in admin panel for managing links, profile, and themes. No database required -- data is stored in simple JSON files. Deploy anywhere with Docker, Coolify, or any Node.js host.

---

## Features

- **Mobile-first responsive design** -- looks great on every screen size
- **Admin panel** with password authentication at `/admin`
- **Link CRUD** -- add, edit, delete, reorder, and pin links
- **Profile management** -- name, bio, and avatar upload with crop
- **Analytics dashboard** -- page views, daily charts, and per-link click tracking
- **Password management** -- change password from admin panel, PBKDF2 hashing
- **8 built-in themes** -- Midnight, Ocean, Sunset, Minimal, Forest, Neon, Rose, Slate
- **Theme customization** -- button styles, font styles, avatar shapes, footer toggle, live preview
- **Rate limiting** -- brute-force protection on login
- **JSON file storage** -- no database needed
- **Docker ready** -- standalone output, Coolify compatible
- **Zero external auth dependencies** -- JWT signing via Web Crypto API

## Screenshots

> Screenshots coming soon

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/sawaylinks.git
cd sawaylinks

# 2. Install dependencies
npm install

# 3. Copy the environment file
cp .env.example .env.local

# 4. Edit .env.local with your password and secret
#    ADMIN_PASSWORD=your-secure-password
#    ADMIN_SECRET=your-random-secret-min-32-chars

# 5. Start the development server
npm run dev
```

- **Public page:** [http://localhost:3000](http://localhost:3000)
- **Admin panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

### Initial Login

On first run, log in using the `ADMIN_PASSWORD` from your environment variables. You can then change your password from the **Profil** page in the admin panel.

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Initial password for admin panel login |
| `ADMIN_SECRET` | Yes | Secret key for JWT signing (min 32 chars, random string) |

## Password Management

- **Initial setup:** Set `ADMIN_PASSWORD` in your environment variables
- **Change password:** Go to Admin > Profil > Sifre Degistir
- **How it works:** When you change your password, it is hashed with PBKDF2 (100k iterations, SHA-256) and stored in `data/auth.json`. The stored password takes priority over the env var.
- **Reset password:** Delete `data/auth.json` and the system falls back to the `ADMIN_PASSWORD` env var

## Analytics

SawayLinks includes built-in analytics with no third-party services:

- **Page views** -- automatically tracked when visitors load your page
- **Link clicks** -- tracked per link when visitors click
- **Dashboard** -- view totals, daily bar chart (last 7 days), and per-link click table at Admin > Analitik
- **Data retention** -- daily data is pruned after 30 days
- **Privacy-friendly** -- no cookies, no external tracking, data stays on your server

## Deployment

### Docker

```bash
docker build -t sawaylinks .
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=your-password \
  -e ADMIN_SECRET=your-random-secret-min-32-chars \
  -v sawaylinks-data:/app/data \
  sawaylinks
```

### Docker Compose

Create a `docker-compose.yml` file:

```yaml
version: "3.8"

services:
  sawaylinks:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ADMIN_PASSWORD=your-secure-password
      - ADMIN_SECRET=your-random-secret-min-32-chars
    volumes:
      - sawaylinks-data:/app/data
    restart: unless-stopped

volumes:
  sawaylinks-data:
```

Then run:

```bash
docker compose up -d
```

> **Note:** The `data/` volume stores all persistent data: site config, analytics, password hash, and uploaded avatars. Only one volume mount is needed.

### Coolify (Self-hosted PaaS)

1. In Coolify, create a **new service** and select **Dockerfile** as the build pack.
2. Connect your **GitHub repository** containing SawayLinks.
3. Add environment variables in the Coolify dashboard:
   - `ADMIN_PASSWORD` -- your admin password
   - `ADMIN_SECRET` -- a random string of 32+ characters
4. Add **persistent storage** mount:
   - `/app/data` -- stores all persistent data (links, profile, theme, analytics, auth, avatars)
5. Set your domain (e.g., `links.yourdomain.com`).
6. Click **Deploy**.

### Vercel / Other Platforms

SawayLinks works on Vercel and similar serverless platforms, but **file storage will not persist between deployments**. Uploaded avatars and link data stored in JSON files will be lost on each redeploy. For full functionality with persistent data, self-hosted deployment (Docker or Coolify) is recommended.

## Security

- **No hardcoded credentials** -- all secrets are configured via environment variables
- **PBKDF2 password hashing** -- 100k iterations with SHA-256 when password is changed from admin
- **JWT tokens with HMAC-SHA256** -- signed using the Web Crypto API with zero external dependencies
- **24-hour token expiration** -- sessions automatically expire
- **Timing-safe password comparison** -- prevents timing attacks on login
- **Rate limiting** -- brute-force protection with progressive backoff on login attempts
- **Avatar upload restrictions** -- limited to 2MB, accepts only `image/jpeg`, `image/png`, and `image/webp`
- **Admin routes protected** -- all admin API endpoints require a valid Bearer token
- **No third-party auth services** -- everything runs on your own server

### Recommendations for Production

- Always use **HTTPS** (terminate TLS at your reverse proxy or hosting platform)
- Set a **strong admin password** (16+ characters, mixed case, numbers, symbols)
- Generate a **random ADMIN_SECRET** of 64+ characters:

```bash
openssl rand -base64 48
```

## Themes

| Theme | Description |
|-------|-------------|
| **Midnight** | Dark gradient with glass-effect cards |
| **Ocean** | Deep blue and cyan tones |
| **Sunset** | Warm orange to pink gradient |
| **Minimal** | Clean white minimalist design |
| **Forest** | Green and earth tones |
| **Neon** | Vibrant neon accents on dark background |
| **Rose** | Soft pink and rose tones |
| **Slate** | Neutral gray professional look |

## Customization

### Theme Customization (Admin Panel)

From the **Tema** page you can customize:

- **Button style** -- rounded, pill, square, or outline
- **Font style** -- sans-serif, serif, or monospace
- **Avatar shape** -- circle, square, or rounded square
- **Footer visibility** -- show or hide the footer
- **Live preview** -- see changes in real-time before saving

### Adding Custom Themes

Edit `src/lib/themes.ts` to add your own theme. Each theme defines CSS classes for the body background, profile text, avatar ring, link cards, and footer.

### Adding Links Programmatically

You can either use the admin panel at `/admin` or directly edit `data/site.json`. The file is auto-generated on first run and contains all links, profile data, and theme selection.

## Tech Stack

- [Next.js 16](https://nextjs.org) -- React framework with App Router
- [TypeScript](https://typescriptlang.org) -- type safety
- [Tailwind CSS v4](https://tailwindcss.com) -- utility-first styling
- [shadcn/ui](https://ui.shadcn.com) -- accessible UI components
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) -- JWT signing & password hashing (zero dependencies)
- [Sonner](https://sonner.emilkowal.dev) -- toast notifications
- [Lucide React](https://lucide.dev) -- icon library

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public link page (with analytics tracking)
│   ├── admin/
│   │   ├── page.tsx          # Link management
│   │   ├── profile/          # Profile & password management
│   │   ├── theme/            # Theme customization with live preview
│   │   └── analytics/        # Analytics dashboard
│   └── api/
│       ├── site/             # Site data API
│       ├── profile/          # Profile API
│       ├── avatar/           # Avatar upload & serve API
│       ├── auth/
│       │   ├── login/        # Login with rate limiting
│       │   ├── verify/       # Token verification
│       │   └── password/     # Password change API
│       └── analytics/
│           ├── pageview/     # Record page view
│           ├── click/        # Record link click
│           └── route.ts      # Get analytics (authenticated)
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── admin/                # Admin components
├── hooks/                    # React hooks (useAdmin)
└── lib/
    ├── store.ts              # Site data store
    ├── analytics-store.ts    # Analytics data store
    ├── auth.ts               # Auth, JWT, password hashing
    ├── rate-limit.ts         # Login rate limiting
    └── themes.ts             # Theme definitions & customization
data/
├── site.json                 # Runtime data (auto-generated)
├── analytics.json            # Analytics data (auto-generated)
├── auth.json                 # Hashed password (auto-generated)
└── avatars/                  # Uploaded avatar images
```

## Contributing

Contributions are welcome! Here is how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/my-feature`)
3. **Commit** your changes (`git commit -m "Add my feature"`)
4. **Push** to the branch (`git push origin feature/my-feature`)
5. **Open** a Pull Request

Please make sure your code follows the existing style and passes any linting checks before submitting.

## License

This project is licensed under the [MIT License](LICENSE).

---

## Turkce

### Kurulum

```bash
# 1. Repoyu klonlayin
git clone https://github.com/yourusername/sawaylinks.git
cd sawaylinks

# 2. Bagimliiklari yukleyin
npm install

# 3. Ortam degiskenleri dosyasini kopyalayin
cp .env.example .env.local

# 4. .env.local dosyasini duzenleyin
#    ADMIN_PASSWORD=guvenli-sifreniz
#    ADMIN_SECRET=rastgele-en-az-32-karakter

# 5. Gelistirme sunucusunu baslatin
npm run dev
```

- **Herkese acik sayfa:** [http://localhost:3000](http://localhost:3000)
- **Yonetim paneli:** [http://localhost:3000/admin](http://localhost:3000/admin)

### Ilk Giris

Ilk calistirmada, ortam degiskenlerindeki `ADMIN_PASSWORD` ile giris yapin. Ardindan yonetim panelindeki **Profil** sayfasindan sifrenizi degistirebilirsiniz.

### Ortam Degiskenleri

| Degisken | Zorunlu | Aciklama |
|----------|---------|----------|
| `ADMIN_PASSWORD` | Evet | Yonetim paneli ilk giris sifresi |
| `ADMIN_SECRET` | Evet | JWT imzalama icin gizli anahtar (en az 32 karakter, rastgele dizi) |

### Sifre Yonetimi

- **Ilk kurulum:** `ADMIN_PASSWORD` ortam degiskenini ayarlayin
- **Sifre degistirme:** Yonetim Paneli > Profil > Sifre Degistir
- **Nasil calisir:** Sifrenizi degistirdiginizde, PBKDF2 (100k iterasyon, SHA-256) ile hashlenir ve `data/auth.json` dosyasina kaydedilir. Kaydedilmis sifre ortam degiskeninden onceliklidir.
- **Sifre sifirlama:** `data/auth.json` dosyasini silin, sistem `ADMIN_PASSWORD` ortam degiskenine geri doner

### Analitik

SawayLinks, ucuncu parti servis olmadan dahili analitik sunar:

- **Sayfa goruntulenmeleri** -- ziyaretciler sayfanizi yuklediginde otomatik olarak izlenir
- **Link tiklamalari** -- ziyaretciler tikladiginda her link icin izlenir
- **Kontrol paneli** -- toplam, gunluk grafik (son 7 gun) ve link bazli tiklama tablosu: Yonetim > Analitik
- **Veri saklama** -- gunluk veriler 30 gun sonra temizlenir
- **Gizlilik dostu** -- cerez yok, harici izleme yok, veriler sunucunuzda kalir

### Deploy (Coolify ile)

1. Coolify'da yeni bir **servis** olusturun ve **Dockerfile** secin.
2. SawayLinks'in bulundugu **GitHub reposunu** baglatin.
3. Coolify panelinde **ortam degiskenlerini** ekleyin:
   - `ADMIN_PASSWORD` -- yonetici sifreniz
   - `ADMIN_SECRET` -- en az 32 karakterlik rastgele bir dizi
4. **Kalici depolama** baglama noktasi ekleyin:
   - `/app/data` -- tum kalici verileri saklar (linkler, profil, tema, analitik, sifre, avatarlar)
5. Alan adinizi ayarlayin (ornegin `links.alaniniz.com`).
6. **Deploy** tusuna basin.

### Guvenlik

- **Sabit kodlanmis kimlik bilgisi yok** -- tum gizli bilgiler ortam degiskenleri ile ayarlanir
- **PBKDF2 sifre hashleme** -- yonetim panelinden sifre degistirildiginde 100k iterasyon, SHA-256
- **HMAC-SHA256 ile JWT** -- Web Crypto API kullanilir, harici bagimlilk yoktur
- **24 saatlik token suresi** -- oturumlar otomatik olarak sona erer
- **Zamanlama-guvenli sifre karsilastirmasi** -- zamanlama saldirilarina karsi koruma saglar
- **Hiz sinirlamasi** -- giris denemelerinde kaba kuvvet koruması
- **Avatar yukleme kisitlamalari** -- maksimum 2MB, yalnizca `image/jpeg`, `image/png` ve `image/webp`
- **Korunan yonetici rotalari** -- tum yonetici API uclari gecerli bir Bearer token gerektirir

Uretim ortami icin guvenli bir secret olusturmak icin:

```bash
openssl rand -base64 48
```

### Katkida Bulunma

Katkalarinizi bekliyoruz!

1. Repoyu **fork** edin
2. Yeni bir **dal** olusturun (`git checkout -b ozellik/yeni-ozellik`)
3. Degisikliklerinizi **commit** edin (`git commit -m "Yeni ozellik ekle"`)
4. Dali **push** edin (`git push origin ozellik/yeni-ozellik`)
5. Bir **Pull Request** acin
