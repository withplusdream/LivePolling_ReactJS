import React, { useEffect, useState } from 'react'
import { Box, Typography, Tooltip } from '@mui/material';
import ReactWordcloud from 'react-wordcloud';
import { useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/scale.css";

import Header from './../../components/Header';
import qrcode from '../../assets/images/qrcode.png'
import { IconButton } from './../../components/Button';
import { SlidePaper } from '../../components/Paper'
import { neumorphism } from '../../styles/ui'
import { socket } from './../../utils/socket';

const Content = () => {
    const [ cookies ] = useCookies()
    const navigate = useNavigate()
    const id = useLocation().pathname.split('/')[3]

    const [project, setProject] = useState({});
    const [words, setWords] = useState([]);
    const [word, setWord] = useState("");
    const [count, setCount] = useState(0);
    // {text:"1", value:1}
    const size = [900, 500];

    const goBack = () => {
        navigate(`/manager`)
    }

    useEffect(() => {
        socket.on("getProject", (data) => {
            setProject(data)
        })
        socket.on("sendWord", (data) => {
            setWord(data.text)
        })
        socket.on("getWords", (data) => {
            setWords(data.words)
        })
        socket.emit("getProject", {admin: cookies.auth, id: id})
        socket.emit("joinRoom", {id: id})
        socket.emit("getWords", {id: id})

        return () => {
            socket.off("getProject")
            socket.off("sendWord")
            socket.off("getWords")
        }
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        let index = words.findIndex((item, index) => {return item.text === word})
        if(word === "") return
        console.log(words);

        if(index !== -1){
            let newArray = words
            newArray[index].value += 1
            setWords(newArray)
        }
        else{
            setWords([...words, {text: word, value:1}])
        }
        setWord("")
        setCount(count+1)
        // eslint-disable-next-line
    }, [word]);

    useEffect(() => {
       setCount(project.count) 
    }, [project]);

    return(
        <Box sx={{width:"100%", p:4, boxSizing:"border-box"}}>
            <SlidePaper sx={{px:4, py:3}}>
                <Box sx={{width:"20%", py:2, px:1, boxSizing:"border-box"}}>
                    <Tooltip title="뒤로가기" arrow>
                        <IconButton onClick={goBack}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </Tooltip>
                    <Typography sx={{textAlign:"center", fontSize:"32px"}}>접속 방법</Typography>
                    <Box sx={{width:"100%", textAlign:"center"}}>
                        <Box sx={{...neumorphism, mb:1, py:1}}>
                            <img src={qrcode} style={{width:"75%", margin:"20px 10px"}} alt="qrcode"/>
                        </Box>
                    </Box>
                    <Box sx={{...neumorphism, py:1}}>
                        <Typography sx={{fontSize:"20px", textAlign:"center"}}>1. 접속 URL </Typography>
                        <Typography sx={{fontSize:"20px", textAlign:"center"}}>https://polls.wplusedu.co.kr</Typography>
                        <Typography sx={{fontSize:"20px", mt:3, textAlign:"center"}}>2. 접속 코드</Typography>
                        <Typography sx={{fontSize:"32px", color:"red", textAlign:"center"}}>{project.accessCode?(project.accessCode+"").slice(0,3):"123"}&nbsp;{project.accessCode?(project.accessCode+"").slice(3,6):"456"}</Typography>
                    </Box>
                </Box>
                <Box sx={{width:"80%"}}>
                    <Box sx={{...neumorphism, position:"relative", width:"100%", height:"100%", mx:1, p:1, boxSizing:"border-box"}}>
                        <Typography sx={{fontSize:"28px"}}>주제 - {project.data?.question}</Typography>
                        <ReactWordcloud words={words} size={size} options={{fontSizes:[30,50], fontFamily:"BMJUA"}}/>
                        <Box sx={{position:"absolute", right:0, bottom:0, transform:"translate(-50%, -50%)"}}>
                            <Typography>투표수 : {count}</Typography>
                        </Box>
                    </Box>
                </Box>
            </SlidePaper>
        </Box>
    )
}

const SlidePage = () => {
    return (
        <Box sx={{backgroundColor:"#e5edf2", height:"calc(var(--vh, 1vh) * 100)", boxSizing:"border-box"}}>
            <Header/>
            <Box sx={{height:"92%", display:"flex", boxSizing:"border-box"}}>
                <Content/>
            </Box>
        </Box>
    )
}

export default SlidePage