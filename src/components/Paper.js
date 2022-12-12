import { Box } from '@mui/material/'
import { styled } from '@mui/material/styles';

export const InfoPaper = styled(Box)({
    background: "#f1f8fd",
    boxShadow: "15px 15px 25px 0 rgba(0, 0, 0, 0.2)",
    borderRadius: "15px",
    width:"100%", 
})

export const MenuPaper = styled(Box)({
    background: "#f1f8fd",
    boxShadow: "15px 15px 25px 0 rgba(0, 0, 0, 0.2)", 
    borderRadius: "15px", 
    height:"100px", 
    display:"flex", 
    justifyContent:"center", 
    alignItems:"center"
})

export const EditPaper = styled(Box)({
    height:"100%", 
    backgroundColor: "#f1f8fd", 
    boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.3)",
    borderRadius: "40px",
    boxSizing: "border-box", 
    display:"inline-flex", 
    flexFlow:"row wrap", 
    width:"100%", 
    alignContent: "space-between"
})

export const LoginPaper = styled(Box)({
    backgroundColor:"#f1f8fd", 
    width:"50%", 
    boxShadow: "20px 20px 30px 0 rgba(0, 0, 0, 0.2)",
    borderRadius: "40px",
})

export const ListPaper = styled(Box)({
    height:"100%", 
    backgroundColor: "#f1f8fd", 
    boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.2)",
    borderRadius: "40px", 
    boxSizing: "border-box", 
    display:"inline-flex", 
    flexFlow:"row wrap", 
    width:"100%", 
    alignContent: "space-around"
})

export const SlidePaper = styled(Box)({
    height:"100%", 
    backgroundColor: "#f1f8fd", 
    boxShadow: "10px 10px 10px 0 rgba(0, 0, 0, 0.2)",
    borderRadius: "40px",
    boxSizing: "border-box", 
    display:"flex"
})

export const ModalPaper = styled(Box)({
    outline:"none", 
    position:"absolute", 
    top:"50%", 
    left:"50%", 
    transform:"translate(-50%, -50%)", 
    background:"#f1f8fd", 
    borderRadius:"15px"
})
