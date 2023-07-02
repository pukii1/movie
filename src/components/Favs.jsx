import React from 'react'
import "../styles/Favs.scss"
import UserNavbar from './sharedComponents/UserNavbar'
import Header from './sharedComponents/Header'
import MovieCard from './innerComponents/MovieCard'
import { BsArrowRight } from 'react-icons/bs'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react"
import { BsEmojiFrown } from "react-icons/bs"
import { getLikedMovies, getLikedSeries } from '../services/movieService'
import { useNavigate } from 'react-router-dom'
import { getCachedLikedMovies, cacheLikedMovies } from '../services/movieService'
import { db } from "../configs/firebaseConfig"
import { onSnapshot, doc } from 'firebase/firestore'


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
const LoggedInFavs = ({showMovies})=>{
  const [displayFavMovies, setDisplayFavMovies ] = useState(false)
  const [displayFavSeries, setDisplayFavSeries ] = useState(false)
  const [likedMovies, setLikedMovies] = useState(null)
  const [likedSeries, setLikedSeries] = useState(null)

  //get liked movies from cache or db if not stored in cache yet  
  const glMovies = async ()=>{
    const auth = getAuth();
    const userId = auth.currentUser.uid
    let likedMovies = await getLikedMovies(userId)
    setLikedMovies(likedMovies)
  }
 useEffect(()=>{
  if(showMovies){
    if(likedMovies == null) {
      glMovies()
    }
  }
  setDisplayFavMovies(likedMovies !== null && likedMovies.length != 0)    
 }, [])


   //get liked tvSeries from cache or db if not stored in cache yet  
   const glSeries = async ()=>{
    const auth = getAuth();
    const userId = auth.currentUser.uid
    let likedSeries = await getLikedSeries(userId)
    setLikedSeries(likedSeries)
  }
 useEffect(()=>{
  console.log("rerendered LoggedInFavs")
  if(!showMovies){
    if(likedSeries == null){
      glSeries()
    }
  }
  setDisplayFavSeries(likedSeries !== null && likedSeries.length != 0)
 }, [])

//update list of liked movies in real-time by listening to db-changes
 useEffect(()=>{
  const auth = getAuth()
  const user = auth.currentUser
  if( user !== null){
    //reference the correct doc corresponding to the current user to only listen to changes to that users doc 
    const userDocRef = doc(db, "favs", user.uid)
    //Listen to changes to favMovies
    const unsubscribeFromMovieDB = onSnapshot(userDocRef, (docSnapshot)=>{
      if(docSnapshot.exists()){
        //get the data from the snapshot
        const userData = docSnapshot.data()
        console.log(userData)
        //if the data is null -> set likedMovies to an empty array
        const updatedLikedMovies = userData.favMovies || []
        //update likedMovies
        setLikedMovies(updatedLikedMovies)
        console.log(`updated liked movies: `)
        console.log(updatedLikedMovies)
      }
      else {
        //TODO handle this
        console.error("snapshot unavailable")
      }
    })

    //listen to changes to favTVSeries
    const unsubscribeFromTVSeriesDB = onSnapshot(userDocRef, (docSnapshot)=>{
      if(docSnapshot.exists()){
        //get the data from the snapshot
        const userData = docSnapshot.data()
        console.log(userData)
        //if the data is null -> set likedMovies to an empty array
        const updatedLikedSeries = userData.favTVSeries || []
        //update likedMovies
        setLikedSeries(updatedLikedSeries)
        console.log(`updated liked movies: `)
        console.log(updatedLikedSeries)
      }
      else {
        //TODO handle this
        console.error("snapshot unavailable")
      }
    })

    //unsub from db change listener once component unmounts by triggering unsub function returned by the onSnapshot fct
    return ()=>{
      unsubscribeFromMovieDB()
      unsubscribeFromTVSeriesDB()
    }
  }
  
 }, [])


  


  return (
    <div className='liFavs'>
      <div className="movieContainer">
        { showMovies && displayFavMovies && likedMovies.map((mv, i)=> {return <MovieCard key={i} data={mv} lastMovie={null} rotate={null} rotationIndex={1}/>
            })}
        { !showMovies && displayFavSeries && likedSeries.map((mv, i)=> {return <MovieCard key={i} data={mv} lastMovie={null} rotate={null} rotationIndex={1}/>
            })}
        { (!showMovies && !displayFavSeries) && <NoLikesYet movies={showMovies}/>}
        { ( showMovies && !displayFavMovies) && <NoLikesYet movies={showMovies}/>}
      </div>
    </div>
  )
}

/**
 * Component rendered if user is logged in but hasnt liked any movies (if 'Movies' tab is selected)
 * or shows (if 'TV Series' tab is selected) + redirect-to-homepage ("/") option
 * @param {*} param0 movies, indicates whether user doesnt have any liked movies or shows yet
 * @returns 
 */
const NoLikesYet = ({movies})=>{
  const navigate = useNavigate()
  const mediaType = movies ? 'movies' : 'shows'
  
  
  const redirectToHome = ()=>{
    navigate("/")
  }
  return (
    <div className="noLikesYet">
      <p>Looks like you haven't liked any {mediaType} yet...</p>
      <p className="redirectToHomeContainer">Lets change that! <span onClick={redirectToHome} className="redirectToHome"><BsArrowRight /></span></p>
    </div>
  )
}


/**
 * Main Favs container component renders fav shows or movies if user is logged in or 
 * a redirect-to-login option if user is signed out
 * @param {} param0 path to the current page "/favs" to be passed down to the Usernavbar to highlight the corresponding icon
 * @returns 
 */
export default function Favs({currentPath}) {
  const [loggedIn, setLoggedIn] = useState(false)
  const [movies, setMovies] = useState(true)

  const selectDataType = (e)=>{
    setMovies(e.target.value === 'movies')
  }
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
      <div className="tabHeader">
          <button value="movies" onClick={(e)=>{selectDataType(e)}} className={`moviesHeader ${movies ? 'selected' : 'deselected'}`}>Movies</button>
          <button  value="series" onClick={(e)=>{selectDataType(e)}} className={`seriesHeader ${movies ? 'deselected' : 'selected'}`}>TV Series</button>
        </div>
      { loggedIn ? <LoggedInFavs showMovies={movies}/> : <LoggedOutFavs/>}
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
