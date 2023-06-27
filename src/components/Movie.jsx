import React from 'react'
import "../styles/Movie.scss"
import { useState, useEffect } from "react"
import LoadingWaves from './LoadingWaves'

export default function Movie({data, idx}) {
  const [imgSrc, setImgSrc] = useState(data?.primaryImage?.url)
  const [imgAlt, setImgAlt] = useState(data?.primaryImage?.caption.plainText)
  const [rating, setRating] = useState(null)
  const [ratingsLoaded, setRatingsLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const ratingsUrl = 'https://moviesdatabase.p.rapidapi.com/titles/tt1797504/ratings';
  const ratingsApiKey = 'f9e45181a3msh422b41bfbdd3bdbp127d70jsndf222028a016';
  const host =  'moviesdatabase.p.rapidapi.com' 

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
    setLoading(false)
    console.log(loading)
  }

  const fetchRatings = async()=>{
    try {
      const response = await fetch(ratingsUrl, options);
      const result = await response.json();
      setRating(result.results.averageRating);
      setRatingsLoaded(true)
      console.log(result)
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{
    fetchRatings()
  }, [])


  return (
    <div className="movie">
      { loading && <LoadingWaves/> }
      <img 
        style={{display: !loading ? 'block': 'none'}}
        className="movieImg" 
        onLoad={handleImgLoad} 
        onError={handleImgErr} 
        src={imgSrc} 
        alt={imgAlt}
      />
      
      <p>{data.originalTitleText.text}</p>
      <div className="bottomTab">
        <p>{data.releaseYear?.year}</p>
        {ratingsLoaded && <p>{rating}</p>}
      </div>
    </div>
  )
}
