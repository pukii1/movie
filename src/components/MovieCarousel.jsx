import React from 'react'
import { useState, useEffect } from 'react'
import "../styles/MovieCarousel.scss"
import MovieCard from './innerComponents/MovieCard'
import { BiSolidChevronLeft } from 'react-icons/bi'
import { BiSolidChevronRight } from 'react-icons/bi'
import {TbReload} from "react-icons/tb"
import { getRandomMoviesFromAPI, getRandomSeriesFromAPI, getRandomMoviesFromCache, getRandomSeriesFromCache } from '../services/movieService'

export default function MovieCarousel({movies}) {
    const [renderMovies, setRenderMovies] = useState(true)
    const [numMovies, setNumMovies] = useState(0)
    const [displayIdxs, setDisplayIdxs] = useState([0, 1, 2])
    const keys = [0,1,2]

    const [fetchedMovies, setFetchedMovies] = useState(null)
    const [fetchedSeries, setFetchedSeries] = useState(null)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true);
  /*  const randomUrl = 'https://moviesdatabase.p.rapidapi.com/titles/random?list=most_pop_movies'
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
      if(movies){
        setFetchedMovies(result.results)
      } else {
        setFetchedSeries(result.results)
      }
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
*/
  const fetchMedia = async()=>{
    if(movies){
      let fMovies = getRandomMoviesFromCache()
      if(fMovies == null){
        try{
          fMovies = await getRandomMoviesFromAPI()
          setFetchedMovies(fMovies)
        }catch( error) {
          setError(error.message)
        }
        //TODO error check
      } else {
        setFetchedMovies(fMovies)
      }
    }
    else {
      let fSeries = getRandomSeriesFromCache()
      if(fSeries == null){
        try{
          fSeries = await getRandomSeriesFromAPI()
          setFetchedSeries(fSeries)
        }
        catch(error){
          setError(error.message)
        }
      } else {
        setFetchedSeries(fSeries)
      }
    }
  }
  useEffect(()=>{
    fetchMedia()
    //setFetchUrl(()=> movies ? randomUrl : randomSeriesUrl)
  }, [movies])
/*
  useEffect(()=>{
    fetchData();
  }, [fetchUrl])
  */
  useEffect(()=>{
    if(fetchedMovies){
      setNumMovies(fetchedMovies.length)
      setLoading(false)
    } else {
      setLoading(true)
    }
    if(fetchedSeries){
      setNumMovies(fetchedSeries.length)
      setLoading(false)
    }

    console.log(fetchedMovies)
    console.log(fetchedSeries)
  }, [fetchedMovies, fetchedSeries])

    //rotate carousel to the left
    const rotateLeft = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=> (((idx - 1 ) % (numMovies ) ) + numMovies) % numMovies))       
    }

    //rotate carousel to the right
    const rotateRight = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=>(idx + 1) % (numMovies)))
    }

    //fetch new media button click event handler to get new batch of random movies/series
    const fetchNewMedia = async ()=>{
      try{
        console.log("fetch new media")
        if(movies){
          let newMovies = await getRandomMoviesFromAPI()
          setFetchedMovies(newMovies)
        } else {
          let newSeries = await getRandomSeriesFromAPI()
          setFetchedSeries(newSeries)
        }
      }
      catch(error){
        setError(error.message)
      }
      
    }
    useEffect(()=>{
        setRenderMovies(true)
        console.log(displayIdxs)
    }, [displayIdxs])


    return (
    <div className="movieCarousel">

      {loading && <div className="loading">Loading...</div>}
      
      { movies && !loading && !fetchedMovies && <div>No movies...</div>}
      { !movies && !loading && !fetchedSeries && <div>No tv series...</div>}
      
      {error && <div className="error">An error occured, unfortunately we couldnt fetch any movies.</div>}
      
      
      
      {/*{ (movies && fetchedMovies) || (!movies && fetchedSeries) &&*/}
      <>
        <div className="movieContainer" >
          
        {renderMovies && displayIdxs.map((displayIdx, index) => (
          (movies && fetchedMovies !== null && fetchedMovies[displayIdx]) || (!movies && fetchedSeries !== null && fetchedSeries[displayIdx]) ? (
            <MovieCard 
              data = { movies ? fetchedMovies[displayIdx] : fetchedSeries[displayIdx]}
              rotationIndex={keys[index]}
              rotate={index === 0 ? rotateLeft : (index === 2 ? rotateRight : null)}
              lastMovie={index === displayIdxs.length - 1}
              key={displayIdx}
            />
          ) : null
        ))}
          
        </div>
        </>
      {/*}}*/}
    
      <div className="carouselNavigation">
        {renderMovies && <>
          <button onClick={rotateLeft}><BiSolidChevronLeft/></button>
          <button onClick={rotateRight}><BiSolidChevronRight/></button>
        </>}
        
      </div>
      <div className="reload"><button onClick={fetchNewMedia} className="buttonReload"><TbReload/></button></div> 

    </div>
  )
}
