import React from 'react'
import { BiSolidUserCircle } from "react-icons/bi"
import { BsPencilFill } from "react-icons/bs"
import LoadingWaves from "../LoadingWaves.jsx"
import { useEffect, useState, useRef } from "react"
import { getAuth } from "firebase/auth"
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage"
import { doc, getDoc, updateDoc, setDoc} from "firebase/firestore";
import { db } from "../../configs/firebaseConfig"
import "../../styles/User.scss"

export default function ProfilePic() {
    const auth = getAuth();
    const user = auth.currentUser
    const [img, setImg] = useState(null)
    const [imgAlt, setImgAlt] = useState(null)
    const [loadingImg, setLoadingImg] = useState(true)
    const [displayImg, setDisplayImg] = useState(false)
    const defaultPicPath =  process.env.PUBLIC_URL + "/assets/defaultProfilePic.png"
    const inputRef = useRef(null)
    const [chosenFile, setChosenFile] = useState(null)
    const [fileError, setFileError] = useState(null)
    const [profilePicUrl, setProfilePicUrl] = useState(null)


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
        inputRef.current.click()
    }


    //store chosen file in firebase storage, when new file is chosen
    const uploadFileToStorage = (file)=>{
      if(file && file.name){

        // Upload the file to Firebase Storage
        const storage = getStorage();
        const storageRef = ref(storage, 'profilePictures/' + file.name);


        // Retrieve the file's download URL
        uploadBytes(storageRef, file).then(snapshot => {
          getDownloadURL(storageRef).then(downloadURL => {
            console.log("file available at url: " + downloadURL)
            // Save the download URL in a Firestore document associated with the user
            storeDownloadUrlInDB(downloadURL)
            setProfilePicUrl(downloadURL)
            //cache the download url
            localStorage.setItem("profilePictureUrl", downloadURL)
          });
        });
      }
    }

    //try to retreive profile pic download url from cache or DB when user is logged in 
    useEffect(()=>{
      if(user){
        //try to get profile pic download url from cache
        let profilePic = localStorage.getItem("profilePictureUrl")
        if(profilePic){
          //set profile pic
          setProfilePicUrl(profilePic)
          console.log("fetched profilePicURL from cache")
        } 
        // if download url not in cache -> check DB
        else {
          getDownloadUrlFromDB()
        }
      }
    }, [])
    

    //Helper function for storing the downloadURL provided from the file uploaded to storage
    //in the DB
    const storeDownloadUrlInDB = async (downloadURL) =>{
      let userDocRef = doc(db, "users", user.uid)
      let userDocSnap = await getDoc(userDocRef)
      //user doc already exists -> update "profilePicture" entry
      if(userDocSnap.exists()){
        updateProfilePictureInDB(userDocRef, downloadURL)
      } else {
        console.log("creating new users doc + adding pb download url to DB")
        //user doc doesnt exist yet -> create user doc + add "profilePicture" entry
        createDocAddProfilePictureToDB(downloadURL)
      }
    }




    //helper updates users doc in "users" collection, sets new profilePicture download URL
    const updateProfilePictureInDB = async (userDocRef, downloadURL)=>{
      try{
        //update profilePicture field w/o overwriting the admin field by using the merge option
        await updateDoc(userDocRef, { profilePicture : downloadURL}, {merge: true})
      }
      catch(error){
        console.log(`error updating ${user.uid}s 'profilePicture' entry`)
        console.log(error.message)
      }
    }

    //creates new doc in "users" for user + sets profilePicture download URL
    const createDocAddProfilePictureToDB = async (downloadURL)=>{
      try{
        await setDoc(doc(db, "users", user.uid), {
          profilePicture : downloadURL
        });
      }
      catch(error){
        console.log(`error creating doc for ${user.uid} in users + adding 'profilePicture' entry`)
        console.log(error.message)
      }
    }
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
      console.log("chose new profile pic")
      uploadFileToStorage(chosenFile)
    }, [chosenFile])

    //set chosen file to selected file
    const handleInputChange = (e)=>{
      console.log("chosing new profile pic")
      setFileError(null)
      let file = e.target.files[0]
      console.log(file)
      if(file && file.type.startsWith("image/")){
          console.log(file)
          setChosenFile(file)
      } else {
        console.log("invalid file")
        setFileError("Invalid file")
      }
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
                    <input 
                      ref={inputRef} 
                      onChange={handleInputChange} 
                      type="file" 
                      accept="image/*"
                      style={{display: "none"}}
                    />
                </div>
                {fileError != null && <p>{fileError}</p>}
            </div>

        : 
          <div className='profileIconContainer'>
            <BiSolidUserCircle className="profileIcon"/>
            <div className="changePicIconContainer">
                    <BsPencilFill onClick={changePic} className="changePicIcon"/>
                    <input 
                      ref={inputRef} 
                      onChange={handleInputChange} 
                      type="file" 
                      accept="image/*"
                      style={{display: "none"}}
                    />
                </div>
                {fileError != null && <p>{fileError}</p>}
          </div>
        }
        
      </div>
  )
}
