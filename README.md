# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

**CI/CD**

- Triggers:
  - When a pull request targeting `release` is merged: run tests and build.
  - When a pull request targeting `main` is merged: run tests, build, then deploy to GitHub Pages.
- Required repository secrets (set in GitHub Settings → Secrets):
  - `VITE_API_URL` — API base URL used at build time.
  - `VITE_BE_URL` — BE base URL used at build time.
  - `VITE_FE_URL` — front-end URL used at build time (optional but recommended).
  - `GITHUB_TOKEN` — provided by GitHub automatically; no need to set manually for the default flow.

Workflow file: [.github/workflows/ci-pr.yml](.github/workflows/ci-pr.yml)

To run tests locally:

```bash
npm ci
npm run test
```
