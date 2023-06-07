import { useEffect, useState } from "react";
import { InputComponent } from "./InputComponent";
import { Box, Button } from "@mui/material";

export const GeneralComponent = ({ data, saveChange }) => {
    const [renderData, setRenderData] = useState([]);
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        if (JSON.stringify(data) !== '{}') {
            Object.keys(data).forEach((field) => {
                setRenderData((prev) => {
                    return [...prev, { label: data[field].rus_name, value: data[field].value }];
                });
            });
        }
    }, [data]);
    const changeInput = (value, label) => {
        setDisabled(false);
        setRenderData((prev) => {
            return prev?.map((item) => {
                if (item.label === label) return { ...item, value };
                return item;
            });
        });
    };
    const save = () => {
        const obj = {};
        Object.keys(data)?.forEach((item) => {
            const find = renderData?.find((i) => i.label === data[item].rus_name)?.value;
            obj[item] = { rus_name: data[item].rus_name, value: find };
        });
        saveChange({ reserveData: obj });
    };
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {renderData?.map((item) => (
                <InputComponent
                    key={item.label}
                    label={item.label}
                    value={item.value}
                    disabled={!(item.label === "Адрес доставки" || item.label === "Комментарий к резерву")}
                    changeInput={(e) => changeInput(e.target.value, item.label)}
                />
            ))}
            <Button
                sx={{ width: "120px" }}
                variant="contained"
                disabled={disabled}
                onClick={save}
            >Сохранить</Button>
        </Box>
    );
};