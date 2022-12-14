import React, { useState, useEffect } from 'react'
import { 
    Box, Tooltip, Typography, Grid, Select, FormControl, MenuItem, ListItemIcon, ListItemText, Checkbox, InputAdornment
} from '@mui/material';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudIcon from '@mui/icons-material/Cloud';

import Header from './../../components/Header';
import SideBar from './../../components/SideBar';
import { IconButton, ManagerButton } from './../../components/Button';
import { NeumorphismTextField } from './../../components/TextField';
import { EditPaper } from './../../components/Paper';
import { neumorphism } from '../../styles/ui'
import { socket } from './../../utils/socket';

const Content = () => {
    const [ cookies ] = useCookies()
    const navigate = useNavigate()
    const id = useLocation().pathname.split('/')[3]

    const [project, setProject] = useState({});
    const [name, setName] = useState("");
    const [selectedValue, setSelectedValue] = useState("default");
    const [question, setQuestion] = useState("");
    const [overlap, setOverlap] = useState(false);
    const [submitCount, setSubmitCount] = useState(0);
    const [inputCount, setInputCount] = useState(10);

    const goBack = () => {
        navigate("/manager")
    }
    const handleSelect = (e) => {
        setSelectedValue(e.target.value)
    }
    const handleQuestion = (e) => {
        setQuestion(e.target.value)
    }
    const handleCheck = () => {
        setOverlap(!overlap)
    }
    const modifyProject = () => {
        setProject({...project, type:selectedValue, name:name, data: {question: question, overlap: overlap, submitCount:submitCount, inputCount: inputCount}})
        
        socket.emit("modifyProject", {...project, name:name, type:selectedValue, data: {question: question, overlap: overlap, submitCount: submitCount, inputCount: inputCount}})
    }
    const handleName = (e) => {
        if(e.target.value.length > 25){
            setName(e.target.value.slice(0,25))
        }else{
            setName(e.target.value)
        }
    }
    const handleSubmitCount = (e) => {
        setSubmitCount(e.target.value)
    }
    const handleInputCount = (e) => {
        setInputCount(e.target.value)
    }

    useEffect(() => {
        socket.on("getProject", (data) => {
            console.log(data);
            if(!data){
                alert("???????????? ?????? ????????? ????????????.")
                navigate('/manager')
            }else{
                setProject(data)
            }
        })

        socket.on("modifyProject", (data) => {
            if(data.success){
                alert("????????? ?????????????????????.")
            }else {
                alert("?????? ????????? ????????? ?????? ????????? ???????????? ???????????????.")
            }
            navigate("/manager")
        })

        socket.emit("getProject", {admin: cookies.auth, id: id})

        return() => {
            socket.off("getProject")
            socket.off("modifyProject")
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if(project.data){
            setSelectedValue(project.type)
            setQuestion(project.data.question)
            setOverlap(project.data.overlap)
            setInputCount(project.data.inputCount)
            setSubmitCount(project.data.submitCount)
        }
        setName(project.name)
    }, [project]);

    useEffect(() => {
        if(!overlap){
            setSubmitCount(1)
        }
    }, [overlap]);
    return(
        <Box sx={{width:"80%", pb:3, pl:1, pr:3, pt:1, boxSizing:"border-box"}}>
            <EditPaper sx={{px:4, py:2}}>
                <Box sx={{width:"100%"}}>
                    <Tooltip title="????????????" arrow>
                        <IconButton onClick={goBack}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                    <Box sx={{width:"100%", mt:1}}>
                        <NeumorphismTextField 
                            sx={{fontSize:"40px", mb:1, width:"50%"}} value={name||""} placeholder="??????" onChange={handleName}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">{25 - name?.length}</InputAdornment>,
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{width:"100%", display:"flex", justifyContent:"center"}}>
                    <Box sx={neumorphism}>
                        <Box sx={{width:"500px", p:2, boxSizing:"border-box", display:"inline-flex", flexFlow:"row wrap", alignContent: "space-around"}}>
                            <Grid container rowSpacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{pt:2}}>
                                        <Typography> ?????? </Typography>
                                        <FormControl fullWidth>
                                            <Select value={selectedValue} onChange={handleSelect} sx={{...neumorphism, my:1, border:"none", '.MuiOutlinedInput-notchedOutline': { border: 0 },}}>
                                                <MenuItem disabled value={"default"}>
                                                    -- ????????? ?????????????????? --
                                                </MenuItem>
                                                <MenuItem value={"wordcloud"}>
                                                    <Box sx={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                                                        <ListItemIcon>
                                                            <CloudIcon/>
                                                        </ListItemIcon>
                                                        <ListItemText>
                                                            Word Cloud
                                                        </ListItemText>
                                                    </Box>
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    
                                </Grid>
                                <Grid item xs={12}>
                                    <Box sx={{width:"100%"}}>
                                        <Typography>????????? ??????????????????</Typography>
                                        <NeumorphismTextField fullWidth size="small" value={question?question:""} onChange={handleQuestion}></NeumorphismTextField>
                                    </Box>
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <Box sx={{width:"100%"}}>
                                        <Typography>??? ????????? ?????? ??? (?????? 4???)</Typography>
                                        <NeumorphismTextField type="Number" size="small" sx={{width:"75px"}} value={count}
                                            onKeyPress={(e) => {
                                                e.preventDefault()
                                            }}
                                            onChange={handleChange}
                                            InputProps={{
                                                inputProps: { 
                                                    max: 4, min: 1
                                                }
                                            }}/>
                                    </Box>
                                </Grid> */}
                                <Grid item xs={12}>
                                    <Box sx={{display:"flex"}}>
                                        <Box sx={{width:"50%", borderRight:1, borderColor:"#00000015"}}>
                                            <Typography>?????? ?????? ?????? ??????</Typography>
                                            <Checkbox size="large" checked={overlap} onChange={handleCheck}/>
                                        </Box>
                                        <Box sx={{mx:1, width:"50%"}}>
                                            <Typography> ?????? ?????? ??? ?????? (10 ~ 25??? ??????)</Typography>
                                            <NeumorphismTextField
                                                size="small" sx={{width:"75px"}} type="Number" value={inputCount}
                                                onKeyPress={(e) => {
                                                    e.preventDefault()
                                                }}
                                                InputProps={{
                                                    inputProps: {min: 10, max: 25}
                                                }}
                                                onChange={handleInputCount}
                                            />
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sx={{display:overlap?"":"none"}}>
                                    <Box sx={{width:"100%"}}>
                                        <Typography>?????? ?????? ?????? ??? ( '0' ?????? ?????? ??? ?????? ????????? ?????? )</Typography>
                                        <NeumorphismTextField 
                                            size="small" sx={{width:"75px"}} type="Number" value={submitCount}
                                            onKeyPress={(e) => {
                                                e.preventDefault()
                                            }}
                                            InputProps={{
                                                inputProps: {min: 0, max: 10}
                                            }}
                                            onChange={handleSubmitCount}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{width:"100%", display:"flex", justifyContent:"flex-end"}}>
                    <ManagerButton sx={{color:"blue"}} onClick={modifyProject}>????????????</ManagerButton>
                </Box>
            </EditPaper>
        </Box>
    )
}

const EditPage = () => {
    return (
        <Box sx={{backgroundColor:"#e5edf2", height:"calc(var(--vh, 1vh) * 100)", boxSizing:"border-box"}}>
            <Header/>
            <Box sx={{height:"92%", display:"flex", boxSizing:"border-box"}}>
                <SideBar/>
                <Content/>
            </Box>
        </Box>
    )
}

export default EditPage