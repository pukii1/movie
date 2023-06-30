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
const LoggedInFavs = ()=>{
  //ids of the liked movies (later fetch from db)
  const [favedMovieIDs, setFavedMovieIDs] = useState(null)
  const [numFavedMovies, setNumFavedMovies] = useState(0)
  //array of data for the liked movies (later fetch from API)
  const [favedMovies, setFavedMovies] = useState([])
  //flag to indicate if data for one liked movie has succesfully been fetched 
  //(to indicate when movieUrl can be safely updated)
  const [fetchedDataForOneMovie, setFetchedDataForOneMovie] = useState(false)
  const [movieUrl, setMovieUrl] = useState("");
  const movieUrlBase = "https://moviesdatabase.p.rapidapi.com/titles/"
  const [fetchedIdx, setFetchedIdx] = useState(0)
  const [displayFavs, setDisplayFavs ] = useState(false)

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f9e45181a3msh422b41bfbdd3bdbp127d70jsndf222028a016',
      'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
    }
  };
    
  const fetchFavMovieData = async (url)=>{
    try {
      setFetchedDataForOneMovie(false)
      const response = await fetch(url, options);
      let result = await response.json();
      result = result.results
      //console.log(`fetched movie data: `);
      console.log(result)
      if(result !== null && !favedMovies.some(movie => movie.id === result.id)){
        setFavedMovies(prev => [result, ...prev])
      }
      setFetchedIdx(prev => prev + 1)
      setFetchedDataForOneMovie(true)
    } catch (error) {
      setFetchedDataForOneMovie(true)
      console.error(error);
    }
  }

  useEffect(()=>{
    console.log(favedMovies)
  }, [favedMovies])
  //4. fetch data for another liked movie once movieUrl changes
  useEffect(()=>{
    //console.log(movieUrl)
    fetchFavMovieData(movieUrl)
  }, [movieUrl])


  //3. update movie fetching URL
useEffect(()=>{
  //data for prev faved movie successfully fetched + still more movies to fetch
  if(fetchedDataForOneMovie && numFavedMovies > fetchedIdx){
    setMovieUrl(`${movieUrlBase}${favedMovieIDs[fetchedIdx]}`)
  }
  if(fetchedIdx == numFavedMovies){
    console.log("display favs")
    setDisplayFavs(true)
  }
}, [setFetchedDataForOneMovie, fetchedIdx])



  //1. try to retreive the users fav movies from firestore db
  useEffect( ()=>{
    const fetchData = async ()=>{
      const auth = getAuth();
      const user = auth.currentUser;
      if(user !== null){
        const favedMovieIdsResult = await getLikedMovies(user.uid)
        setFavedMovieIDs(favedMovieIdsResult)
      }
    }
    fetchData()
    //TODO: error handling
  }, [])

  //2. get movie data from API
  useEffect(()=>{
    if(favedMovieIDs !== null){
      setNumFavedMovies(favedMovieIDs.length)
      //init movie URL to fetch data for first liked movie
      setMovieUrl(`${movieUrlBase}${favedMovieIDs[fetchedIdx]}`)
    }
    //console.log(`faved movies (by id):`)
    //console.log( `${favedMovieIDs}`)
  }, [favedMovieIDs])




  return (
    <div className='liFavs'>
      { displayFavs ? 
        <div className="movieContainer">{favedMovies.map((mv, i)=> {  
          return <MovieCard key={i} data={mv} lastMovie={null} rotate={null} rotationIndex={null}/>
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
