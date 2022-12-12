import { Button } from '@mui/material'
import { styled } from '@mui/material/styles';

export const FormButton = styled(Button)({
    width: "15em",
    height: "3em",
    background: "#f1f8fd",
    color:"#000000",
    borderRadius: "15px",
    fontSize: "20px",
    border: "none",
    position: "relative",
    zIndex: "1",
    boxShadow: "2px 2px 2px rgba(0, 0, 0, 0.05), -2px -2px 2px rgba(255, 255, 255, 0.5), inset 3px 3px 3px rgba(255, 255, 255, 0.5), inset -3px -3px 3px rgba(0, 0, 0, 0.05)",

    '&:before': {
        content: '""',
        width: "0",
        height: "3em",
        borderRadius: "15px",
        position: "absolute",
        top: "0",
        left: "0",
        backgroundImage: "linear-gradient(to right, #0fd850 0%, #f9f047 100%)",
        transition: "0.75s ease",
        display: "block",
        zIndex: "-1"
    },
    "&:hover:before": {
        width: "15em"
    },
})

export const LoginButton = styled(FormButton)({
    width: "50%",
    
    "&:hover:before": {
        width: "100%"
    },
})

export const IconButton = styled(FormButton)({
    width:"45px",
    borderRadius:"50%",
    height:"45px",
    minWidth:"45px",
    '&:before': {
        borderRadius:"50%",
        height:"45px",
    },
    "&:hover:before": {
        width: "45px",
    },
})

export const ActionButton = styled(IconButton)({
    width:"40px",
    height:"40px",
    minWidth:"40px",
    '&:before': {
        height:"40px",
    },
    "&:hover:before": {
        width: "40px",
    },
})

export const ManagerButton = styled(FormButton)({
    width:"200px",
    "&:hover:before": {
        width: "200px"
    },
})

export const ModalButton = styled(FormButton)({
    width:"100px",
    height: "2em",
    '&:before': {
        height:"2em"
    },
    "&:hover:before": {
        width: "100px",
        height:"2em"
    },
})