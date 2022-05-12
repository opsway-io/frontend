import { DataGridProps, DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import { FunctionComponent, useEffect, useRef, useState } from "react";

const DataGrid: FunctionComponent<DataGridProps> = (props) => {
    const [doRender, setDoRender] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setDoRender(true);
    }, [rootRef, doRender]);

    const gridProps: DataGridProps = {
        autoPageSize: true,
        density: "comfortable",
        disableColumnFilter: true,
        disableColumnMenu: true,
        hideFooterSelectedRowCount: true,
        disableColumnSelector: true,
        ...props,
        sx: {
            border: "none",
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader": {
                outline: "none !important",
                userSelect: "none",
            },
            "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor: "inherit",
            },
            "& .MuiDataGrid-footerContainer": {
                justifyContent: "center",
                borderTop: "none",
            },
            "& .MuiDataGrid-columnSeparator": {
                display: "none",
            },
            ...props.sx,
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }} ref={rootRef}>
            {doRender && rootRef.current && (
                <div style={{ height: rootRef.current.clientHeight, width: "100%" }}>
                    <MuiDataGrid {...gridProps} />
                </div>
            )}
        </div>
    );
};

export default DataGrid;
