import React from 'react'
import { Box, Grid, Avatar, Typography } from '@mui/material';
import { useCookies } from 'react-cookie';

import logo from '../assets/images/withplus Logo.png'
import { InfoPaper, MenuPaper } from './Paper';


const SideBar = () => {
    const [cookies] = useCookies()

    return(
        <Box sx={{width:"20%", boxSizing:"border-box", py:"20px", display:"inline-flex", flexFlow:"row wrap", alignContent: "space-between"}}>
            <Grid container rowSpacing={2}>
                <Grid item xs={12} sx={{textAlign:"center", px:3, py:"20px"}}>
                    <InfoPaper sx={{py:2}}>
                        <Grid container rowSpacing={2}>
                            <Grid item xs={12}>
                                <Box sx={{display:"flex", justifyContent:"center"}}>
                                    <Avatar>{cookies.auth?cookies.auth[0].toUpperCase():"A"}</Avatar>
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{textAlign:"center"}}>
                                    <Typography> Status : Admin </Typography> 
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Box sx={{textAlign:"center"}}>
                                    <Typography>ID: {cookies.auth}</Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    </InfoPaper>
                </Grid>
            </Grid>
            <Box sx={{width:"100%", p:2}}>
                <MenuPaper>
                    <Typography>
                        시스템 준비중...
                    </Typography>
                </MenuPaper>
            </Box>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                <img src={logo} style={{width:"90%"}} alt="withplus"/>
            </Box>
        </Box>
    )
}

export default SideBar