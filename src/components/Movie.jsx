import React from 'react'
import "../styles/Movie.scss"
import { useState, useEffect, useRef } from "react"
import LoadingWaves from './LoadingWaves'
import {AiFillStar} from "react-icons/ai"

export default function Movie({data, rotationIndex, idx}) {
  const [imgSrc, setImgSrc] = useState(null)
  const [imgAlt, setImgAlt] = useState(null)
  const [rating, setRating] = useState(null)
  const [loadingImg, setLoadingImg] = useState(true)
  const [ratingsLoaded, setRatingsLoaded] = useState(false)
  const ratingsUrl = `https://moviesdatabase.p.rapidapi.com/titles/${data.id}/ratings`;
  const ratingsApiKey = 'f9e45181a3msh422b41bfbdd3bdbp127d70jsndf222028a016';
  const host =  'moviesdatabase.p.rapidapi.com' 
  const imageStyle = {
    display: loadingImg ? 'none' : 'block',
  };

  useEffect(() => {
    if (data) {
      setImgSrc(data.primaryImage?.url);
      setImgAlt(data.primaryImage?.caption.plainText);
      setLoadingImg(true)
      fetchRatings()
    }
  }, [data]);

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': ratingsApiKey,
      'X-RapidAPI-Host': host
    }
  };
  






  const handleImgErr = ()=>{
    setImgSrc( process.env.PUBLIC_URL + "/assets/moviePlaceholder.jpg")
    setImgAlt("Img not found...")
  }
  const handleImgLoad = ()=>{
    setLoadingImg(false)
    console.log("img loaded")
  }


  const fetchRatings = async()=>{
    try {
      const response = await fetch(ratingsUrl, options);
      const result = await response.json();
      setRating(result.results.averageRating);
      setRatingsLoaded(true)
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <div className="movie">
      {  <LoadingWaves/> }
      {/*<img 
      style={imageStyle}
        className="movieImg"
        onLoad={handleImgLoad} 
        onError={handleImgErr} 
        src={imgSrc} 
        alt={imgAlt}
      />
  */}
      { rotationIndex == 1 && <p className="mainTitle">{data.originalTitleText.text}</p>}
      <div className="bottomTab">
        <p className="title">{data.originalTitleText.text.toUpperCase()}</p>
        <p className="yr">{data.releaseYear?.year}</p>
        {ratingsLoaded && 
          <p className="rating">
            <span><AiFillStar/></span>{rating}%
          </p>}
      </div>
    </div>
  )
}
