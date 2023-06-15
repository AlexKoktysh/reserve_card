import { useEffect, useState } from "react";
import { TabsComponent } from "./components/TabsComponent";
import { reserveItemInfo } from "./api";
import UserDialogComponent from "./components/UserDialogComponent";
import { Button, Input } from "@mui/material";

const start_columns = [
  {
    "accessorKey": "id",
    "header": "№",
    "enableSorting": false,
    "enableColumnFilter": false,
    "enableColumnActions": false,
    "enableGlobalFilter": false,
    "size": 60,
    "muiTableHeadCellProps": {
        "align": "center"
    },
    "muiTableBodyCellProps": {
        "align": "center"
    }
  },
  {
    "accessorKey": "name_print",
    "header": "Наименование товара",
    "enableGlobalFilter": false,
    "size": 60,
    "muiTableHeadCellProps": {
        "align": "center"
    },
    "muiTableBodyCellProps": {
        "align": "center"
    }
  },
  {
    "accessorKey": "price",
    "enableGlobalFilter": false,
    "header": "Цена за ед-цу (BYN)",
    "muiTableHeadCellProps": {
        "align": "center"
    },
    "muiTableBodyCellProps": {
        "align": "center"
    },
    "size": 60
  },
  {
    "accessorKey": "article",
    "enableGlobalFilter": false,
    "header": "Артикул",
    "muiTableHeadCellProps": {
        "align": "center"
    },
    "muiTableBodyCellProps": {
        "align": "center"
    },
    "size": 60
  },
  {
    "accessorKey": "product_cost_with_vat",
    "enableGlobalFilter": false,
    "header": "Цена с НДС, BYN",
    "muiTableHeadCellProps": {
        "align": "center"
    },
    "muiTableBodyCellProps": {
        "align": "center"
    },
    "size": 60
  },
  {
    "accessorKey": "qty",
    "enableGlobalFilter": false,
    "header": "Доступно для резерва",
    "muiTableHeadCellProps": {
        "align": "center"
    },
    "muiTableBodyCellProps": {
        "align": "center"
    },
    "size": 60
  },
  {
    "accessorKey": "action",
    "header": "Добавить в резерв",
    "enableSorting": false,
    "enableColumnFilter": false,
    "enableColumnActions": false,
    "size": 60,
    "muiTableHeadCellProps": {
        "align": "center"
    },
    "muiTableBodyCellProps": {
        "align": "center"
    }
  },
];

export const App = () => {
  const [reserve, setReserveData] = useState({});
  const [data, setData] = useState({});
  const [show, setShow] = useState(false);

  const [totalRecords, setTotalRecords] = useState(0);
  const [pagination, setPagination] = useState({
    pageIndex: Number(sessionStorage.getItem("pageIndex")) || 0,
    page: Number(sessionStorage.getItem("page")) || 1,
    pageSize: Number(sessionStorage.getItem("pageSize")) || 10,
    pageCount: Math.ceil(totalRecords / 10) || 0,
    skip: Number(sessionStorage.getItem("skip")) || 0,
  });
  const [sorting, setSorting] = useState(JSON.parse(sessionStorage.getItem("sorting")) || []);
  const [columnFilters, setColumnFilters] = useState(JSON.parse(sessionStorage.getItem("columnFilters")) || []);
  const [globalFilter, setGlobalFilter] = useState(JSON.parse(sessionStorage.getItem("globalFilter")) || "");
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState(start_columns);

  // const getInfo = async () => {
  //   const params = { filters: columnFilters, sorting, take: pagination.pageSize, skip: pagination.skip, searchText: globalFilter };
  //   const data = await reserveItemInfo(params);
  //   const { productData, reserveData } = data;
  //   setData(data);
  //   setProductData(productData);
  //   setReserveData(reserveData);
  // };

  const save = (obj) => {
    setShow(true);
    setData((prev) => {
      return {
        ...prev,
        ...obj,
      };
    });
  };
  const update = () => {
    setRows((prev) => {
      setData({
        productData: {
          rows: prev
        }
      })
      return prev;
    });
    setColumns((prev) => {
      setData((pr) => {
        return {
          ...pr,
          productData: {
            ...pr.productData,
            columns: prev
          },
        };
      });
      return prev;
    });
    setReserveData((prev) => {
      setData((pr) => {
        return {
          ...pr,
          reserveData: {
            ...prev,
          },
        };
      });
      return prev;
    });
    console.log(data)
  };
  // useEffect(() => {
  //   console.log(data)
  // }, [data])
  const remove = (id) => {};
  const change = (id, value) => {
    setRows((prev) => {
      const obj = prev.map((row) => {
        if (row.id === id) {
          return {
            ...row,
            qty: <Input value={value} onChange={(e) => change(row.id, e.target.value)} />,
          };
        }
        return row;
      });
      return obj;
    });
  };
  const close = () => {};

  const fetchProduct = async (params) => {
    setLoading(true);
    const data = await reserveItemInfo(params);
    const { productData, reserveData } = data;
    const { columns, rows } = productData;
    const custom_rows = rows?.map((row) => {
      return {
        ...row,
        qty: (
          <Input value={row?.qty} onChange={(e) => change(row.id, e.target.value)} />
        ),
        remove_position: (
          <UserDialogComponent
            openDialogText="Удалить из резерва"
            openedDialogTitle="Удалить из резерва"
            openedDialogMessage={true}
            agreeActionText="Да"
            desAgreeActionText="Нет"
            desAgreeActionFunc={close}
            agreeActionFunc={() => remove(row?.id)}
            max_qty={row?.qty}
            disabled={row?.add_to_reserve?.disabled}
          />
        ),
        update_reserve: <Button onClick={update}>Сохранить</Button>,
      };
    });
    setReserveData(reserveData);
    setRows(custom_rows);
    setColumns(columns);
    setTotalRecords(totalRecords);
    setLoading(false);
  };

  useEffect(() => {
      fetchProduct({ filters: columnFilters, sorting, take: pagination.pageSize, skip: pagination.skip, searchText: globalFilter });
      sessionStorage.removeItem("pageIndex");
      sessionStorage.removeItem("page");
      sessionStorage.removeItem("pageSize");
      sessionStorage.removeItem("skip");
      sessionStorage.removeItem("sorting");
      sessionStorage.removeItem("columnFilters");
      sessionStorage.removeItem("globalFilter");
    }, 
    [
      pagination.skip,
      pagination.pageSize,
      sorting,
      columnFilters,
      globalFilter,
    ],
  );

  useEffect(() => {
    show && console.log(data);
  }, [data, show]);
  useEffect(() => {
    setPagination((prev) => {
        return { ...prev, pageCount: Math.ceil(totalRecords / pagination.pageSize) };
    });
  }, [pagination?.pageSize, totalRecords]);
  useEffect(() => {
      setPagination((prev) => {
        return { ...prev, skip: pagination.page * pagination.pageSize - pagination.pageSize };
      });
  }, [pagination.page, pagination.pageSize]);

  return (
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
    />
  );
};