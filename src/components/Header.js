import React from 'react'
import { Box, Typography, Tooltip } from '@mui/material';
import { useCookies } from 'react-cookie';

import LogoutIcon from '@mui/icons-material/Logout';

import logo from '../assets/images/w+ logo.png'
import { IconButton } from './Button';

const Header = () => {
    const [, , removeCookie] = useCookies()

    const logout = () => {
        removeCookie('auth')
        window.location.reload()
    }

    return(
        <Box sx={{height:"8%", px:2, display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <Box sx={{display:"flex", alignItems:"center", cursor:"pointer"}}>
                <img src={logo} style={{width:"12%"}} alt="logo"/>
                <Typography sx={{fontSize:"28px", mx:"5px"}}>Live Polling</Typography>
            </Box>
            <Box>
                <Tooltip title="로그아웃" arrow>
                    <IconButton onClick={logout}>
                        <LogoutIcon fontSize="small"/>
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    )
}

export default Header