# Aura

Web-based AI skin intelligence for Aurora Organics. Users scan their face, receive a cosmetic skin assessment, and get personalized product recommendations.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, and shadcn/ui.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm (included with Node.js)
- [Docker](https://www.docker.com/) (optional, for containerized runs)

## Getting started (local)

1. Enter the project directory:

   ```bash
   cd ~/Desktop/aura
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

The development server is fixed to port `3000`. If that port is occupied,
stop the existing process instead of starting Aura on another port.

For a clean restart that stops stale development processes first:

```bash
npm run dev:restart
```

To inspect the development ports:

```bash
lsof -i :3000
lsof -i :3001
```

To stop stale processes manually:

```bash
kill $(lsof -ti tcp:3000) 2>/dev/null || true
kill $(lsof -ti tcp:3001) 2>/dev/null || true
```

### VS Code

Use the `Aurora SkinSense: Next.js` Run and Debug configuration. It starts
Next.js and opens the browser only after the server reports its local URL.
The `Start Aurora SkinSense` task is also available from **Terminal → Run
Task**, but it does not run automatically when the workspace opens.

Do not use Live Server, Live Preview, or **Open with Live Server** for this
project. Aura is a Next.js application and must be served with `npm run dev`.

The first `dev` or `build` run generates Next.js type files under `.next/`. If TypeScript reports missing `.next/dev/types` files, run `npm run build` or `npm run dev` again.

## Scripts

| Command               | Description                                      |
| --------------------- | ------------------------------------------------ |
| `npm run dev`         | Start the development server on port 3000        |
| `npm run dev:restart` | Stop stale ports and restart development cleanly |
| `npm run build`       | Create a production build                        |
| `npm run start`       | Serve the production build on port 3000          |
| `npm run lint`        | Run ESLint                                       |
| `npm run typecheck`   | Run TypeScript without emitting                  |
| `npm run format`      | Format TypeScript files with Prettier            |

## Docker

Build and run the app in a container (production mode):

```bash
docker build -t aura .
docker run --rm -p 3000:3000 aura
```

Then open [http://localhost:3000](http://localhost:3000).

To pass environment variables:

```bash
docker run --rm -p 3000:3000 --env-file .env aura
```

The image uses Next.js [standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output) for a minimal production bundle.

## Project structure

```
app/
  (marketing)/    # Landing page — top navbar
  (scan)/         # Scan flow — scan-specific chrome
  (auth)/         # Login and OTP verification
  (onboarding)/   # Onboarding steps — no nav/sidebar
  (dashboard)/    # User and admin — sidebar
components/
  ui/             # shadcn primitives
  layouts/        # Route-group shells
```

See [AGENTS.md](AGENTS.md) for full conventions and stack details.

## Adding shadcn components

```bash
npx shadcn@latest add button
```

Components are added to `components/ui/`. Import them in your app:

```tsx
import { Button } from "@/components/ui/button"
```

## Environment variables

Create a `.env.local` file for local development when environment variables are needed. Planned variables (not all required yet):

| Variable              | Description                            |
| --------------------- | -------------------------------------- |
| `GEMINI_API_KEY`      | Google AI Studio API key (planned)     |
| `OPENWEATHER_API_KEY` | Server-only OpenWeather API key        |
| `DATABASE_URL`        | PostgreSQL connection string (planned) |

Server-only secrets must not be exposed to the client. See [AGENTS.md](AGENTS.md).

### OpenWeather climate context

After consent, signed-in users may provide a one-time location or search for a
city before scanning. Aurora retrieves normalized current weather from the
OpenWeather Current Weather API and treats Air Pollution API data as optional.
Provider requests run only on the server, are cached for 15 minutes, and never
expose `OPENWEATHER_API_KEY` to browser code.

The basic Current Weather endpoint does not include UV index data, so UV remains
unavailable unless a compatible OpenWeather plan and endpoint are added later.
Report snapshots store coordinates rounded to two decimal places. Weather data
is attributed to OpenWeather wherever it is displayed.
