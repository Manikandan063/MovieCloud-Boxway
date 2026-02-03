import React from 'react';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
}

function DataTable<T extends { id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'No data available',
  isLoading = false,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="bg-white border border-[#C7BFB4]/30 overflow-hidden shadow-sm">
        <div className="p-12 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="h-4 bg-muted animate-pulse rounded flex-1" />
              <div className="h-4 bg-muted animate-pulse rounded flex-1" />
              <div className="h-4 bg-muted animate-pulse rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white border border-[#C7BFB4]/30 overflow-hidden shadow-sm">
        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-2">
          <p className="font-medium">{emptyMessage}</p>
          <p className="text-xs">Try adjusting your filters or search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#C7BFB4]/30 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`${column.className || ''} ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`group transition-colors ${onRowClick ? 'cursor-pointer hover:bg-muted/30' : ''}`}
              >
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.key}`}
                    className={`${column.className || ''} ${column.align === 'right' ? 'text-right' : column.align === 'center' ? 'text-center' : 'text-left'}`}
                  >
                    {column.render
                      ? column.render(item)
                      : (item as Record<string, unknown>)[column.key] as React.ReactNode}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
