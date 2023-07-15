import React from 'react'
import "../../styles/MovieCard.scss"
import { useState, useEffect} from "react"
import LoadingWaves from '../LoadingWaves'
import {AiFillStar} from "react-icons/ai"
import { BsFillBookmarkHeartFill } from 'react-icons/bs'
import { ImBlocked } from "react-icons/im"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { likeMovie, likeTVSeries } from '../../services/movieService'

/**
 * Movie card component
 * renders ui for 1 movie/show
 * @param {*} data movieData-obj, 
 * @param lastMovie indicates if movie is last movie displayed in the MovieCarousel (null if not rendered in MovieCarousel)
 * @param rotationIndex 0-based position index of the Movie in the MovieCarousel (null if not rendered in MovieCarousel)
 * @param rotate function passed down from MovieCarousel to handle rotation when outer movies get clicked (null if not rendered in MovieCarousel)
 * @returns 
 */
export default function MovieCard({data, lastMovie, rotationIndex, rotate}) {

  //CONSTS
  const [imgSrc, setImgSrc] = useState(null)
  const [imgAlt, setImgAlt] = useState(null)
  const [rating, setRating] = useState(null)
  const [loadingImg, setLoadingImg] = useState(true)
  const [ratingsLoaded, setRatingsLoaded] = useState(false)
  const [allowLike, setAllowLike] = useState(false)
 
  //API related consts
  const ratingsUrl = `https://moviesdatabase.p.rapidapi.com/titles/${data.id}/ratings`;
  const ratingsApiKey = 'f9e45181a3msh422b41bfbdd3bdbp127d70jsndf222028a016';
  const host =  'moviesdatabase.p.rapidapi.com' 
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': ratingsApiKey,
      'X-RapidAPI-Host': host
    }
  };
  
  //img style that hides img tag while img src is loading
  const imageStyle = {
    display: loadingImg ? 'none' : 'block',
  };

  /**
   * Sets flag indicating whether movie can b liked (only available for the middle-movie in the middle of the MovieCarousel)
   */
  if(rotationIndex == 1){
    useEffect(() => {
      const auth = getAuth();
      const user = auth.currentUser;
  
      setAllowLike(user !== null);
  
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setAllowLike(user !== null);
      });
  
      return () => {
        unsubscribe(); // Clean up the auth state change listener
      };
    }, []);
  }

  /**
   * Sets movie-img src + alt 
   * fetches movie ratings
   */
  useEffect(() => {
    if (data.primaryImage) {
      setImgSrc(data.primaryImage?.url);
      setImgAlt(data.primaryImage?.caption.plainText);
      setLoadingImg(true)
      fetchRatings()
    }
  }, [data.primaryImage]);

  





  /**
   * Handles movie-image errors by setting img src to a default jpg
   * communicating that img couldnt b loaded thru the imgs alt prop
   */
  const handleImgErr = ()=>{
    setImgSrc( process.env.PUBLIC_URL + "/assets/moviePlaceholder.jpg")
    setImgAlt("Img not found...")
  }

  /**
   * Update loadingImg flag once img has loaded to update img display-style
   */
  const handleImgLoad = ()=>{
    setLoadingImg(false)
    //console.log("img loaded")
  }


  /**
   * Fetch movie ratings from separate API endpoint (Not included in basic movie-data)
   */
  const fetchRatings = async()=>{
    try {
      const response = await fetch(ratingsUrl, options);
      const result = await response.json();
      console.log(result.results)
      
      setRating(result.results ? result.results.averageRating : null);
      setRatingsLoaded(true)
    } catch (error) {
      console.error(error);
    }
  }
useEffect(()=>{
  console.log(`rating ${rating}`)
}, [rating])
  /**
   * Add media to fav lists (depending on media-type)
   */
  const addToFavs = ()=>{
    //check if item is show or movie
    if(data.titleType.isSeries){
      favSeries();
    }
    else{
      favMovie()
    }
  }

  /**
   * Update fav-series collection in firestore db by calling respective function from movieService.js
   */
  const favSeries = ()=>{
    const auth = getAuth()
    const user = auth.currentUser
    likeTVSeries(user.uid, data)
  }
    /**
   * Update fav-movies collection in firestore db by calling respective function from movieService.js
   */
  const favMovie = ()=>{
    const auth = getAuth();
    const user = auth.currentUser
    likeMovie(user.uid, data)
  }


  return (
    <div 
      onClick={rotate}
      className={`movie ${lastMovie ? 'lastMovie' : ''}`}
    >
      { loadingImg && <LoadingWaves/> }
      {<img 
      style={imageStyle}
        className="movieImg"
        onLoad={handleImgLoad} 
        onError={handleImgErr} 
        src={imgSrc} 
        alt={imgAlt}
      />
  }
      { allowLike && (rotationIndex == 1) && <span className="likeHeart" onClick={addToFavs}><BsFillBookmarkHeartFill/></span>}
      { rotationIndex == 1 && <p className="mainTitle">{data.titleText.text}</p>}
      <div className="bottomTab">
        <p className="title">{data.titleText.text.toUpperCase()}</p>
        <p className="yr">{data.releaseYear?.year}</p>
        {ratingsLoaded && 
          <p className="rating">
            { rating !== null  
              ? ( <>
                  <span><AiFillStar/></span>{rating}%
                  </>
                )
              : (<ImBlocked/>)
            }
          </p>}
      </div>
    </div>
  )
}
