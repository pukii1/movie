import React from 'react'
import "../../styles/Header.scss"
import {BsThreeDotsVertical } from 'react-icons/bs'
import { useState, useEffect } from "react"
import { Link, useNavigate } from 'react-router-dom'
import SignOut from "../innerComponents/SignOut.jsx"
import { getAuth, onAuthStateChanged } from "firebase/auth"

export default function Header({title}) {

  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState(null)  
  const [loadingImg, setLoadingImg] = useState(true)
  const defaultPicPath =  process.env.PUBLIC_URL + "/assets/defaultProfilePic.png"
  const [img, setImg] = useState(defaultPicPath)
  const [alt, setAlt] = useState(null)
  const auth = getAuth();
  const user = auth.currentUser;
  const [showSignOut, setShowSignOut] = useState(false)
  
  
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    setShowSignOut(user !== null);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShowSignOut(user !== null);
    });

    return () => {
      unsubscribe(); // Clean up the auth state change listener
    };
  }, []);


   //try to retreive profile pic download url from cache or DB when user is logged in 
   useEffect(()=>{
    if(user){
      //try to get profile pic download url from cache
      let profilePic = localStorage.getItem("profilePictureUrl")
      console.log("trying to fetch profile pic url from cache")
      if(profilePic){
        //set profile pic
        setProfilePicUrl(profilePic)
        console.log(profilePic)
        console.log("fetched profilePicURL from cache")
      } 
      // if download url not in cache -> check DB
      else {
        getDownloadUrlFromDB()
      }
    }
  }, [])
  

     //Helper function to retreive profile pic download url from DB
     const getDownloadUrlFromDB = async ()=>{
      //reference desired doc
      const userDocRef = doc(db, "users", user.uid);
          
      // Retrieve the user doc from favs-collection
      const userDocSnap = await getDoc(userDocRef);

      //check if doc exists
      if (userDocSnap.exists()) {
          let profilePic = userDocSnap.data().profilePicture;
          if(profilePic !== undefined){
              console.log("fetched profilePic download URL from DB")
              //update profile pics img-src attribute
              setProfilePicUrl(profilePic)
          }
          else {
            //TODO error display err msg
            console.error("error fetching profile pic download url from db")
          }
      }
      //doc doesnt exist -> return null
      console.error("doc doesnt exist - cant fetch profile pic url")
      
  }
  //fetch the profile pic from storage and update the src prop of the profile pic img element
  const getProfilePicFromStorage = (profilePicUrl)=>{
    console.log(profilePicUrl)
    fetch(profilePicUrl)
    .then(response => response.blob())
    .then(blob => {
      // Create an object URL from the blob
      const objectURL = URL.createObjectURL(blob);

      //Update the src prop of the profile pic
      setImg(objectURL)
      setAlt("user photo")
    })
    .catch(error => {
      console.log('Error fetching picture:', error);
    });
  }

  //fetch profile pic from storage whenever the profilePicURL changes
  useEffect(()=>{
    getProfilePicFromStorage(profilePicUrl)
  }, [profilePicUrl])
  useEffect(()=>{
    if(img !== null){
      setLoadingImg(false)
    }
  }, [img])
  const handleImgLoad = ()=>{
    setLoadingImg(false)
    console.log("done loading profile pic...")
  }
  const handleImgClick = ()=>{
    navigate("/user")
  }
  const handleImgErr = ()=>{
    setImg(defaultPicPath)
    setAlt("default img")
  }

  useEffect(()=>{}, [profilePicUrl])
  const redirectAfterLogin = ()=>{
    navigate("/user")
  }

  return (
    <div className='header'>
      <h2>{title}</h2>
      {showSignOut && !loadingImg &&
                      <img 
                        className="profilePic" 
                        src={img}
                        alt={alt}
                        onError={handleImgErr}
                        onLoad={handleImgLoad}
                        onClick={handleImgClick}
                      />}


      <div className="dropdown-wrapper">
        <button 
          className="userMenu" 
          onMouseEnter={()=>{setShowUserMenu(true)}}>
            <BsThreeDotsVertical/>
        </button>
        {/**Dropdown user menu */}
          <div 
             onMouseLeave={()=>{setShowUserMenu(false)}}
            className={`user-dropdown-menu ${showUserMenu ? 'showUserMenu' : ''}`}>
            {/*<p>User: {user?.uid} is authenticated</p>*/}
            <Link to="/user" className="menu-item">Settings</Link>
            { showSignOut ? <div className="menu-item"><SignOut/></div> : <div onClick={redirectAfterLogin}className="menu-item">login</div>}
        </div>
      </div>
    </div>
  )
}
