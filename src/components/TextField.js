import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles';

export const NeumorphismTextField = styled(TextField)({
    border: "none",
    outline: "none",
    background: "#f1f8fd",
    borderRadius: "12px",
    "& fieldset" : {border: "none"},
    boxShadow: "inset 5px 5px 5px #cdd3d7, inset -5px -5px 5px #ffffff"
})