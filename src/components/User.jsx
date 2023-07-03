import React from 'react'
import { useState, useEffect} from "react"
import UserNavbar from "./sharedComponents/UserNavbar.jsx"
import Header from './sharedComponents/Header.jsx'
import Auth from "./Auth.jsx"
import { getAuth } from "firebase/auth"
import "../styles/User.scss"
import { BiSolidUserCircle } from "react-icons/bi"
import { BsPencilFill } from "react-icons/bs"

const LoggedInUser = ({user})=>{
  const [img, setImg] = useState(null)
  const [imgAlt, setImgAlt] = useState(null)
  const [loadingImg, setLoadingImg] = useState(true)
  const [displayImg, setDisplayImg] = useState(false)
  const defaultPicPath =  process.env.PUBLIC_URL + "/assets/defaultProfilePic.png"
  /**
   * Helper
   * Convert unix epoch timestamp to date
   *
   * @param {*} timestamp unix epoch timestamp
   * @returns timestamp converted to GMT date
   */
  const unixToGMT = (timestamp) => {
    let ms = BigInt(timestamp) * BigInt(1000);
    let date = new Date(Number(ms)).toUTCString();
    return date;
  };

  useEffect(()=>{
    if(user.photoURL !== null){
      setImg(user.photoURL)
      setImgAlt("user photo")
      setDisplayImg(true)
    }
    else {
      setLoadingImg(false)
    }
  }, [])

  const handleImgLoad = ()=>{
    setLoadingImg(false)
    console.log("done loading profile pic...")
  }

  const handleImgErr = ()=>{
    setImg(defaultPicPath)
    setImgAlt("default img")
  }

  //Handler to allow user to change their profile pic
  const changePic = ()=>{}
  
  console.log(user)
  return (
    <div className="liUser">
      <div className="imgContainer">
        { loadingImg && <p>loading img...</p>}
        { displayImg ?
            <img 
              className="profilePic"
              src={img} 
              alt={imgAlt}
              onLoad={handleImgLoad}
              onError={handleImgErr}
              />
        : 
          <div className='profileIconContainer'>
            <BiSolidUserCircle className="profileIcon"/>
            <BsPencilFill onClick={changePic} className="changePicIcon"/>
          </div>
        }
        
      </div>
      <p className="email">{user.email}</p>

      <div className="metaData">
        <div className="metaSection createdAt">
          <p className="descr">Created At:</p>
          <p className="value">{unixToGMT(user.metadata.createdAt)}</p>
        </div>
        <div className="metaSection LastLoginAt">
          <p className="descr">Last Login At:</p>
          <p className="value">{unixToGMT(user.metadata.lastLoginAt)}</p>
        </div>
      </div>
    </div>
  )
}
export default function User({currentPath}) {
    
    const auth = getAuth();
    const user = auth.currentUser
    
    return (
    <div className='user'>
        <Header title={"Profile"}/>
        {user ? <LoggedInUser user={user}/>:<Auth/>}
        
        <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
