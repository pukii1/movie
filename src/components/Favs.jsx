import React from 'react'
import "../styles/Favs.scss"
import UserNavbar from './sharedComponents/UserNavbar'
import Header from './sharedComponents/Header'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"
import { BsEmojiFrown } from "react-icons/bs"
import { useNavigate } from 'react-router-dom'

const LoggedOutFavs = ()=>{ 
  const prompt = "U need to be logged in to view ur FAVS."
  const navigate = useNavigate();
  const goToLogin = ()=>{
    navigate("/user");
  }
  return (

    <div className='loFavs'>
      <BsEmojiFrown className='icon'/>
      <h3>{prompt}</h3>
      <button onClick={goToLogin}>Login</button>
    </div>
    
  )
}
const LoggedInFavs = ()=>{
  return (
    <div className='liFavs'>ur favs</div>
  )
}
export default function Favs({currentPath}) {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    setLoggedIn(user !== null);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(user !== null);
    });

    return () => {
      unsubscribe(); // Clean up the auth state change listener
    };
  }, []);
  
  return (
    <div className='favs'>
      <Header title={"Favs"}/> 
      { loggedIn ? <LoggedInFavs/> : <LoggedOutFavs/>}
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
