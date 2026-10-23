# Todojan
<img width="1280" height="673" alt="image" src="https://github.com/user-attachments/assets/9c070f3f-4980-4b93-b208-e8c378b6e67e" />

**An open-source productivity task manager UI built with Next.js, Tailwind CSS and Framer Motion.**

Todojan is a polished, animated landing page with a fully interactive task-board demo, a waitlist flow, and a community feature-request board. You get the whole experience on your own machine. There's no backend to set up, no accounts to create, and no API keys to find.

> [!NOTE]
> **The app runs 100% locally.** All data (tasks, waitlist entries, feature ideas, votes, and the demo session) lives in your browser's `localStorage`. It makes no network requests to external services and needs no configuration.

---

## ✨ Features

- **Interactive task board**: add, edit (double-click or ✏️), delete, drag to reorder, cycle priority, mark complete, clear completed, and reset to the demo data. Your changes are saved across reloads.
- **Seed data**: first-time visitors see sample tasks and feature ideas right away.
- **Mock session**: you're signed in automatically as **Demo User** (`demo@example.com`). There's no login screen.
- **Waitlist flow**: email capture with duplicate detection, stored only on your device.
- **Community feature board**: an auto-scrolling idea carousel with upvotes and a "Suggest a Feature" modal.
- **Rich motion**: 3D tilt dashboard, typewriter NLP demo, and confetti when you finish every task.

## 🚀 Quick Start

**Requirements:** [Node.js](https://nodejs.org/) 18.17 or newer.

```bash
# 1. Clone the repository
git clone https://github.com/<your-username>/todojan.git
cd todojan

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Then open **http://localhost:3000** in your browser.

You don't need a `.env` file. (`.env.example` only documents one optional variable for Open Graph metadata.)

### Other scripts

| Command         | Description                             |
| --------------- | --------------------------------------- |
| `npm run dev`   | Start the development server            |
| `npm run build` | Create an optimized production build    |
| `npm run start` | Serve the production build locally      |
| `npm run lint`  | Run ESLint                              |

## 🗂 Project Structure

```
src/
├── app/                  # Next.js App Router (layout, page, global styles, fonts)
├── components/           # UI sections: Hero, TaskBoard, BentoGrid, IdeaMarquee, popups…
├── context/
│   ├── SessionContext.jsx   # Mock "Demo User" session (always authenticated)
│   └── WaitlistContext.jsx  # Modal state + persisted feature ideas
├── hooks/
│   ├── useTasks.js          # Local task store (CRUD, reorder, seed data)
│   └── useMediaQueryHook.js
└── lib/
    ├── mockApi.js           # Local mock backend (waitlist + idea submission)
    ├── storage.js           # SSR-safe localStorage helpers
    └── confetti.js
```

## 🧪 Local Data & Resetting

Everything is stored under `localStorage` keys prefixed with `todojan_`. To start fresh, you can:

- click **Reset demo** under the task board, or
- clear site data in your browser's DevTools (Application → Storage → Clear site data).

## 🔌 Connecting a Real Backend (optional)

All persistence goes through two small modules, so swapping in a real API is simple:

- [`src/lib/mockApi.js`](src/lib/mockApi.js): replace `joinWaitlist` / `submitIdea` with `fetch` calls to your server.
- [`src/hooks/useTasks.js`](src/hooks/useTasks.js): replace the `localStorage` reads and writes with your data layer.
- [`src/context/SessionContext.jsx`](src/context/SessionContext.jsx): replace `DEMO_USER` with your auth provider.

## 🤝 Contributing

Issues and pull requests are welcome. Please run `npm run lint` and `npm run build` before you submit.

## 🛠 Tech Stack

[Next.js 14](https://nextjs.org/) · [React 18](https://react.dev/) · [Tailwind CSS](https://tailwindcss.com/) · [Framer Motion](https://www.framer.com/motion/) · [Embla Carousel](https://www.embla-carousel.com/) · [Lucide Icons](https://lucide.dev/)
