"use client";

const TAB_COLORS = ["#b5451b", "#2f6f62", "#b8862f"];

function formatDate(timestamp) {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Renders a single note "card".
 * Props:
 *  - note: { id, title, description, createdAt, updatedAt }
 *  - index: position in the list, used only to vary the tab color
 *  - isEditing: whether this note is currently being edited
 *  - onEdit(note): called when the Edit button is clicked
 *  - onDelete(id): called when the Delete button is clicked
 */
export default function NoteItem({ note, index, isEditing, onEdit, onDelete }) {
  const tabColor = TAB_COLORS[index % TAB_COLORS.length];

  return (
    <article
      className={`note-card${isEditing ? " is-editing" : ""}`}
      style={{ "--tab-color": tabColor }}
    >
      <h3>{note.title}</h3>
      <p>{note.description}</p>
      <div className="note-meta">
        {note.updatedAt && note.updatedAt !== note.createdAt
          ? `Edited ${formatDate(note.updatedAt)}`
          : `Added ${formatDate(note.createdAt)}`}
      </div>
      <div className="note-actions">
        <button className="icon-btn" onClick={() => onEdit(note)}>
          Edit
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(note.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
