import { Sheet, Table } from "@mui/joy";
import { FunctionComponent, ReactNode } from "react";

interface ReportTableColumn {
  label: string;
  align?: "left" | "right";
}

interface ReportTableProps {
  ariaLabel: string;
  columns: ReportTableColumn[];
  /** The table body rows (`<tr>` elements). */
  children: ReactNode;
}

const ReportTable: FunctionComponent<ReportTableProps> = ({
  ariaLabel,
  columns,
  children,
}) => (
  <Sheet variant="outlined" sx={{ borderRadius: "lg", overflow: "auto" }}>
    <Table
      hoverRow
      aria-label={ariaLabel}
      sx={{
        minWidth: 650,
        "& tbody tr:last-child td": { borderBottom: 0 },
        "& .align-right": { textAlign: "right" },
      }}
    >
      <thead>
        <tr>
          {columns.map((column) => (
            <th
              key={column.label}
              className={column.align === "right" ? "align-right" : undefined}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </Table>
  </Sheet>
);

export default ReportTable;
