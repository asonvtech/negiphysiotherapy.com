# Negi Physiotherapy (Frontend Migration)

This project has been converted to the following frontend stack:

- React 18 + TypeScript
- Vite 6
- React Router 7
- Redux Toolkit + React Redux
- Tailwind CSS 4
- Radix UI primitives + MUI + custom UI components

## Project structure

- `src/main.tsx` – app bootstrap, Redux provider, MUI theme provider
- `src/router.tsx` – route definitions (`/` + fallback `*`)
- `src/store/*` – Redux Toolkit store, slice, typed hooks
- `src/ui/components/Button.tsx` – custom button built on Radix Slot primitive
- `src/views/*` – `HomePage` and `NotFoundPage`
- `src/styles.css` – Tailwind 4 import and theme CSS vars

## Available scripts

- `npm run dev` – start local development server
- `npm run build` – typecheck and create production build
- `npm run lint` – run ESLint
- `npm run typecheck` – run TypeScript checks
- `npm run preview` – preview production build

## Notes

- `vercel.json` is configured for SPA fallback routing and `dist` output.
- Existing static assets in `public/` are still available and can be imported into React components as needed.
- The old monolithic static `index.html` content has not been fully componentized yet. If you want, I can migrate each old section (hero/services/about/contact) into reusable React components next.
