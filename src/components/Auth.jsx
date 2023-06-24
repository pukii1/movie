import React from 'react'
import { useState } from "react"
import Login from "./Login"
import SignUp from "./SignUp"
import "../styles/Auth.scss"
import Logo from "./Logo"

export default function Auth() {
    const [login, setLogin] = useState(false)
    const [user, setUser] = useState(null)
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



    return (
      <div className="authContainer">
        <Logo/>
        <div className="auth">
        <div className="tabHeader">
          <button value="login" onClick={selectAuthMethod} className={`loginHeader ${login ? '' : 'deselected'}`}>Login</button>
          <button  value="signUp" onClick={selectAuthMethod} className={`signUpHeader ${login ? 'deselected' : ''}`}>Sign Up</button>
        </div>

        { login ? <Login/> : <SignUp/>}
        </div>
      </div>
  )
}
