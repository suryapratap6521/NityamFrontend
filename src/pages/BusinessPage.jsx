import React from 'react'
import Navbar from '../Components/Common/Navbar'
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
const BusinessPage = () => {
  return (
    
    <div >
        <Navbar/>
        <div className="">
        <Button variant="contained" component={Link} to="/signup">Register your business</Button>
        </div>
      
    
    </div>

  )
}

export default BusinessPage
