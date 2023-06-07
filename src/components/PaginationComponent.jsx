import MuiPagination from "@mui/material/Pagination";

function PaginationComponent(props) {
    const { setPagination, pagination } = props;
    const change = (value) => {
        setPagination((prev) => {
            return {...prev, pageIndex: value - 1, page: value};
        });
    };
    return (
        <MuiPagination
            sx={(theme) => ({ padding: theme.spacing(1.5, 0) })}
            color="primary"
            count={pagination.pageCount}
            page={pagination.page}
            onChange={(event, value) => change(value)}
        />
    );
};
  
export default PaginationComponent;