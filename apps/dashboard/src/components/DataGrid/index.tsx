import { Box, Pagination } from "@mui/material";
import {
  DataGridProps as MuiDataGridProps,
  DataGrid as MuiDataGrid,
  gridPageCountSelector,
  gridPageSelector,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import React, { FunctionComponent, ReactNode } from "react";

interface DataGridProps extends MuiDataGridProps {
  disableCursorOnHover?: boolean;
  noRowsContent?: string;
}

const DataGrid: FunctionComponent<DataGridProps> = (props) => {
  const gridProps: DataGridProps = {
    autoHeight: true,
    density: "comfortable",
    disableColumnFilter: true,
    disableColumnMenu: true,
    hideFooterSelectedRowCount: true,
    disableColumnSelector: true,
    paginationModel: {
      page: 0,
      pageSize: 10,
    },
    ...props,
    sx: {
      border: "none",
      "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader":
        {
          outline: "none !important",
          userSelect: "none",
        },
      "& .MuiDataGrid-row:hover": {
        cursor: props.disableCursorOnHover ? "inherit" : "pointer",
      },
      "& .MuiDataGrid-row.Mui-selected": {
        backgroundColor: "inherit",
      },
      "& .MuiDataGrid-footerContainer": {
        justifyContent: "center",
        borderTop: "none",
      },
      "& .MuiDataGrid-columnSeparator": {
        display: "none",
      },
      "& .MuiDataGrid-columnHeaders": {
        minHeight: "64px !important",
        maxHeight: "64px !important",
        lineHeight: "64px !important",
        opacity: 0.75,
      },
      "& .MuiDataGrid-columnHeaderTitle": {
        fontWeight: 400,
      },
      ...props.sx,
    },
    components: {
      Footer: CustomFooter,
      NoRowsOverlay: CustomNoRowsOverlay,
    },
    componentsProps: {
      noRowsOverlay: {
        content: props.noRowsContent || "",
      },
    },
  };

  return <MuiDataGrid {...gridProps} />;
};

export default DataGrid;

const CustomFooter: FunctionComponent = () => {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 1,
      }}
    >
      <Pagination
        hidden={pageCount <= 1}
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
        shape="rounded"
        sx={{
          padding: 1,
        }}
      />
    </Box>
  );
};

interface CustomNoRowsOverlayProps {
  content?: string | ReactNode | ReactNode[];
}

const CustomNoRowsOverlay: FunctionComponent<CustomNoRowsOverlayProps> = (
  props,
) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {props.content}
    </Box>
  );
};

CustomNoRowsOverlay.defaultProps = {
  content: "No rows",
};
