import React from 'react'
import { useState, useEffect } from "react"
import '../styles/SignUp.scss';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../configs/firebaseConfig"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import GoogleSignIn from './GoogleSignIn';


export default function SignUp() {
  //consts
  const [pwd, setPwd] = useState("");
  const [pwdType, setPwdType] = useState("password")
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [showPwd, setShowPwd] = useState(false);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  const [addEmailErrorClass, setAddEmailErrorClass] = useState(false);
  const [invalidEmail, setInvalidEmail] = useState(false);
  const [emailErrorTxt, setEmailErrorTxt] = useState("")

  const signUpErrorHandling = (errCode)=>{
    console.log(errCode)
    switch(errCode){
      case "auth/email-already-in-use":
        setUserAlreadyExists(true);
        break;
      
      case "auth/invalid-email":
        setInvalidEmail(true);
        break;
    }
  }

  useEffect(()=>{
    console.log(error)
  }, [error])

  useEffect(() => {
    if (userAlreadyExists) {
      setEmailErrorTxt("It appears that you already have an account.")
      setAddEmailErrorClass(true);
    } else {
      setAddEmailErrorClass(false);
    }
  }, [userAlreadyExists]);
  
  useEffect(()=>{
    if(invalidEmail){
      setEmailErrorTxt("Please enter a valid email adress.")
      setAddEmailErrorClass(true)
    } else {
      setAddEmailErrorClass(false)
    }
  }, [invalidEmail])
  //event handlers
  const signUp = (e)=>{
    e.preventDefault();
    createUserWithEmailAndPassword(auth, email, pwd)
    .then((userCredential) => {
      // Signed in 
      setUserAlreadyExists(false)
      setUser(userCredential.user);
    })
    .catch((error) => {
      setError({code: error.code, msg: error.message})
      signUpErrorHandling(error.code)
    });
  }

  const togglePwdVisibility = (e)=>{
    e.preventDefault(); 
    setShowPwd((prev)=>!prev)
  }
 
  useEffect(()=>{
    setPwdType(showPwd ? "text" : "password")
  }, [showPwd])
 
 
  const onChangeEmail = (e)=>{
    setAddEmailErrorClass(false)
    setEmail(e.target.value)
  }
  const onChangePwd = (e)=>{
    setPwd(e.target.value)
  }
  

  return (
    <div className="signUp">
        <label htmlFor="emailInput">Email</label>
        <input 
          className={`inputField ${addEmailErrorClass ? 'emailError' : ''}`}
          id="emailInput" 
          type="email" 
          onChange={onChangeEmail}/>
        { addEmailErrorClass && <p className="emailErrorTxt">{emailErrorTxt}</p>}


        <label htmlFor="pwdInput">Password</label> 
        <div className="pwdContainer">
          <input 
            className="inputField"
            id="pwdInput" 
            type={pwdType}
            onChange={onChangePwd}/>
          <button onClick={togglePwdVisibility} className="btnContainer btnShowPwd">
            <FontAwesomeIcon className="icon" icon={showPwd ? faEyeSlash : faEye}/> 
          </button>
        </div>         
          
        <button className="btnSubmit" onClick={signUp} type="submit"> 
          SIGN UP
        </button>
        
        <GoogleSignIn setUser={setUser}/>

    </div>
  )
}
