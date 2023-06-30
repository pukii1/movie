import React from 'react'
import "../styles/Favs.scss"
import UserNavbar from './sharedComponents/UserNavbar'
import Header from './sharedComponents/Header'
import MovieCard from './innerComponents/MovieCard'
import LoadingWaves from './LoadingWaves'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"
import { BsEmojiFrown } from "react-icons/bs"
import { getLikedMovies } from '../services/movieService'
import { useNavigate } from 'react-router-dom'
import { getCachedLikedMovies, cacheLikedMovies } from '../services/movieService'


/**
 * Inner component displayed when user isnt logged in
 */
const LoggedOutFavs = ()=>{ 
  const prompt = "U need to be logged in to view ur FAVS."
  const navigate = useNavigate();
  const goToLogin = ()=>{
    navigate("/user");
  }
  return (

    <div className='loFavs'>
      <BsEmojiFrown className='icon'/>
      <h3>{prompt}</h3>
      <button onClick={goToLogin}>Login</button>
    </div>
    
  )
}

/**
 * Inner component that displays the users liked movies when signed in
 */
const LoggedInFavs = ()=>{
  const [displayFavs, setDisplayFavs ] = useState(false)
  const [cacheLikedMovies, setCachedLikedMovies] = useState(null)
  const [likedMovies, setLikedMovies] = useState(null)


  
  const glMovies = async ()=>{
    const auth = getAuth();
    const userId = auth.currentUser.uid
    let likedMovies = await getLikedMovies(userId)
    console.log(likedMovies)
    setLikedMovies(likedMovies)
  }
 useEffect(()=>{
  glMovies()
 }, [])


 useEffect(()=>{
  console.log(likedMovies)
  setDisplayFavs(likedMovies !== null)
 }, [likedMovies])


  

  


  return (
    <div className='liFavs'>
      { displayFavs ? 
        <div className="movieContainer">{likedMovies.map((mv, i)=> {  
          return <MovieCard key={i} data={mv} lastMovie={null} rotate={null} rotationIndex={1}/>
          })}</div> 
        : <LoadingWaves/>}

    </div>
  )
}





export default function Favs({currentPath}) {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    setLoggedIn(user !== null);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoggedIn(user !== null);
    });

    return () => {
      unsubscribe(); // Clean up the auth state change listener
    };
  }, []);
  
  return (
    <div className='favs'>
      <Header title={"Favs"}/> 
      { loggedIn ? <LoggedInFavs/> : <LoggedOutFavs/>}
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
