import { Box, LinearProgress, Sheet, Table, Typography } from "@mui/joy";
import { SxProps } from "@mui/joy/styles/types";
import { ReactNode, useState } from "react";
import DataGridPagination from "./DataGridPagination";

type Align = "left" | "right" | "center";

type RowId = string | number;

interface GridCellParams<R> {
  id: RowId;
  row: R;
  field: string;
  value: any;
}

export interface GridColDef<R = any> {
  field: string;
  headerName?: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  align?: Align;
  headerAlign?: Align;
  sortable?: boolean;
  valueGetter?: (params: GridCellParams<R>) => any;
  renderCell?: (params: GridCellParams<R>) => ReactNode;
}

export type GridRowsProp<R = any> = readonly R[];

interface GridSortItem {
  field: string;
  sort: "asc" | "desc";
}

export interface DataGridProps<R = any> {
  columns: GridColDef<R>[];
  rows: GridRowsProp<R>;
  getRowId?: (row: R) => RowId;
  onRowClick?: (params: { id: RowId; row: R }) => void;
  loading?: boolean;
  noRowsContent?: ReactNode;
  disableCursorOnHover?: boolean;
  rowHeight?: number;
  /** Client side page size. Set to 0 to disable pagination. */
  pageSize?: number;
  hideHeader?: boolean;
  initialState?: { sorting?: { sortModel?: GridSortItem[] } };
  sx?: SxProps;

  // Accepted for backwards compatibility with the MUI X DataGrid API.
  autoHeight?: boolean;
  disableRowSelectionOnClick?: boolean;
}

function sortRows<R>(
  rows: GridRowsProp<R>,
  columns: GridColDef<R>[],
  sortModel: GridSortItem,
  cellParams: (row: R, field: string) => GridCellParams<R>,
): GridRowsProp<R> {
  const column = columns.find((c) => c.field === sortModel.field);
  const valueOf = (row: R) =>
    column?.valueGetter
      ? column.valueGetter(cellParams(row, column.field))
      : (row as any)[sortModel.field];
  const direction = sortModel.sort === "desc" ? -1 : 1;

  return rows.toSorted((a, b) => {
    const valueA = valueOf(a);
    const valueB = valueOf(b);
    if (valueA === valueB) return 0;
    return valueA > valueB ? direction : -direction;
  });
}

function DataGrid<R = any>(props: DataGridProps<R>) {
  const {
    columns,
    rows,
    getRowId = (r: any) => r.id,
    onRowClick,
    loading,
    noRowsContent = "No rows",
    disableCursorOnHover,
    rowHeight = 52,
    pageSize = 10,
    hideHeader,
    initialState,
    sx,
  } = props;

  const [page, setPage] = useState(0);

  const sortModel = initialState?.sorting?.sortModel?.[0];

  const cellParams = (row: R, field: string): GridCellParams<R> => ({
    id: getRowId(row),
    row,
    field,
    value: (row as any)[field],
  });

  const sortedRows = sortModel
    ? sortRows(rows, columns, sortModel, cellParams)
    : rows;

  const pageCount = pageSize > 0 ? Math.ceil(sortedRows.length / pageSize) : 1;
  // Clamp the page when the rows shrink (e.g. after filtering).
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));

  const visibleRows =
    pageSize > 0
      ? sortedRows.slice(currentPage * pageSize, (currentPage + 1) * pageSize)
      : sortedRows;

  const clickable = !!onRowClick && !disableCursorOnHover;

  return (
    <Box sx={{ width: "100%", position: "relative", ...sx }}>
      {loading && (
        <LinearProgress
          size="sm"
          thickness={2}
          sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
        />
      )}

      <Sheet
        variant="plain"
        sx={{ width: "100%", overflowX: "auto", bgcolor: "transparent" }}
      >
        <Table
          hoverRow={clickable}
          sx={{
            tableLayout: "auto",
            "--TableCell-height": `${rowHeight}px`,
            "--TableCell-paddingX": "12px",
            "& tbody tr": {
              cursor: clickable ? "pointer" : "inherit",
            },
            "& tbody tr:last-of-type td": {
              borderBottom: "none",
            },
          }}
        >
          {!hideHeader && (
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.field}
                    style={{
                      width: col.flex ? "auto" : (col.width ?? 120),
                      minWidth: col.minWidth,
                      textAlign: col.headerAlign ?? col.align ?? "left",
                      verticalAlign: "middle",
                    }}
                  >
                    {col.headerName}
                  </th>
                ))}
              </tr>
            </thead>
          )}

          <tbody>
            {visibleRows.map((row) => {
              const id = getRowId(row);

              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.({ id, row })}
                  tabIndex={onRowClick ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target === e.currentTarget) {
                      onRowClick?.({ id, row });
                    }
                  }}
                >
                  {columns.map((col) => {
                    const params = cellParams(row, col.field);
                    if (col.valueGetter) params.value = col.valueGetter(params);

                    return (
                      <td
                        key={col.field}
                        style={{
                          textAlign: col.align ?? "left",
                          verticalAlign: "middle",
                        }}
                      >
                        {col.renderCell
                          ? col.renderCell(params)
                          : (params.value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}

            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} style={{ height: 120 }}>
                  <Typography
                    level="body-sm"
                    textColor="text.tertiary"
                    textAlign="center"
                  >
                    {loading ? "Loading…" : noRowsContent}
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Sheet>

      {pageCount > 1 && (
        <DataGridPagination
          page={currentPage}
          pageCount={pageCount}
          onPageChange={setPage}
        />
      )}
    </Box>
  );
}

export default DataGrid;
