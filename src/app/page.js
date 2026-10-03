"use client";

import { useEffect, useRef, useState } from "react";
import NoteItem from "@/components/NoteItem";

const STORAGE_KEY = "notecard.notes";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [duplicateTitle, setDuplicateTitle] = useState(false);

  // Guards against the "save" effect firing before we've loaded anything,
  // which would otherwise wipe out existing localStorage data on first render.
  const hasLoaded = useRef(false);

  // 1) On mount, check whether notes already exist in localStorage and load them.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setNotes(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Could not read saved notes:", err);
    } finally {
      hasLoaded.current = true;
    }
  }, []);

  // 2) Whenever the notes list changes, persist it.
  useEffect(() => {
    if (!hasLoaded.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  // 3) Bonus: as the user types a title, check whether a note with that
  // title already exists (case-insensitive), ignoring the note being edited.
  useEffect(() => {
    const trimmed = title.trim().toLowerCase();
    if (!trimmed) {
      setDuplicateTitle(false);
      return;
    }
    const exists = notes.some(
      (note) => note.id !== editingId && note.title.trim().toLowerCase() === trimmed
    );
    setDuplicateTitle(exists);
  }, [title, notes, editingId]);

  function resetForm() {
    setTitle("");
    setDescription("");
    setEditingId(null);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();
    if (!trimmedTitle || !trimmedDescription || duplicateTitle) return;

    if (editingId) {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === editingId
            ? { ...note, title: trimmedTitle, description: trimmedDescription, updatedAt: Date.now() }
            : note
        )
      );
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title: trimmedTitle,
        description: trimmedDescription,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setNotes((prev) => [newNote, ...prev]);
    }
    resetForm();
  }

  function handleEdit(note) {
    setEditingId(note.id);
    setTitle(note.title);
    setDescription(note.description);
  }

  function handleDelete(id) {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (editingId === id) resetForm();
  }

  const isEditing = Boolean(editingId);

  return (
    <div className="page">
      <header className="masthead">
        <h1>Notecard</h1>
        <p>A small notes app for things worth writing down.</p>
      </header>

      <div className="layout">
        <section className="composer">
          <h2>{isEditing ? "Edit note" : "New note"}</h2>
          <p className="composer-hint">
            {isEditing ? "Update the note below." : "Give it a title and a few details."}
          </p>
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Grocery list"
                className={duplicateTitle ? "has-error" : ""}
              />
              {duplicateTitle && (
                <p className="field-warning">A note titled "{title.trim()}" already exists.</p>
              )}
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write the details here..."
              />
            </div>
            <div className="composer-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!title.trim() || !description.trim() || duplicateTitle}
              >
                {isEditing ? "Save changes" : "Add note"}
              </button>
              {isEditing && (
                <button type="button" className="btn btn-ghost" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="notes-section">
          <h2>Your notes {notes.length > 0 && `(${notes.length})`}</h2>
          {notes.length === 0 ? (
            <div className="empty-state">
              <strong>No notes yet</strong>
              Add your first one using the form on the left.
            </div>
          ) : (
            <div className="notes-grid">
              {notes.map((note, index) => (
                <NoteItem
                  key={note.id}
                  note={note}
                  index={index}
                  isEditing={note.id === editingId}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
