# robo5 Publish Flow

This document defines the current operating flow for robo5.

## Source of Truth

- `public/data/posts-master.json` is the canonical source.
- `public/data/posts.json`, `public/data/flow-index.json`, and `public/data/detail/*.json` are generated artifacts.

## Roles

- **Admin UI**: content editing and save entry point.
- **`/api/admin/posts`**: admin save endpoint that updates `posts-master.json`.
- **`npm run sync-json`**: local/manual JSON generation command.
- **Public site**: reads only static JSON files from `public/data/`.

## Save vs Publish

- **Save Post** means administrator content save.
- **Publish** means the manual static publish flow:
  1. run `npm run sync-json`
  2. review generated JSON
  3. `git add`
  4. `git commit`
  5. `git push`
  6. Vercel deploy

## API Response Contract

`/api/admin/posts` currently distinguishes:

- `saved`: administrator save completed
- `published`: public JSON publish completed
- `publishMode`: `manual` or `runtime`
- `nextStep`: next operator action when publish is manual

In production, runtime public-data writes are not expected.

## No Direct Firestore Reads on Public Site

The public site remains JSON-only and does not directly read Firestore.

