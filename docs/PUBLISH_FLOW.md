# robo5 Publish Flow

This document defines the current operating flow for robo5.

## Source of Truth

* Firestore `posts` collection is the source of truth.
* `public/data/posts.json`, `public/data/flow-index.json`, and `public/data/detail/*.json` are generated artifacts.

## Roles

* **Admin UI**: content editing and save entry point.
* **`/api/admin/posts`**: admin CRUD endpoint that reads/writes Firestore posts.
* **`npm run sync-json`**: reads Firestore posts and generates public JSON artifacts.
* **Public site**: reads only static JSON files from `public/data/`.

## Save vs Publish

* **Save Post** means administrator content save to Firestore.
* **Publish** means generating public JSON artifacts from Firestore and deploying them.

Current manual publish flow:

1. run `npm run sync-json`
2. review generated JSON
3. `git add`
4. `git commit`
5. `git push`
6. Vercel deploy

## API Response Contract

`/api/admin/posts` currently distinguishes:

* `saved`: Firestore save completed
* `published`: public JSON publish completed
* `publishMode`: `manual` or `runtime`
* `nextStep`: next operator action when publish is manual

## No Direct Firestore Reads on Public Site

* The public site remains JSON-only.
* The public site does not directly read Firestore.
* Public runtime data is served from generated JSON artifacts.
