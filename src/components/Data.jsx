import React, { useEffect } from 'react'
import { useState } from "react"
import "../styles/Data.scss"
import { BiChevronRight } from "react-icons/bi"
import MovieCarousel from './MovieCarousel'


export default function Data() {
    const [movies, setDataType] = useState(true)
    const [data, setData] = useState(null)
    const selectDataType = (e)=>{
        setDataType(()=> e.target.value == "movies" )
    }
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);
    const randomUrl = 'https://moviesdatabase.p.rapidapi.com/titles/random?list=most_pop_movies'
    const randomSeriesUrl =  'https://moviesdatabase.p.rapidapi.com/titles/random?list=most_pop_series';
    const [fetchUrl, setFetchUrl] = useState(randomUrl);
    const host = 'moviesdatabase.p.rapidapi.com'
    const apiKey = 'f9e45181a3msh422b41bfbdd3bdbp127d70jsndf222028a016'
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': host
      }
    };
  const fetchData = async ()=>{
    try {
      const response = await fetch(fetchUrl, options);
      const result = await response.json();
      setData(result.results);
      setLoading(false)
      console.log(result.results);
    } catch (error) {
      setLoading(false)
      setError(error.message)
    }
  }
  useEffect(()=>{
    fetchData();
  }, [])
  useEffect(()=>{
    setFetchUrl(()=> movies ? randomUrl : randomSeriesUrl)
  }, [movies])

  useEffect(()=>{
    fetchData();
  }, [fetchUrl])
  
  useEffect(()=>{
    if(data){
      setLoading(false)
      console.log("data changed")
    } else {
      setLoading(true)
    }
  }, [data])

  return (
    <div className="data">
      <div className="tabHeader">
          <button value="movies" onClick={(e)=>{selectDataType(e)}} className={`loginHeader ${movies ? 'selected' : 'deselected'}`}>Movies</button>
          <button  value="series" onClick={(e)=>{selectDataType(e)}} className={`signUpHeader ${movies ? 'deselected' : 'selected'}`}>TV Series</button>
        </div>
        <div className="navigation">
            
            <button onClick={()=>{}}className="popular">Popular</button>
            <button className="seeAll">See all <BiChevronRight/></button>
        </div>
        
        {error ? <div className="error">An error occured, unfortunately we couldnt fetch any movies.</div>: 
                 <>{loading ? <div className="loading">Loading...</div> : <MovieCarousel data={data}/>}</>}
      
    </div>
  )
}
