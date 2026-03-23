import { cn } from '../../lib/utils';

/**
 * @param {{ key: string, title: string, className?: string, render?: (row: object) => React.ReactNode }[]} columns
 * @param {object[]} rows — каждая строка должна иметь уникальный id
 */
export function DataTable({ columns, rows, emptyText = 'Нет данных' }) {
  if (!rows.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-700 bg-surface-800/50 py-16 text-center text-sm text-zinc-500">
        {emptyText}
      </div>
    );
  }
  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-surface-800/60">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-700/80 bg-surface-900/80">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn('px-4 py-3 font-semibold text-zinc-300', col.className)}
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-zinc-800/80 transition-colors hover:bg-surface-700/40"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-zinc-200">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
