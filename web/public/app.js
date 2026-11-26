const form = document.getElementById('note-form');
const input = document.getElementById('note-input');
const list = document.getElementById('notes-list');

async function loadNotes() {
  const res = await fetch('/notes');
  if (!res.ok) return;
  const notes = await res.json();
  list.innerHTML = notes
    .map(
      (n) =>
        `<li>${escapeHtml(n.content)}<small>${new Date(n.created_at).toLocaleString()}</small></li>`
    )
    .join('');
}

function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const content = input.value.trim();
  if (!content) return;
  const res = await fetch('/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  if (res.ok) {
    input.value = '';
    await loadNotes();
  }
});

loadNotes();
