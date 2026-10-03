# Notecard — a simple Next.js notes app

A small notes app built with Next.js (App Router) and plain React state —
no external state library, no backend. Notes are kept in `localStorage` so
they survive a page refresh.

## Features

- **Add a note** — title + description, via the form on the left.
- **View all notes** — rendered as cards in a responsive grid.
- **Edit a note** — click "Edit" on a card to load it back into the form;
  submitting updates it in place.
- **Delete a note** — click "Delete" on a card.
- **Duplicate-title check (bonus)** — a `useEffect` watches the title field
  as you type and warns you (and disables "Add note") if a note with that
  title already exists, ignoring the note currently being edited.
- **Separate `NoteItem` component (bonus)** — each card is rendered by
  `src/components/NoteItem.js`, kept independent from the page's state logic.

## How the React hooks are used

`src/app/page.js` holds all the state:

- `useState` — the notes array, the form fields (`title`, `description`),
  which note (if any) is being edited, and the duplicate-title flag.
- `useEffect` (load) — runs once on mount to read any previously saved
  notes out of `localStorage`.
- `useEffect` (save) — runs whenever `notes` changes, and writes the
  current list back to `localStorage`.
- `useEffect` (duplicate check) — runs whenever `title`, `notes`, or the
  editing note changes, to flag an existing note with the same title.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Project structure

```
src/
  app/
    layout.js       # root layout, loads fonts
    page.js          # main page: state, effects, form, notes grid
    globals.css      # design tokens + styles
  components/
    NoteItem.js      # a single note card
```

## Publishing this to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Notecard notes app"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

Make sure the repository's visibility is set to **Public** (Settings →
General → Danger Zone → Change visibility, if it was created as private).

## Screen recording checklist

When recording the app for submission, it helps to show each requirement
in order:

1. Load the empty app — point out the empty state message.
2. Add a note (title + description) — show it appear in the grid.
3. Try adding a second note with the *same* title — show the warning and
   that the "Add note" button is disabled.
4. Add a couple more distinct notes.
5. Click "Edit" on a note, change its text, save, and show it updated.
6. Click "Delete" on a note and show it disappear.
7. Refresh the page and show the remaining notes are still there
   (localStorage persistence).
