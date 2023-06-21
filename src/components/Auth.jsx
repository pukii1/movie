import React from 'react'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useState } from "react"
import Login from "./Login"
import SignUp from "./SignUp"
import SignOut from "./SignOut"
import "../styles/Auth.scss"


export default function Auth() {
    const [login, setLogin] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [user, setUser] = useState(null)
    const auth = getAuth();
    const selectAuthMethod = (e)=>{
        switch(e.target.value){
            case "login":
                setLogin(true)
                break;
            case "signUp":
                setLogin(false)
                break;
        }
    }


  onAuthStateChanged(auth, (User) => {
    if (User) {
      setUser(auth.currentUser)
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  });

    return (
      <>
    {!isAuthenticated && (
      <div className="auth">
        <div className="tabHeader">
          <button value="login" onClick={selectAuthMethod} className={`loginHeader ${login ? '' : 'deselected'}`}>Login</button>
          <button  value="signUp" onClick={selectAuthMethod} className={`signUpHeader ${login ? 'deselected' : ''}`}>Sign Up</button>
        </div>

        { login ? <Login/> : <SignUp/>}
      </div>)
    }


    { isAuthenticated && <>
      <SignOut/>
      <p>User: {user?.uid} is authenticated</p>
    </>}
  </>
  )
}
