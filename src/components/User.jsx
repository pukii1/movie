import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import UserNavbar from "./sharedComponents/UserNavbar.jsx"
import Header from './sharedComponents/Header.jsx'
import Auth from "./Auth.jsx"
import { getAuth, onAuthStateChanged, signInWithRedirect } from "firebase/auth"

export default function User({currentPath}) {
    const navigate = useNavigate();
    const auth = getAuth();
    
    onAuthStateChanged(auth, (user)=>{
      if(user){
        navigate("/")
      }
    })
    
    return (
    <div>
        <Header title={"Profile"}/>
        <Auth/>
        <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
