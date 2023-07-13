import React from 'react'
import { useState, useEffect } from "react"
import '../../styles/SignUp.scss';
import { Navigate } from 'react-router-dom';
import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail } from "firebase/auth";
import {auth} from "../../configs/firebaseConfig"
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
  const [networkError, setNetworkError] = useState(false)
  const networkErrorTxt = `Sorry u cant login atm.\nA network error occured...`

  /**
   * Error handler function
   * handles various possible errs that could occur during a login attempt
   * @param {} errCode error code describing the error that occured  
   */
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
      case "auth/network-request-failed":
        setNetworkError(true)
        break;
    }
  }
  
  //ERROR HANDLING STYLING
  //functions that respond to errors by updating the error-styling-class-flags
  //that conditionally add error styling + msgs
  
  /**
   * Updates error-styling-flag
   * that adds/removes red outline to email input field on "user-not-found" error
   */
  useEffect(()=>{
    if(userNotFound){
      setAddEmailErrorClass(true)
      setEmailErrorTxt("It appears that you dont have an existing account. Please sign up before logging in.")
    } else {
      setEmailErrorTxt("");
      setAddEmailErrorClass(false)
    }
  }, [userNotFound])

  /**
   * Updates error-styling-flag
   * that adds/removes red outline to email input field on "invalid-email" error
   */
  useEffect(()=>{
    if(invalidEmail){
      setAddEmailErrorClass(true)
      setEmailErrorTxt("Please enter a valid email adress.")
    } else {
      setEmailErrorTxt("");
      setAddEmailErrorClass(false)
    }
  }, [invalidEmail])

   /**
   * Updates error-styling-flag
   * that adds/removes red outline to pwd input field on "wrong-password" error
   */
  useEffect(()=>{
    if(wrongPwd){
      setAddPasswordErrorClass(true);
    } else {
      setAddPasswordErrorClass(false)
    }
  }, [wrongPwd])



  //debug
  useEffect(()=>{
    console.log(error)
  }, [error])

  /**
   * Performs login once the user clicks the login button
   * catches potential errors (invalid/wrong pwd etc.)
   * passes those to the dedicated loginErrorHandling function
   * @param {*} e event
   */
  const login = (e)=>{
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, pwd)
    .then((userCredential) => {
      // Signed in 
      setNetworkError(false)
      setUser(userCredential.user);
      Navigate("/")
      
    })
    .catch((error) => {
      setError({code: error.code, msg: error.message})
      loginErrorHandling(error.code)
    });
  }

  //EMAIL related functions

  /**
   * handles email input
   * resets userNotFound + invalidEmail err flags
   * updates email input value 
   * @param {*} e event
   */
  const onChangeEmail = (e)=>{
    setUserNotFound(false);
    setInvalidEmail(false);
    setEmail(e.target.value)
  }

  //PASSWORD related functions
  /**
   * Handles password input
   * resets wrongPwd err flag
   * updates password input value
   * @param {*} e event 
   */
  const onChangePwd = (e)=>{
    setWrongPwd(false)
    setPwd(e.target.value)
  }
  
  /**
   * toggles pwd visibility in ui 
   * when the eye-icon is clicked
   * @param {*} e event
   */
  const togglePwdVisibility = (e)=>{
    e.preventDefault(); 
    setShowPwd((prev)=>!prev)
  }
  /**
   * Responds to changes to the showPwd flag
   * updates the showPwdFlag accordingly to adjust its visibility in the ui
   */
  useEffect(()=>{
    setPwdType(showPwd ? "text" : "password")
  }, [showPwd])

  /**
   * initiates password reset mechanism when respective button is clicked
   * @param {*} e event
   */
  const resetPwd = (e)=>{
    e.preventDefault();
    
    const auth = getAuth();
    if(email){
      setEmailErrorTxt("")
      setAddEmailErrorClass(false)
      sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("sent reset email...")

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // TODO add error handling
      });
    }
    else {
      setEmailErrorTxt("Please enter your email address to receive the password-reset email")
      setAddEmailErrorClass(true)
    }
    
  }





  return (
    <div className="login">
      {networkError && {networkErrorTxt}}
      { !networkError && <>
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
      </>}
    </div>
  )
}
