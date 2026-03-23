function escapeCell(v) {
  if (v == null || v === '') return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

/** Скачивание CSV с BOM для Excel (UTF-8). */
export function downloadCsv(filename, headers, rows) {
  const head = headers.map((h) => escapeCell(h)).join(';');
  const body = rows.map((row) => row.map((cell) => escapeCell(cell)).join(';'));
  const csv = '\uFEFF' + [head, ...body].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
