import React from 'react'
import "../styles/Header.scss"
import {BsThreeDotsVertical } from 'react-icons/bs'
import { useState } from "react"
import { Link } from 'react-router-dom'
import SignOut from "./SignOut.jsx"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function Header({title}) {

  const [showUserMenu, setShowUserMenu] = useState(false);
    const auth = getAuth();
  const user = auth.currentUser;
  const [showSignOut, setShowSignOut] = useState(auth.currentUser)

  onAuthStateChanged( auth, (user)=>{
    if(user){
      setShowSignOut(true);
    } else {
      setShowSignOut(false)
    }
  })

  return (
    <div className='header'>
      <h2>{title}</h2>
      <div className="dropdown-wrapper">
        <button 
          className="userMenu" 
          onMouseEnter={()=>{setShowUserMenu(true)}}>
            <BsThreeDotsVertical/>
        </button>

        {/**Dropdown user menu */}
          <div 
             onMouseLeave={()=>{setShowUserMenu(false)}}
            className={`user-dropdown-menu ${showUserMenu ? 'showUserMenu' : ''}`}>
            {/*<p>User: {user?.uid} is authenticated</p>*/}
            <Link to="/user" className="menu-item">Settings</Link>
            { showSignOut ? <div className="menu-item"><SignOut/></div> : <div>login</div>}
        </div>
      </div>
    </div>
  )
}
