import { Button } from '@mui/material'
import React from 'react'

const Iconbtn = ({
    text,
    onClick,
    children,
    disabled,
    outline=false,
    customClasses,
    type,
}) => {
  return (
   <Button
   disabled={disabled}
   onClick={onClick}
   type={type}
   >
    {
        children ?(
            <>
            <span>
                {text}
            </span>
            {children}
            </>
        ):(text)
    }
   </Button>
  )
}

export default Iconbtn
