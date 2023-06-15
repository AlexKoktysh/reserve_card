import MaterialReactTable from "material-react-table";
import { MRT_Localization_RU } from "material-react-table/locales/ru";
import PaginationComponent from "./PaginationComponent";
import { Button } from "@mui/material";
import { useEffect } from "react";

export const ReserveComponent = (props) => {
    const {
        update,
        totalRecords,
        pagination,
        setPagination,
        sorting,
        setSorting,
        columnFilters,
        setColumnFilters,
        loading,
        globalFilter,
        setGlobalFilter,
        rows,
        columns
    } = props;
    useEffect(() => {
        const item = document.getElementsByClassName("pagination");
        const parent = item[0].parentNode;
        parent.style.width = "100%";
        parent.style.border = "1px solid #e0e0e0";
    }, [rows]);
    return (
        <div style={{ height: 1000, width: '100%', overflowY: 'auto' }}>
            <MaterialReactTable
                columns={columns}
                data={rows}
                enableRowSelection={false}
                initialState={{ density: 'compact' }}
                state={{
                    pagination,
                    sorting,
                    columnFilters,
                    globalFilter,
                    showSkeletons: loading,
                }}
                onPaginationChange={setPagination}
                onSortingChange={setSorting}
                onColumnFiltersChange={setColumnFilters}
                onGlobalFilterChange={setGlobalFilter}
                rowCount={totalRecords}
                localization={MRT_Localization_RU}
                defaultColumn={{
                    minSize: 40,
                    maxSize: 300,
                    size: 250,
                }}
                muiTablePaginationProps={{
                    rowsPerPageOptions: [5, 10, 20],
                    showFirstButton: false,
                    showLastButton: false,
                    width: "100%",
                    className: "pagination",
                    ActionsComponent: () => PaginationComponent({ setPagination, pagination })
                }}
            />
            <Button variant="contained" onClick={update}>Сохранить все</Button>
        </div>
    );
};