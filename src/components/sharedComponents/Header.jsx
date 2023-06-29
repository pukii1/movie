import React from 'react'
import "../../styles/Header.scss"
import {BsThreeDotsVertical } from 'react-icons/bs'
import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import SignOut from "../innerComponents/SignOut.jsx"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function Header({title}) {

  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const [showSignOut, setShowSignOut] = useState(false)
  
  
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    setShowSignOut(user !== null);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShowSignOut(user !== null);
    });

    return () => {
      unsubscribe(); // Clean up the auth state change listener
    };
  }, []);

  const redirectAfterLogin = ()=>{
    navigate("/user")
  }

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
            { showSignOut ? <div className="menu-item"><SignOut/></div> : <div onClick={redirectAfterLogin}className="menu-item">login</div>}
        </div>
      </div>
    </div>
  )
}
