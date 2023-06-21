import React from 'react'
import { useState, useEffect } from "react"
import '../styles/SignUp.scss';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth} from "../configs/firebaseConfig"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


export default function SignUp() {
  //consts
  const [pwd, setPwd] = useState("");
  const [pwdType, setPwdType] = useState("password")
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [showPwd, setShowPwd] = useState(false);
  const [userAlreadyExists, setUserAlreadyExists] = useState(false);
  const [addUserAlreadyExistsClass, setAddUserAlreadyExistsClass] = useState(false);

  
  const signUpErrorHandling = (errCode)=>{
    switch(errCode){
      case "auth/email-already-in-use":
        setUserAlreadyExists(true);
        break;
      default: 
    }
  }

  useEffect(()=>{
    console.log(error)
  }, [error])

  useEffect(() => {
    if (userAlreadyExists) {
      setAddUserAlreadyExistsClass(true);
    } else {
      setAddUserAlreadyExistsClass(false);
    }
  }, [userAlreadyExists]);
  
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
    setEmail(e.target.value)
  }
  const onChangePwd = (e)=>{
    setPwd(e.target.value)
  }
  


  return (
    <div className="signUp">
        <label htmlFor="emailInput">Email</label>
        <input 
          className={`inputField ${addUserAlreadyExistsClass ? 'userAlreadyExists' : ''}`}
          id="emailInput" 
          type="email" 
          onChange={onChangeEmail}/>
        { addUserAlreadyExistsClass && <p className="userAlreadyExistsTxt">It appears that you already have an account.</p>}

        
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


      <p>UID: {user?.uid}</p>
    </div>
  )
}
