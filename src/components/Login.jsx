import React from 'react'
import { useState, useEffect } from "react"
import '../styles/SignUp.scss';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../configs/firebaseConfig"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function Login() {
     //consts
  const [pwd, setPwd] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [pwdType, setPwdType] = useState("password")
  const [showPwd, setShowPwd] = useState(false);
  const [wrongPwd, setWrongPwd] = useState(false);
  const [addWrongPwdClass, setAddWrongPwdClass] = useState(false);


  const loginErrorHandling = (errCode)=>{
    switch(errCode){
      case "auth/wrong-password":
        setWrongPwd(true)
        break;
    }
  }
  
  useEffect(()=>{
    if(wrongPwd){
      setAddWrongPwdClass(true);
    } else {
      setAddWrongPwdClass(false)
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
    setEmail(e.target.value)
  }
  const onChangePwd = (e)=>{
    setPwd(e.target.value)
  }
  

  
  useEffect(()=>{
    if(user){
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user])

  return (
    <div className="login">
       <label htmlFor="emailInput">Email</label>
        <input 
          className="inputField"
          id="emailInput" 
          type="email" 
          onChange={onChangeEmail}/>
        <label htmlFor="pwdInput">Password</label>          
        <div className="pwdContainer">
          <input 
            className={`inputField ${addWrongPwdClass ? 'wrongPwd' : ''}`}
            id="pwdInput" 
            type={pwdType}
            onChange={onChangePwd}/>
          <button onClick={togglePwdVisibility} className="btnContainer btnShowPwd">
            <FontAwesomeIcon className="icon" icon={showPwd ? faEyeSlash : faEye}/> 
          </button>
        </div> 
        {wrongPwd && <p className="wrongPwdTxt">You entered the wrong password. You can reset your password by clicking the "forgot password" link.</p>}

        
        <button className="btnSubmit" onClick={login} type="submit"> 
          LOGIN
        </button>
        <button onClick={resetPwd} className="btnContainer forgotPwd">Forgot Password?</button>

      <p>UID: {user?.uid}</p>
    </div>
  )
}
