# VoiceDirector AI — Character Voice Cloning with Fish Audio

A Next.js app for building characters, cloning voices with Fish Audio, and previewing speech in the browser. This is the companion repository for the CodeWithLari YouTube course.

📺 [Watch the full course on YouTube →](https://youtu.be/LddUTjso6Og)

## What You'll Build

A Character Builder that turns a short voice sample into a private Fish Audio voice model, then lets you hear any new line spoken in that cloned voice — using Fish Audio’s free `s2.1-pro-free` TTS model.

## Features

- Create and update a character profile (name, description, speaking style, emotion, sample dialogue)
- Live character preview card
- Upload an authorized voice sample (`.wav`, `.mp3`, `.m4a`, `.opus`)
- Required transcript + consent before cloning
- Clone a private Fish Audio voice model with fast training
- Generate a speech preview and play it in a native `<audio>` player
- Persist the character (including `voiceModelId`) in `sessionStorage`
- Server-side Fish Audio integration — API key never reaches the browser
- Responsive UI with shadcn/ui components
- Navigation shell with Character Builder and Voiceover Studio (studio is a placeholder)

## Backend

- `POST /api/voices/clone` — validates upload, forwards to Fish Audio Create Model
- `POST /api/voices/preview` — generates MP3 via Fish Audio Text to Speech
- Bearer auth with `FISH_AUDIO_API_KEY` kept server-side only
- Credit-aware handling for Fish Audio `402` responses
- Safe error responses (no raw Fish Audio bodies or stack traces to the client)

## Stack

| Layer | Tool |
| --- | --- |
| Frontend | Next.js 16 |
| UI Components | shadcn/ui |
| Voice Cloning & TTS | [Fish Audio](https://fish.audio) |
| Styling | Tailwind CSS 4 |
| Icons | Lucide React |
| Runtime | Node.js |
| Package Manager | pnpm |

## Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/laribright/voice-clone.git
cd voice-clone
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

See [Environment Variables](#environment-variables) below.

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) — you’ll be redirected to `/characters`.

## Environment Variables

`.env.local`:

```bash
# Fish Audio — fish.audio dashboard
FISH_AUDIO_API_KEY=your_api_key
```

Get an API key from the [Fish Audio](https://fish.audio) dashboard. Restart `pnpm dev` after changing env files.

## Project Structure

```text
voice-clone/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── voices/
│   │   │       ├── clone/route.ts    # Fish Audio create-model proxy
│   │   │       └── preview/route.ts  # Fish Audio TTS proxy
│   │   ├── characters/               # Character Builder page
│   │   ├── studio/                   # Voiceover Studio placeholder
│   │   ├── layout.tsx                # Root layout + nav
│   │   └── page.tsx                  # Redirects to /characters
│   ├── components/
│   │   ├── layout/
│   │   │   └── main-navigation.tsx   # App header
│   │   └── ui/                       # shadcn/ui components
│   ├── features/
│   │   └── characters/
│   │       ├── components/
│   │       │   ├── character-builder.tsx
│   │       │   ├── character-form.tsx
│   │       │   ├── character-preview.tsx
│   │       │   └── voice-clone-panel.tsx
│   │       └── types/
│   │           └── character.types.ts
│   └── lib/
│       └── utils.ts
├── docs/
│   └── voicedirector-fish-audio-flow.excalidraw
├── public/
├── .env.example
├── next.config.ts
└── package.json
```

## How It Works

1. **Build a character** on `/characters`
2. **Upload** a short voice sample + transcript, then confirm consent
3. **Clone Voice** → `POST /api/voices/clone` → Fish Audio `POST /model` (`train_mode: "fast"`, `visibility: "private"`)
4. Store the returned `_id` as `voiceModelId`
5. **Generate Preview** → `POST /api/voices/preview` → Fish Audio `POST /v1/tts` with `model: s2.1-pro-free` and `reference_id`
6. Play the returned MP3 in the browser

The browser only talks to your Next.js routes — never directly to `api.fish.audio`.

## Key Concepts Covered

- Next.js 16 App Router — pages, layouts, and route handlers
- Server-side API proxies — keeping secrets off the client
- Fish Audio voice cloning — create a private TTS model from a sample
- Fish Audio text-to-speech — free `s2.1-pro-free` model with a cloned `reference_id`
- FormData uploads — forwarding audio files safely from browser → Next.js → Fish Audio
- Client validation + server validation — never trust either side alone
- `sessionStorage` hydration — persist character state across refresh without a database
- shadcn/ui + Tailwind CSS 4 — building a clean product UI

## Scripts

```bash
# Development
pnpm dev      # Start dev server at http://localhost:3000
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Course

This repo is the companion to the CodeWithLari Fish Audio / VoiceDirector AI series on YouTube.

📺 [Watch on YouTube](https://youtu.be/LddUTjso6Og)

⭐ If this helped you, please star the repo — it helps a lot!

---

Built with Next.js · Fish Audio · shadcn/ui · CodeWithLari
