# Bukadita Admin Dashboard v2

The **Bukadita Admin Dashboard** is the back-office management system for the Bukadita platform. Built with **Next.js 15**, **Tailwind CSS**, and **Supabase**, it provides administrators with tools to manage users, content (modules/quizzes), and track community health cadre progress. It is optimized as a **Progressive Web App (PWA)** for easy access on any device.

## 🚀 Tech Stack

- **[Next.js 15](https://nextjs.org/)**: React framework with App Router and Turbopack.
- **[React 19](https://react.dev/)**: Latest React features for building interactive UIs.
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development.
- **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first styling with modern features.
- **[TanStack Query v5](https://tanstack.com/query/latest)**: Efficient server state management.
- **[Supabase](https://supabase.com/)**: Backend services for Auth and Database.
- **[Framer Motion](https://www.framer.com/motion/)**: For smooth UI transitions and animations.
- **[Lucide React](https://lucide.dev/)** & **[Tabler Icons](https://tabler.io/icons)**: Consistent and beautiful iconography.

## 🔋 Key Features

- **Dashboard Analytics**: Overview of platform usage and key metrics.
- **Content Management**: Create, edit, and publish learning modules and quizzes.
- **User Management**: Manage user roles and permissions.
- **PWA Support**: Installable application with offline capabilities and auto-update detection.
- **Secure Authentication**: Protected routes and role-based access control via Supabase Auth.
- **Responsive Design**: Optimized for both desktop and tablet/mobile usage.

## 🛠️ Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd bukadita-admin-v2
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Copy `.env.example` to `.env` and fill in the required credentials.
   ```bash
   cp .env.example .env
   ```
   Required: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, etc.

### Development

Run the development server with Turbopack:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified) to view the dashboard.

### Build for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 📱 PWA Configuration

This project creates a custom Service Worker for advanced PWA features.
See **[PWA_SETUP.md](./PWA_SETUP.md)** for detailed PWA documentation.

Key PWA features:
- **Auto Install Prompt**: Prompts users to install the app.
- **Offline Support**: Caches static assets and uses network-first strategy for APIs.
- **Manifest**: Full web app manifest configuration.

## 📂 Project Structure

- `src/app`: Next.js App Router pages.
- `src/components`: Reusable UI components.
- `src/hooks`: Custom React hooks (including `usePWA`).
- `src/providers`: App providers (QueryClient, PWAProvider).
- `src/services`: API abstraction layer.
- `public`: Static assets and PWA files (`sw.js`, `manifest.json`).

## ☁️ Deployment

This project is optimized for deployment on **Vercel**.

1. Push code to your Git provider.
2. Import project into Vercel.
3. Add Environment Variables in Vercel.
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT
