import { TextField } from "@mui/material";

export const InputComponent = ({ label, value, disabled, changeInput }) => {
    return (
        <TextField
            sx={{ marginY: "20px", width: "100%" }}
            disabled={disabled}
            label={label}
            value={value}
            multiline
            maxRows={4}
            onChange={changeInput}
        />
    );
};