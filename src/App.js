import { Button, Input } from "@mui/material";
import Box from "@mui/material/Box/Box";
import { useEffect, useState } from "react";
import { removeItem, reserveItemInfo, updateItems } from "./api";
import UserDialogComponent from "./components/UserDialogComponent";
import { TabsComponent } from "./components/TabsComponent.jsx";

const start_columns = [
  {
    accessorKey: "id",
    header: "№",
    enableSorting: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    enableGlobalFilter: false,
    size: 60,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
  },
  {
    accessorKey: "name_print",
    header: "Наименование товара",
    enableGlobalFilter: false,
    size: 60,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
  },
  {
    accessorKey: "price",
    enableGlobalFilter: false,
    header: "Цена за ед-цу (BYN)",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 60,
  },
  {
    accessorKey: "article",
    enableGlobalFilter: false,
    header: "Артикул",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 60,
  },
  {
    accessorKey: "product_cost_with_vat",
    enableGlobalFilter: false,
    header: "Цена с НДС, BYN",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 60,
  },
  {
    accessorKey: "qty",
    enableGlobalFilter: false,
    header: "Зарезервировано",
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
    size: 60,
  },
  {
    accessorKey: "action",
    header: "Добавить в резерв",
    enableSorting: false,
    enableColumnFilter: false,
    enableColumnActions: false,
    size: 60,
    muiTableHeadCellProps: {
      align: "center",
    },
    muiTableBodyCellProps: {
      align: "center",
    },
  },
];

export const App = () => {
  const [disabled, setDisabled] = useState(true);
  const [removedisabled, setRemovedisabled] = useState(true);
  const [reserve, setReserveData] = useState({});
  const [data, setData] = useState({});
  const [selectedTab, setSelectedTab] = useState(0);

  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex:
      Number(sessionStorage.getItem("tradeics_reserve_item_pageIndex")) || 0,
    page: Number(sessionStorage.getItem("tradeics_reserve_item_page")) || 1,
    pageSize:
      Number(sessionStorage.getItem("tradeics_reserve_item_pageSize")) || 10,
    pageCount: Math.ceil(totalRecords / 10) || 0,
    skip: Number(sessionStorage.getItem("tradeics_reserve_item_skip")) || 0,
  });
  const [sorting, setSorting] = useState(
    JSON.parse(sessionStorage.getItem("tradeics_reserve_item_sorting")) || []
  );
  const [columnFilters, setColumnFilters] = useState(
    JSON.parse(sessionStorage.getItem("tradeics_reserve_item_columnFilters")) ||
      []
  );
  const [globalFilter, setGlobalFilter] = useState(
    JSON.parse(sessionStorage.getItem("tradeics_reserve_item_globalFilter")) ||
      ""
  );
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState(start_columns);
  const [rowSelection, setRowSelection] = useState({});
  const [selected, setSelected] = useState({});

  const save = (obj) => {
    const items = {};
    for (const key in obj.reserveData) {
      items[key] = obj.reserveData[key]?.value;
    }
    setData(() => {
      const custom = rows.map((el) => {
        return {
          ...el,
          qty: el.qty.props.children[0].props.value,
        };
      });
      return {
        productData: custom,
        reserveData: items,
      };
    });
  };
  const clickUpdate = (obj) => {
    const rows_item = obj.map((row) => {
      return {
        ...row,
        qty: row.qty.props.children[0].props.value,
      };
    });
    const items = {};
    setReserveData((prev) => {
      for (const key in prev) {
        items[key] = prev[key]?.value;
      }
      return prev;
    });
    update({ productData: rows_item }, items);
  };
  const update = (obj, userItems) => {
    let items = userItems;
    if (!userItems) {
      items = {};
      for (const key in reserve) {
        items[key] = reserve[key]?.value;
      }
    }
    setData({
      reserveData: items,
      productData: obj.productData,
    });
  };
  useEffect(() => {
    const fetch = async (params) => {
      setLoading(true);
      setDisabled(true);
      const data = await updateItems(params);
      const { productData, reserveData } = data;
      const { columns, rows } = productData;
      const custom_rows = custom(rows)
      setReserveData(reserveData);
      setRows(custom_rows);
      setColumns(columns);
      setTotalRecords(totalRecords);
      setLoading(false);
    };
    if (data?.productData) {
      const custom_row = rows.map((row) => {
        return {
          ...row,
          qty: row.qty.props.children[0].props.value
        };
      });
      fetch({ productData: custom_row, reserveData: data.reserveData });
    }
  }, [data]);

  const custom = (rows_custom) => {
    const custom_rows = rows_custom?.map((row) => {
      return {
        ...row,
        qty: (
          <Box className='reserve-qty-container'>
            <Input
              value={row?.qty}
              onChange={(e) => change(row.id, e.target.value)}
            />
            <Button
              size='small'
              variant='contained'
              className='button disable-warning-button'
              disabled={true}
              // endIcon={<EditDocIcon />}
              onClick={() => clickUpdate(rows)}
            >
              Сохранить
            </Button>
          </Box>
        ),
        remove_position: (
          <UserDialogComponent
            disabled={false}
            openDialogText={"Удалить"}
            // openDialogIcon={<RecycleIcon />}
            agreeActionFunc={() => remove(row)}
            agreeActionText='Подтвердить'
            openedDialogTitle='Удаление товарной позиции из резерва'
            openedDialogMessage={`${rows_custom.length === 1 ? "Резерв будет удален полность!" : "После нажатия кнопки Подтвердить, товары будут исключены из резерва, продолжить?"}`}
            className='button cancel-button'
            containerClassname='text-center'
          />
        ),
      };
    });
    return custom_rows;
  };

  const remove = async (obj) => {
    let id = "";
    setReserveData((prev) => {
      id = prev["document_id"]?.value
      return prev;
    });
    const removeobj = {
      "name_print": [obj["name_print"]],
      "reserve_id": id,
    };
    setLoading(true);
    setDisabled(true);
    const data = await removeItem(removeobj);
    const { productData, reserveData } = data;
    const { columns, rows } = productData;
    const custom_rows = custom(rows);
    setReserveData(reserveData);
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
    setLoading(false);
  };
  const change = (id, value) => {
    setDisabled(!!!value);
    setRows((prev) => {
      const obj = prev.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            qty: (
              <Box className='reserve-qty-container'>
                <Input
                  value={value}
                  onChange={(e) => change(row.id, e.target.value)}
                />
                <Button
                  size='small'
                  variant='contained'
                  className='button disable-warning-button'
                  disabled={!!!value}
                  // endIcon={<EditDocIcon />}
                  onClick={() => clickUpdate(prev)}
                >
                  Сохранить
                </Button>
              </Box>
            ),
          };
        }
        return row;
      });
      return obj;
    });
  };

  const fetchProduct = async (params) => {
    setLoading(true);
    const data = await reserveItemInfo(params);
    const { productData, reserveData } = data;
    const { columns, rows } = productData;
    const custom_rows = custom(rows)
    setReserveData(reserveData);
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct({
      filters: columnFilters,
      sorting,
      take: pagination.pageSize,
      skip: pagination.skip,
      searchText: globalFilter,
    });
    sessionStorage.removeItem("tradeics_reserve_item_pageIndex");
    sessionStorage.removeItem("tradeics_reserve_item_page");
    sessionStorage.removeItem("tradeics_reserve_item_pageSize");
    sessionStorage.removeItem("tradeics_reserve_item_skip");
    sessionStorage.removeItem("tradeics_reserve_item_sorting");
    sessionStorage.removeItem("tradeics_reserve_item_columnFilters");
    sessionStorage.removeItem("tradeics_reserve_item_globalFilter");
  }, [
    pagination.skip,
    pagination.pageSize,
    sorting,
    columnFilters,
    globalFilter,
  ]);

  useEffect(() => {
    setPagination((prev) => {
      return {
        ...prev,
        pageCount: Math.ceil(totalRecords / pagination.pageSize),
      };
    });
  }, [pagination?.pageSize, totalRecords]);
  useEffect(() => {
    setPagination((prev) => {
      return {
        ...prev,
        skip: pagination.page * pagination.pageSize - pagination.pageSize,
      };
    });
  }, [pagination.page, pagination.pageSize]);

  useEffect(() => {
    const items = [];
    for (const key in rowSelection) {
      const selectedRows = rows.find((row) => row.id === Number(key))["name_print"];
      items.push(selectedRows);
    }
    setSelected({
      "name_print": items,
      "reserve_id": reserve["document_id"]?.value,
    });
  }, [rowSelection]);

  useEffect(() => {
    if (selected["name_print"]?.length) {
      return setRemovedisabled(false);
    }
    setRemovedisabled(true);
  }, [selected]);

  return (
    <Box className='content-container'>
      <TabsComponent
        reserveData={reserve}
        save={save}
        totalRecords={totalRecords}
        pagination={pagination}
        setPagination={setPagination}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        loading={loading}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        rows={rows}
        columns={columns}
        update={update}
        selectedTab={selectedTab}
        setSelectedTabHandler={setSelectedTab}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        removeFields={() => removeItem(selected)}
        disabled={disabled}
        removedisabled={removedisabled}
      />
    </Box>
  );
};