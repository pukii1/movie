import React from 'react'
import { useState, useEffect} from "react"
import UserNavbar from "./sharedComponents/UserNavbar.jsx"
import Header from './sharedComponents/Header.jsx'
import Auth from "./Auth.jsx"
import { getAuth } from "firebase/auth"
import "../styles/User.scss"
import ProfilePic from './innerComponents/ProfilePic.jsx'
const LoggedInUser = ({user})=>{
 
  /**
   * Helper
   * Convert unix epoch timestamp to date
   *
   * @param {*} timestamp unix epoch timestamp
   * @returns timestamp converted to GMT date
   */
  const unixToGMT = (timestamp) => {
    let ms = BigInt(timestamp) * BigInt(1000);
    let date = new Date(Number(ms)).toUTCString();
    return date;
  };



  
  console.log(user)
  return (
    <div className="liUser">
      <ProfilePic/>
      <p className="email">{user.email}</p>

      <div className="metaData">
        <div className="metaSection createdAt">
          <p className="descr">Created At:</p>
          <p className="value">{unixToGMT(user.metadata.createdAt)}</p>
        </div>
        <div className="metaSection LastLoginAt">
          <p className="descr">Last Login At:</p>
          <p className="value">{unixToGMT(user.metadata.lastLoginAt)}</p>
        </div>
      </div>
    </div>
  )
}
export default function User({currentPath}) {
    
    const auth = getAuth();
    const user = auth.currentUser
    
    return (
    <div className='user'>
        <Header title={"Profile"}/>
        {user ? <LoggedInUser user={user}/>:<Auth/>}
        
        <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
