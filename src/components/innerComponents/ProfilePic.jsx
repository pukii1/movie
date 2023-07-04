import React from 'react'
import { BiSolidUserCircle } from "react-icons/bi"
import { BsPencilFill } from "react-icons/bs"
import LoadingWaves from "../LoadingWaves.jsx"
import { useEffect, useState } from "react"
import { getAuth } from "firebase/auth"
import "../../styles/User.scss"

export default function ProfilePic() {
    const auth = getAuth();
    const user = auth.currentUser
    const [img, setImg] = useState(null)
    const [imgAlt, setImgAlt] = useState(null)
    const [loadingImg, setLoadingImg] = useState(true)
    const [displayImg, setDisplayImg] = useState(false)
    const defaultPicPath =  process.env.PUBLIC_URL + "/assets/defaultProfilePic.png"
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
    const changePic = ()=>{
        console.log("change profile pic")
    }
  return (
    <div className="imgContainer">
        { loadingImg && <LoadingWaves/>}
        { displayImg ?
            <div className="liProfilePic">            
                <img 
                className="profilePic"
                src={img} 
                alt={imgAlt}
                onLoad={handleImgLoad}
                onError={handleImgErr}
                />
                <div className="changePicIconContainer">
                    <BsPencilFill onClick={changePic} className="changePicIcon"/>
                </div>
            </div>

        : 
          <div className='profileIconContainer'>
            <BiSolidUserCircle className="profileIcon"/>
            <BsPencilFill onClick={changePic} className="changePicIcon"/>
          </div>
        }
        
      </div>
  )
}
