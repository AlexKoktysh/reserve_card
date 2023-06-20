import { useEffect, useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import { GeneralComponent } from "./GeneralComponent";
import { ReserveComponent } from "./ReserveComponent";

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

export const TabsComponent = (props) => {
    const {
        reserveData,
        save,
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
        columns,
        update,
        setRowSelection,
        rowSelection,
        removeFields,
        disabled,
        removedisabled,
    } = props;
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box>
            <Tabs
                value={value}
                onChange={handleChange}
            >
                <Tab label="Общая информация"></Tab>
                <Tab label="Резерв"></Tab>
            </Tabs>
            <TabPanel value={value} index={0}>
                <GeneralComponent data={reserveData} saveChange={save} />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ReserveComponent
                    update={update}
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
                    setRowSelection={setRowSelection}
                    rowSelection={rowSelection}
                    removeFields={removeFields}
                    disabled={disabled}
                    removedisabled={removedisabled}
                />
            </TabPanel>
        </Box>
    );
};