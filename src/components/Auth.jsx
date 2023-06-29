import React from 'react'
import { useState } from "react"
import Login from "./innerComponents/Login"
import SignUp from "./innerComponents/SignUp"
import "../styles/Auth.scss"
import Logo from "./sharedComponents/Logo"

export default function Auth() {
    const [login, setLogin] = useState(false)
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
        {/*<Logo/>*/}
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
