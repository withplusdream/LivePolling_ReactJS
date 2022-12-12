import React, { useEffect, useState } from 'react'
import { Box, Typography, Grid } from '@mui/material';
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

import { Background } from './../../styles/ui';
import { LoginButton } from '../../components/Button'
import { NeumorphismTextField } from './../../components/TextField';
import { LoginPaper } from '../../components/Paper'
import { socket } from './../../utils/socket';

const LoginPage = () => {
    const date = new Date();
    const navigate = useNavigate()
    const [ , setCookie ] = useCookies()
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleEmail = (e) => {
        setEmail(e.target.value)
    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    const adminLogin = (e) => {
        e.preventDefault();
        if(email === "" || password === "") return
        
        socket.emit("adminLogin", {email: email, password: password})
    }

    useEffect(() => {
        socket.on("adminLogin", (data) => {
            if(data.login){
                let expires = new Date()
                expires.setTime(date.getTime() + 1000*60*60*9)
                setCookie("auth", data.token, {path:"/", expires:expires})
                navigate("/manager")
            }
            else{
                alert("로그인에 실패하였습니다.")
            }
        })

        return () => {
            socket.off("adminLogin")
        }
        // eslint-disable-next-line
    }, []);
    return(
        <Box sx={{...Background, alignItems:"center"}}>
            <LoginPaper component="form" onSubmit={adminLogin} sx={{px:2, py:3}}>
                <Typography sx={{borderBottom:1, fontSize:"32px", mb:"10px"}}>Live Polling - 로그인</Typography>
                <Grid container rowSpacing={3}>
                    <Grid item xs={12}>
                        <NeumorphismTextField fullWidth label="아이디" type="id" onChange={handleEmail} value={email}/>
                    </Grid>
                    <Grid item xs={12}>
                        <NeumorphismTextField fullWidth label="비밀번호" type="password" onChange={handlePassword} value={password}/>
                    </Grid>
                    <Grid item xs={12} sx={{display:"flex", justifyContent:"center"}}>
                        <LoginButton type="submit">로그인</LoginButton>
                    </Grid>
                </Grid>
            </LoginPaper>
        </Box>
    )
}

export default LoginPage