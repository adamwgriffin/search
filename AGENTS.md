# Project conventions

## Imports

- Always use the `@/` path alias (mapped to the repo root in `tsconfig.json`) for imports from another directory, e.g. `import { db } from "@/lib/db"` — never `../` relative paths.
- Same-directory imports may stay relative, e.g. `import styles from "./page.module.css"`.
- Exception: `@value ... from '...'` imports inside `.css` module files keep using relative paths.
