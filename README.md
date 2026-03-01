# SawayLinks

**Self-hosted, open-source Linktree alternative.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)](https://typescriptlang.org)

A mobile-first link page with a built-in admin panel for managing links, profile, and themes. No database required -- data is stored in a simple JSON file. Deploy anywhere with Docker, Coolify, or any Node.js host.

---

## Features

- **Mobile-first responsive design** -- looks great on every screen size
- **Admin panel** with password authentication at `/admin`
- **Link CRUD** -- add, edit, delete, reorder, and pin links
- **Profile management** -- name, bio, and avatar upload
- **4 built-in themes** -- Midnight, Ocean, Sunset, Minimal
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

### Production Build

```bash
npm run build
npm start
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_PASSWORD` | Yes | Password for admin panel login |
| `ADMIN_SECRET` | Yes | Secret key for JWT signing (min 32 chars, random string) |

## Deployment

### Docker

```bash
docker build -t sawaylinks .
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=your-password \
  -e ADMIN_SECRET=your-random-secret-min-32-chars \
  -v sawaylinks-data:/app/data \
  -v sawaylinks-uploads:/app/public/uploads \
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
      - sawaylinks-uploads:/app/public/uploads
    restart: unless-stopped

volumes:
  sawaylinks-data:
  sawaylinks-uploads:
```

Then run:

```bash
docker compose up -d
```

### Coolify (Self-hosted PaaS)

1. In Coolify, create a **new service** and select **Dockerfile** as the build pack.
2. Connect your **GitHub repository** containing SawayLinks.
3. Add environment variables in the Coolify dashboard:
   - `ADMIN_PASSWORD` -- your admin password
   - `ADMIN_SECRET` -- a random string of 32+ characters
4. Add **persistent storage** mounts:
   - `/app/data` -- stores your site data (links, profile, theme)
   - `/app/public/uploads` -- stores uploaded avatar images
5. Set your domain (e.g., `links.yourdomain.com`).
6. Click **Deploy**.

### Vercel / Other Platforms

SawayLinks works on Vercel and similar serverless platforms, but **file storage will not persist between deployments**. Uploaded avatars and link data stored in JSON files will be lost on each redeploy. For full functionality with persistent data, self-hosted deployment (Docker or Coolify) is recommended.

## Security

- **No hardcoded credentials** -- all secrets are configured via environment variables
- **JWT tokens with HMAC-SHA256** -- signed using the Web Crypto API with zero external dependencies
- **24-hour token expiration** -- sessions automatically expire
- **Timing-safe password comparison** -- prevents timing attacks on login
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

## Customization

### Adding Custom Themes

Edit `src/lib/themes.ts` to add your own theme. Each theme defines CSS classes for the body background, profile text, avatar ring, link cards, and footer.

### Adding Links Programmatically

You can either use the admin panel at `/admin` or directly edit `data/site.json`. The file is auto-generated on first run and contains all links, profile data, and theme selection.

## Tech Stack

- [Next.js 16](https://nextjs.org) -- React framework with App Router
- [TypeScript](https://typescriptlang.org) -- type safety
- [Tailwind CSS v4](https://tailwindcss.com) -- utility-first styling
- [shadcn/ui](https://ui.shadcn.com) -- accessible UI components
- [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API) -- JWT signing (zero dependencies)
- [Sonner](https://sonner.emilkowal.dev) -- toast notifications
- [Lucide React](https://lucide.dev) -- icon library

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public link page
│   ├── admin/                # Admin panel pages
│   └── api/                  # REST API routes
├── components/
│   ├── ui/                   # shadcn/ui components
│   └── admin/                # Admin components
├── hooks/                    # React hooks
└── lib/                      # Utilities
data/
└── site.json                 # Runtime data (auto-generated)
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

### Ortam Degiskenleri

| Degisken | Zorunlu | Aciklama |
|----------|---------|----------|
| `ADMIN_PASSWORD` | Evet | Yonetim paneli giris sifresi |
| `ADMIN_SECRET` | Evet | JWT imzalama icin gizli anahtar (en az 32 karakter, rastgele dizi) |

### Deploy (Coolify ile)

1. Coolify'da yeni bir **servis** olusturun ve **Dockerfile** secin.
2. SawayLinks'in bulundugu **GitHub reposunu** baglatin.
3. Coolify panelinde **ortam degiskenlerini** ekleyin:
   - `ADMIN_PASSWORD` -- yonetici sifreniz
   - `ADMIN_SECRET` -- en az 32 karakterlik rastgele bir dizi
4. **Kalici depolama** baglama noktalarini ekleyin:
   - `/app/data` -- site verilerini saklar (linkler, profil, tema)
   - `/app/public/uploads` -- yuklenen avatar resimlerini saklar
5. Alan adinizi ayarlayin (ornegin `links.alaniniz.com`).
6. **Deploy** tusuna basin.

### Guvenlik

- **Sabit kodlanmis kimlik bilgisi yok** -- tum gizli bilgiler ortam degiskenleri ile ayarlanir
- **HMAC-SHA256 ile JWT** -- Web Crypto API kullanilir, harici bagimlilk yoktur
- **24 saatlik token suresi** -- oturumlar otomatik olarak sona erer
- **Zamanlama-guvenli sifre karsilastirmasi** -- zamanlama saldirilarina karsi koruma saglar
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
