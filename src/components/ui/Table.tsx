import React from 'react';
import { cn } from '../../utils/cn';

export interface TableColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (item: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  className?: string;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'No hay registros disponibles',
  className,
}: TableProps<T>) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-cato-border bg-white', className)}>
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="bg-cato-surface-header border-b border-cato-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-bold text-cato-slate uppercase tracking-wider',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-cato-border">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-xs text-cato-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={keyExtractor(item)}
                className="hover:bg-cato-canvas/60 transition-colors duration-100"
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3 text-cato-text', col.className)}>
                    {col.render
                      ? col.render(item, index)
                      : ((item as Record<string, unknown>)[col.key] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
