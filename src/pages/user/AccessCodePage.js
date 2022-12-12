import React, { useState, useEffect } from 'react'
import { Box, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

import { Background } from './../../styles/ui';
import { Phone } from '../../components/Phone'
import { CopyRight } from './../../components/CopyRight';
import logo from '../../assets/images/withplus Logo.png'
import { FormButton } from './../../components/Button';
import { NeumorphismTextField } from './../../components/TextField';
import { socket } from './../../utils/socket';

const Content = () => {
    // rendering
    const navigate = useNavigate()
    const [accessCode, setAccessCode] = useState("");

    const handleAccessCode = (e) => {
        setAccessCode(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("hello");
        if(accessCode.length !== 6){
            alert("잘못된 코드입니다.")
        }else{
            socket.emit("accessPoll", {accessCode: accessCode*1})
        }
    }

    useEffect(() => {
        socket.on("accessPoll", (data) => {
            if(data.success){
                navigate(`/${data.id}`)
            }else{
                alert("잘못된 코드입니다.")
                setAccessCode("")
            }
        })

        return() => {
            socket.off("accessPoll")
        }
        // eslint-disable-next-line
    }, []);

    return (
        <>
            <Box sx={{display:"flex", justifyContent:"center", my:2}}>
                <img src={logo} style={{width:"90%"}} alt="logo"/>
            </Box>
            <Typography sx={{display: "flex", justifyContent:"center", fontSize:"36px", fontWeight:"bold"}}> - Live Polling - </Typography> 
            <Box component="form" onSubmit={handleSubmit} sx={{position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, -50%)", width:"calc(100% - 24px)"}}>
                <Typography sx={{display:"flex", justifyContent:"center"}}>접속 코드 6자리를 입력해주세요</Typography>
                <NeumorphismTextField type="tel" fullWidth sx={{my:3}} placeholder="접속코드 입력 ex) 123456" value={accessCode} onChange={handleAccessCode}></NeumorphismTextField>
                <Box sx={{display: 'flex', justifyContent: "center", mt:"20px"}}>
                    <FormButton type="submit" size="large">입력</FormButton>
                </Box>
            </Box>
        </>
    )
}

const AccessCodePage = () => {
    return(
        <Box sx={Background}>
            <Box>
                <Phone content={<Content/>}/>
                <CopyRight/>
            </Box>
        </Box>
    )
}

export default AccessCodePage;