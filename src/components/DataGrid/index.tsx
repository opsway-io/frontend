import { DataGridProps, DataGrid as MuiDataGrid } from "@mui/x-data-grid";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { debounce } from "../../helpers/debounce";

const DataGrid: FunctionComponent<DataGridProps> = (props) => {
    const [rootRefReady, setRootRefReady] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setDimensions] = useState({
        height: window.innerHeight,
        width: window.innerWidth,
    });

    useEffect(() => {
        const debouncedHandleResize = debounce(() => {
            setDimensions({
                height: window.innerHeight,
                width: window.innerWidth,
            });
        }, 10);

        window.addEventListener("resize", debouncedHandleResize);

        return () => {
            window.removeEventListener("resize", debouncedHandleResize);
        };
    });

    useEffect(() => setRootRefReady(!!rootRef.current), [rootRef]);

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
            "& .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader":
                {
                    outline: "none !important",
                    userSelect: "none",
                },
            "& .MuiDataGrid-row:hover": {
                cursor: "pointer",
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
            ...props.sx,
        },
    };

    return (
        <div style={{ height: "100%", width: "100%" }} ref={rootRef}>
            {rootRefReady && (
                <div style={{ height: rootRef.current?.clientHeight, width: "100%" }}>
                    <MuiDataGrid {...gridProps} />
                </div>
            )}
        </div>
    );
};

export default DataGrid;
