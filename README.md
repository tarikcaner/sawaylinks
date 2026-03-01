# SawayLinks

A self-hosted, open-source Linktree alternative. Mobile-first design with an admin panel for managing links, profile, and themes. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

## Features

- **Mobile-first** responsive link page
- **Admin panel** at `/admin` with password authentication
- **Link management** — add, edit, delete, reorder, pin/unpin links
- **Profile editing** — name, username, bio, avatar upload
- **4 built-in themes** — Midnight, Ocean, Sunset, Minimal
- **No database required** — JSON file storage
- **Docker ready** — standalone output for easy deployment
- **Coolify compatible** — one-click deploy on your own server

## Quick Start

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone https://github.com/yourusername/sawaylinks.git
cd sawaylinks
npm install
cp .env.example .env.local
```

Edit `.env.local` and set your admin password and secret:

```env
ADMIN_PASSWORD=your-secure-password
ADMIN_SECRET=your-random-secret-min-32-chars
```

### Development

```bash
npm run dev
```

- Public page: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### Production Build

```bash
npm run build
npm start
```

## Docker Deployment

```bash
docker build -t sawaylinks .
docker run -p 3000:3000 \
  -e ADMIN_PASSWORD=your-secure-password \
  -e ADMIN_SECRET=your-random-secret \
  -v ./data:/app/data \
  -v ./public/uploads:/app/public/uploads \
  sawaylinks
```

### Coolify

1. Create a new service in Coolify
2. Connect your GitHub repository
3. Set build pack to **Dockerfile**
4. Add environment variables: `ADMIN_PASSWORD` and `ADMIN_SECRET`
5. Mount persistent storage for `/app/data` and `/app/public/uploads`
6. Set your domain and deploy

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Public link page
│   ├── layout.tsx            # Root layout
│   ├── admin/                # Admin panel
│   │   ├── page.tsx          # Link management
│   │   ├── profile/page.tsx  # Profile editing
│   │   └── theme/page.tsx    # Theme selection
│   └── api/                  # API routes
│       ├── auth/login/       # POST - login
│       ├── auth/verify/      # GET - verify token
│       ├── site/             # GET - full site data
│       ├── links/            # GET/POST - list/create links
│       ├── links/[id]/       # PUT/DELETE - update/delete link
│       ├── links/reorder/    # PUT - reorder links
│       ├── profile/          # GET/PUT - profile data
│       ├── avatar/           # POST - upload avatar
│       └── theme/            # GET/PUT - theme
├── components/               # React components
├── hooks/                    # Custom hooks
├── lib/
│   ├── auth.ts               # JWT auth with Web Crypto API
│   ├── store.ts              # JSON file storage
│   └── themes.ts             # Theme definitions
└── data/                     # Link data types
data/
└── site.json                 # Runtime data (auto-created)
```

## Security

- Admin panel is protected by password authentication
- JWT tokens signed with HMAC-SHA256 (Web Crypto API, no external dependencies)
- Tokens expire after 24 hours
- Timing-safe password comparison
- Avatar uploads limited to 2MB, restricted to image/jpeg, image/png, image/webp
- No hardcoded credentials — all secrets via environment variables

## Themes

| Theme | Description |
|-------|-------------|
| Midnight | Dark gradient with glass-effect cards |
| Ocean | Deep blue and cyan tones |
| Sunset | Warm orange to pink gradient |
| Minimal | Clean white minimalist design |

## Adding Custom Themes

Edit `src/lib/themes.ts` to add your own theme. Each theme defines CSS classes for body, profile text, avatar, link cards, and footer.

## Tech Stack

- [Next.js 16](https://nextjs.org) — React framework with App Router
- [TypeScript](https://typescriptlang.org) — Type safety
- [Tailwind CSS v4](https://tailwindcss.com) — Utility-first styling
- Web Crypto API — JWT signing (zero auth dependencies)

## License

MIT
