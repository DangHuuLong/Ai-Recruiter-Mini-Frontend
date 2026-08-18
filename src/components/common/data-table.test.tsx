import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { renderWithIntl } from '@/test/render-with-intl';

import { DataTable, type DataTableColumn } from './data-table';

const MESSAGES = {
  common: {
    dataTable: {
      noData: 'No data available.',
      selectAllRows: 'Select all rows',
      selectRow: 'Select row',
      sortAscending: 'Sort ascending',
      sortDescending: 'Sort descending',
      filterLabel: 'Filter',
      filterAll: 'All',
    },
    emptyState: { title: 'No data', description: "There's nothing to show here yet." },
  },
};

type Row = { id: string; name: string; status: string };

const ROWS: Row[] = [
  { id: 'row-1', name: 'Jane Doe', status: 'ACTIVE' },
  { id: 'row-2', name: 'John Smith', status: 'INACTIVE' },
];

const BASIC_COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', render: (row) => row.name },
];

const SORTABLE_FILTERABLE_COLUMNS: DataTableColumn<Row>[] = [
  { key: 'name', header: 'Name', render: (row) => row.name, sortKey: 'name' },
  {
    key: 'status',
    header: 'Status',
    render: (row) => row.status,
    filter: {
      key: 'status',
      options: [
        { label: 'Active', value: 'ACTIVE' },
        { label: 'Inactive', value: 'INACTIVE' },
      ],
      activeValue: '',
    },
  },
];

describe('DataTable', () => {
  it('renders an EmptyState instead of a table when data is empty', () => {
    renderWithIntl(
      <DataTable data={[]} columns={BASIC_COLUMNS} getRowKey={(row: Row) => row.id} />,
      MESSAGES,
    );

    expect(screen.getByText('No data available.')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('renders one row per item via each column render function', () => {
    renderWithIntl(<DataTable data={ROWS} columns={BASIC_COLUMNS} getRowKey={(row: Row) => row.id} />, MESSAGES);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(3); // 1 header + 2 data rows
  });

  it('selecting a single row calls onChange with just that row added', () => {
    const onChange = vi.fn();
    renderWithIntl(
      <DataTable
        data={ROWS}
        columns={BASIC_COLUMNS}
        getRowKey={(row: Row) => row.id}
        selection={{ selectedIds: new Set(), onChange }}
      />,
      MESSAGES,
    );

    const rowCheckboxes = screen.getAllByRole('checkbox', { name: 'Select row' });
    fireEvent.click(rowCheckboxes[0]);

    expect(onChange).toHaveBeenCalledWith(new Set(['row-1']));
  });

  it('"select all" toggles every row on, then off', () => {
    const onChange = vi.fn();
    const { rerender } = renderWithIntl(
      <DataTable
        data={ROWS}
        columns={BASIC_COLUMNS}
        getRowKey={(row: Row) => row.id}
        selection={{ selectedIds: new Set(), onChange }}
      />,
      MESSAGES,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenLastCalledWith(new Set(['row-1', 'row-2']));

    rerender(
      <DataTable
        data={ROWS}
        columns={BASIC_COLUMNS}
        getRowKey={(row: Row) => row.id}
        selection={{ selectedIds: new Set(['row-1', 'row-2']), onChange }}
      />,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onChange).toHaveBeenLastCalledWith(new Set());
  });

  it('marks "select all" indeterminate when only some rows are selected', () => {
    renderWithIntl(
      <DataTable
        data={ROWS}
        columns={BASIC_COLUMNS}
        getRowKey={(row: Row) => row.id}
        selection={{ selectedIds: new Set(['row-1']), onChange: vi.fn() }}
      />,
      MESSAGES,
    );

    const selectAll = screen.getByRole('checkbox', { name: 'Select all rows' }) as HTMLInputElement;
    expect(selectAll.indeterminate).toBe(true);
    expect(selectAll.checked).toBe(false);
  });

  it('clicking "sort ascending" in a sortable column header calls onSortChange', () => {
    const onSortChange = vi.fn();
    renderWithIntl(
      <DataTable
        data={ROWS}
        columns={SORTABLE_FILTERABLE_COLUMNS}
        getRowKey={(row: Row) => row.id}
        onSortChange={onSortChange}
      />,
      MESSAGES,
    );

    fireEvent.click(screen.getByRole('button', { name: /Name/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Sort ascending' }));

    expect(onSortChange).toHaveBeenCalledWith('name', 'asc');
  });

  it('clicking a filter option in a filterable column header calls onFilterChange', () => {
    const onFilterChange = vi.fn();
    renderWithIntl(
      <DataTable
        data={ROWS}
        columns={SORTABLE_FILTERABLE_COLUMNS}
        getRowKey={(row: Row) => row.id}
        onFilterChange={onFilterChange}
      />,
      MESSAGES,
    );

    fireEvent.click(screen.getByRole('button', { name: /Status/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Active' }));

    expect(onFilterChange).toHaveBeenCalledWith('status', 'ACTIVE');
  });

  it('a column without sortKey/filter renders as plain header text (no menu button)', () => {
    renderWithIntl(<DataTable data={ROWS} columns={BASIC_COLUMNS} getRowKey={(row: Row) => row.id} />, MESSAGES);

    const headerRow = screen.getAllByRole('row')[0];
    expect(within(headerRow).queryByRole('button')).not.toBeInTheDocument();
    expect(within(headerRow).getByText('Name')).toBeInTheDocument();
  });
});
