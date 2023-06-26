import React from 'react'
import { getAuth } from "firebase/auth"
import "../styles/Header.scss"
import {BsThreeDotsVertical } from 'react-icons/bs'
import { useState } from "react"
import { Link } from 'react-router-dom'
import SignOut from "./SignOut.jsx"

export default function Header({title}) {

  const [showUserMenu, setShowUserMenu] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

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
            <div className="menu-item"><SignOut/></div>
        </div>
      </div>
    </div>
  )
}
