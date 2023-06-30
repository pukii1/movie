import React from 'react'
import UserNavbar from "./sharedComponents/UserNavbar.jsx"
import Header from './sharedComponents/Header.jsx'
import Auth from "./Auth.jsx"
import { getAuth } from "firebase/auth"

export default function User({currentPath}) {
    
    const auth = getAuth();
    const user = auth.currentUser
    return (
    <div>
        <Header title={"Profile"}/>
        {!user && <Auth/>}
        <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
