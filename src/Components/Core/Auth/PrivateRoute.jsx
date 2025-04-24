import React from 'react'
import { useSelector } from "react-redux";
import {Navigate} from 'react-router-dom'
import {useLocation} from "react-router-dom";
export default function PrivateRoute({children}) {
   const location=useLocation();  
    const {token}=useSelector((state)=>state.auth);
    const {user}=useSelector((state)=>state.profile);

    
   
  if(token!==null){
   
    return children;
    
  }
 
  
  else{
    return <Navigate to="/login" />
  }
}
