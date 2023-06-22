import React from 'react'
import { useState, useEffect } from "react"
import '../styles/SignUp.scss';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../configs/firebaseConfig"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import GoogleSignIn from './GoogleSignIn';


export default function Login() {
     //consts
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [pwdType, setPwdType] = useState("password")
  const [showPwd, setShowPwd] = useState(false);
  const [wrongPwd, setWrongPwd] = useState(false);
  const [addPasswordErrorClass, setAddPasswordErrorClass] = useState(false);
  const [userNotFound, setUserNotFound] = useState(false)
  const [addEmailErrorClass, setAddEmailErrorClass] = useState(false)
  const [emailErrorTxt, setEmailErrorTxt] = useState("")
  const [invalidEmail, setInvalidEmail] = useState(false);
  
  const loginErrorHandling = (errCode)=>{
    console.log(errCode)
    switch(errCode){
      case "auth/wrong-password":
        setWrongPwd(true)
        break;
      case "auth/user-not-found":
        setUserNotFound(true)
        break;
      case "auth/invalid-email":
        setInvalidEmail(true);
        break;
    }
  }
  

  //add red outline to email input field on "user-not-found" error
  useEffect(()=>{
    if(userNotFound){
      setAddEmailErrorClass(true)
      setEmailErrorTxt("It appears that you dont have an existing account. Please sign up before logging in.")
    } else {
      setEmailErrorTxt("");
      setAddEmailErrorClass(false)
    }
  }, [userNotFound])


    //add red outline to email input field on "user-not-found" error
    useEffect(()=>{
      if(invalidEmail){
        setAddEmailErrorClass(true)
        setEmailErrorTxt("Please enter a valid email adress.")
      } else {
        setEmailErrorTxt("");
        setAddEmailErrorClass(false)
      }
    }, [invalidEmail])
  
  //add red outline to pwd input field on "wrong-password" errror
  useEffect(()=>{
    if(wrongPwd){
      setAddPasswordErrorClass(true);
    } else {
      setAddPasswordErrorClass(false)
    }
  }, [wrongPwd])


  
  useEffect(()=>{
    console.log(error)
  }, [error])

  //event handlers
  const login = (e)=>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, pwd)
    .then((userCredential) => {
      // Signed in 
      setUser(userCredential.user);
      
    })
    .catch((error) => {
      setError({code: error.code, msg: error.message})
      loginErrorHandling(error.code)
    });
  }
  const togglePwdVisibility = (e)=>{
    e.preventDefault(); 
    setShowPwd((prev)=>!prev)
  }
  useEffect(()=>{
    setPwdType(showPwd ? "text" : "password")
  }, [showPwd])

  const resetPwd = (e)=>{
    e.preventDefault();
    console.log("resetting pwd....")
  }
  const onChangeEmail = (e)=>{
    setUserNotFound(false);
    setInvalidEmail(false);
    setEmail(e.target.value)
  }
  const onChangePwd = (e)=>{
    setWrongPwd(false)
    setPwd(e.target.value)
  }
  


  return (
    <div className="login">
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
            className={`inputField ${addPasswordErrorClass ? 'pwdError' : ''}`}
            id="pwdInput" 
            type={pwdType}
            onChange={onChangePwd}/>
          <button onClick={togglePwdVisibility} className="btnContainer btnShowPwd">
            <FontAwesomeIcon className="icon" icon={showPwd ? faEyeSlash : faEye}/> 
          </button>
        </div> 
        {addPasswordErrorClass && <p className="pwdErrorTxt">You entered the wrong password. You can reset your password by clicking the "forgot password" link.</p>}

        
        <button className="btnSubmit" onClick={login} type="submit"> 
          LOGIN
        </button>
        <div className="googleAndResetContainer">
          <GoogleSignIn setUser={setUser}/>
          <button onClick={resetPwd} className="btnContainer forgotPwd">Forgot Password?</button>
        </div>
        
    </div>
  )
}
