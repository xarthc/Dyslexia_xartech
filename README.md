# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Resend Email Integration

This project now includes a contact form that sends email using Resend.

1. Copy `.env.example` to `.env`.
2. Add your Resend API key to `RESEND_API_KEY`.
3. Set `RESEND_TO_EMAIL` to the inbox where you want contact messages.
4. Set `RESEND_FROM_EMAIL` to a verified sender in your Resend account.

Run frontend and backend in separate terminals:

```bash
npm run dev
```

```bash
npm run start
```

The frontend submits to `VITE_API_BASE_URL/api/contact`.
