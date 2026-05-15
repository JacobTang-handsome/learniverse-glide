
## Overview

Build a minimalist, Apple-inspired AI language learning platform on TanStack Start with Tailwind, shadcn/ui, framer-motion, and Lucide. Two main states: onboarding flow (UI-only, persisted in localStorage) and a split-view main app with a sticky AI chat dashboard on the left and a Vocabulary/Reading canvas on the right. Lovable Cloud powers chat threads + AI streaming.

## Stack & infra

- TanStack Start (existing), Tailwind v4, shadcn/ui, framer-motion, lucide-react, react-markdown.
- Lovable Cloud enabled for chat thread/message persistence (device-scoped, no login required).
- Lovable AI Gateway (`google/gemini-3-flash-preview`) via AI SDK (`useChat` + `streamText`) through a TanStack server route at `src/routes/api/chat.ts`.
- AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`) installed for the chat surface.

## Routes

```text
src/routes/
  __root.tsx          (shell + providers)
  index.tsx           (gatekeeper: onboarding if not done, else redirects to /app)
  onboarding.tsx      (login + 5-step setup, framer-motion AnimatePresence)
  app.tsx             (split-view layout: left dashboard+chat, right outlet)
  app.$threadId.tsx   (thread route; mounts chat with that id, default landing on /app creates one)
  app.vocabulary.tsx  (right-panel view A — overrides default? see below)
```

Right panel is controlled by an in-page tab toggle (Vocabulary / Reading) inside `app.tsx`, not separate routes (keeps split view stable). Threads drive the URL.

## Onboarding flow (`/onboarding`)

- Centered card on white. Steps managed by local state with framer-motion fade+slide between steps.
- Step 0 — Login: email magic-link input (UI only, validates format), Google + Apple buttons (visual only). On submit → next step.
- Step 1 — Language: Spanish / Catalan / Italian (pill toggles).
- Step 2 — Level: A0 / A1 / A2 / B1.
- Step 3 — Goal: Travel / Study Abroad / Daily Communication / Interest.
- Step 4 — Topics: Food / Campus / Travel / Music / History (multi-select pills).
- Step 5 — Daily time: 15 / 30 / 60 min.
- Bottom nav: Back + Continue. Final step → save profile to `localStorage('llm.profile')` and navigate to `/app`.

## Main app (`/app` + `/app/$threadId`)

Layout: `flex h-screen w-screen`. Left `w-[30%] border-r sticky`, right `flex-1 overflow-y-auto`.

### Left panel
- Top: Dashboard card — flame icon + streak count, daily progress `15 / 30 min` with a thin progress bar, language + level chip. Pulled from localStorage profile + simple derived state.
- Middle: thread list (compact) with "New chat" button.
- Bottom: AI chat using AI Elements:
  - `Conversation` / `MessageContent` / `MessageResponse` for transcript.
  - User msgs: subtle slate-100 bubble right-aligned. Assistant: no bubble, plain text with markdown.
  - `PromptInput` with `PromptInputTextarea` + `PromptInputFooter` containing a Mic icon button and submit (`PromptInputSubmit`).
  - Mic button: when toggled "listening", apply a custom CSS keyframe class `animate-siri-ripple` (concentric expanding rings via `::before/::after` pseudo-elements in `styles.css`). No real STT — purely visual state.
  - Streaming via `useChat` pointed at `/api/chat`, message id keyed by route `threadId`.

### Right panel
- Top tabs: "Vocabulary" | "Reading" (segmented control, slate borders).
- View A — Vocabulary flashcards:
  - Single large centered card. Shows Spanish word + IPA phonetic. Translation (EN / 中文) hidden behind a hover/tap reveal.
  - `motion.div drag="x"` with `dragConstraints` and `dragElastic`. Track x offset → show red "Forget" overlay on left drag, green "Remember" on right.
  - On release past threshold, animate exit and load next word from a hardcoded sample deck (~12 words seeded for chosen language).
- View B — Reading:
  - Article rendered with Tailwind `prose prose-slate` for line height/spacing.
  - Specific words wrapped in `<span data-word="hola" data-translation="hello" data-ipa="ˈo.la">` clickable. Click triggers a shadcn `Popover` with translation, IPA, and a small play button (uses `window.speechSynthesis` for instant pronunciation, no async lag).

## Backend (Lovable Cloud)

Tables (RLS enabled, scoped by `device_id` text column to keep "UI only" — no auth):

```text
threads(id uuid pk, device_id text, title text, created_at timestamptz, updated_at timestamptz)
messages(id uuid pk, thread_id uuid fk, role text, parts jsonb, created_at timestamptz)
```

Permissive RLS on `device_id = current_setting('request.headers')::json->>'x-device-id'` is brittle; instead expose via server fns that take a `deviceId` param and filter. Device id is generated client-side and stored in localStorage.

Server functions (`src/lib/chat.functions.ts`):
- `listThreads({ deviceId })`
- `createThread({ deviceId, title })`
- `getMessages({ threadId, deviceId })`
- (Persistence on assistant finish handled in `/api/chat` via `toUIMessageStreamResponse({ onFinish })`.)

Server route `src/routes/api/chat.ts`:
- POST handler. Reads `{ messages, threadId, deviceId, profile }`.
- Builds system prompt from profile (target language, level, goals, topics).
- `streamText({ model: gateway('google/gemini-3-flash-preview'), system, messages })`.
- `onFinish`: insert user + assistant messages to DB scoped to thread.

## Design system (`src/styles.css`)

- Background `oklch(1 0 0)` white, foreground slate-900-equivalent oklch.
- Borders: slate-200 oklch. Hover surfaces: slate-100 oklch.
- Primary kept neutral (near-black) per Apple aesthetic; accent reserved for streak (orange) and swipe overlays (red/green) only.
- Add `--shadow-card`, `--radius-2xl`, and Siri ripple keyframes:

```text
@keyframes siri-ripple {
  0%   { transform: scale(0.6); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}
```

## Files to create / modify

- `src/routes/index.tsx` — replace placeholder; redirect based on profile.
- `src/routes/onboarding.tsx`
- `src/routes/app.tsx` (layout with Outlet + tabs state)
- `src/routes/app.$threadId.tsx`
- `src/components/onboarding/{LoginStep,LanguageStep,LevelStep,GoalStep,TopicsStep,TimeStep,PillToggle}.tsx`
- `src/components/dashboard/{StatsCard,ThreadList}.tsx`
- `src/components/chat/{ChatWindow,MicButton}.tsx`
- `src/components/canvas/{CanvasTabs,VocabularyView,FlashCard,ReadingView,WordPopover}.tsx`
- `src/lib/{ai-gateway.ts,chat.functions.ts,profile.ts,device.ts,sample-data.ts}`
- `src/routes/api/chat.ts`
- `src/styles.css` — tokens + siri ripple keyframes + `.animate-siri-ripple` utility.
- Lovable Cloud migration for `threads` + `messages`.

## Out of scope (this round)

- Real magic-link / Google / Apple OAuth (UI shell only).
- Real speech-to-text (mic button is visual state; ripple animation only).
- Spaced repetition logic / persistence of vocab progress (sample deck only).
- Sourcing real reading articles (one curated sample per language).
