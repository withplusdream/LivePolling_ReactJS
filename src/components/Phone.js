import React from 'react'
import { Box } from '@mui/material'

import { PhoneBar, PhoneStyle } from './../styles/ui';

export const Phone = (props) => {
    const {content} = props

    return(
        <Box sx={PhoneStyle}>
            <Box sx={{height:"100%"}}>
                <Box sx={{position:"relative", height:"94%", my:"3%"}}>
                    {content}
                </Box>
            </Box>
            <Box sx={PhoneBar}/>
        </Box>
    )
}
