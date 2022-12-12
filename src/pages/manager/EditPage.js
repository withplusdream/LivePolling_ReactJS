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
        setProject({...project, type:selectedValue, name:name, data: {question: question, overlap: overlap}})
        
        socket.emit("modifyProject", {...project, name:name, type:selectedValue, data: {question: question, overlap: overlap}})
    }
    const handleName = (e) => {
        if(e.target.value.length > 25){
            setName(e.target.value.slice(0,25))
        }else{
            setName(e.target.value)
        }
    }

    useEffect(() => {
        socket.on("getProject", (data) => {
            if(!data){
                alert("페이지에 대한 정보가 없습니다.")
                navigate('/manager')
            }else{
                setProject(data)
            }
        })

        socket.on("modifyProject", (data) => {
            if(data.success){
                alert("수정이 완료되었습니다.")
            }else {
                alert("문제 수정에 오류가 생겨 리스트 페이지로 돌아갑니다.")
                navigate("/manager")
            }
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
            setName(project.name)
        }
    }, [project]);
    return(
        <Box sx={{width:"80%", pb:3, pl:1, pr:3, pt:1, boxSizing:"border-box"}}>
            <EditPaper sx={{px:4, py:2}}>
                <Box sx={{width:"100%"}}>
                    <Tooltip title="뒤로가기" arrow>
                        <IconButton onClick={goBack}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                    <Box sx={{width:"100%", mt:1}}>
                        <NeumorphismTextField 
                            sx={{fontSize:"40px", mb:1, width:"50%"}} value={name} placeholder="제목" onChange={handleName}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">{25 - name.length}</InputAdornment>,
                            }}
                        />
                    </Box>
                </Box>

                <Box sx={{width:"100%", display:"flex", justifyContent:"center"}}>
                    <Box sx={neumorphism}>
                        <Box sx={{width:"400px", p:2, boxSizing:"border-box", display:"inline-flex", flexFlow:"row wrap", alignContent: "space-around"}}>
                            <Grid container rowSpacing={2}>
                                <Grid item xs={12}>
                                    <Box sx={{pt:2}}>
                                        <Typography> 타입 </Typography>
                                        <FormControl fullWidth>
                                            <Select value={selectedValue} onChange={handleSelect} sx={{...neumorphism, my:1, border:"none", '.MuiOutlinedInput-notchedOutline': { border: 0 },}}>
                                                <MenuItem disabled value={"default"}>
                                                    -- 타입을 선택해주세요 --
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
                                        <Typography>질문을 입력해주세요</Typography>
                                        <NeumorphismTextField fullWidth size="small" value={question?question:""} onChange={handleQuestion}></NeumorphismTextField>
                                    </Box>
                                </Grid>
                                {/* <Grid item xs={12}>
                                    <Box sx={{width:"100%"}}>
                                        <Typography>한 사람당 입력 수 (최대 4개)</Typography>
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
                                    <Box sx={{width:"100%"}}>
                                        <Typography>중복 제출 가능 여부</Typography>
                                        <Checkbox size="large" checked={overlap} onChange={handleCheck}/>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{width:"100%", display:"flex", justifyContent:"flex-end"}}>
                    <ManagerButton sx={{color:"blue"}} onClick={modifyProject}>수정하기</ManagerButton>
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