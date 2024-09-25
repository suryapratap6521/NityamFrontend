import { Stack, Typography } from '@mui/material'
import { flexbox } from '@mui/system'
import React from 'react'

const Error = () => {
  return (
    <Stack >
        <Typography variant='h2' color="black"sx={{mt:10,display:"flex",justifyContent:"center",alignContent:"center"}}>Error 404 not found</Typography>
    </Stack>
  )
}

export default Error
