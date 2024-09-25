import React from 'react'
import DeleteAccount from './DeleteAccount'
import ChangePassword from './ChangePassword'
import UpdateProfile from './UpdateProfile'
import UpdateProfilePic from './UpdateProfilePic'
import {Typography} from '@mui/material'

const Settings = () => {
  return (
    <>
        <Typography variant='h2'>
            Edit Profile
        </Typography>
        <UpdateProfilePic/>
        <UpdateProfile/>
        <ChangePassword/>
        <DeleteAccount/>
      
      
      
    </>
  )
}

export default Settings;
