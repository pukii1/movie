import React from 'react'
import { useState, useEffect } from 'react'
import "../styles/MovieCarousel.scss"
import MovieCard from './innerComponents/MovieCard'
import { BiSolidChevronLeft } from 'react-icons/bi'
import { BiSolidChevronRight } from 'react-icons/bi'

export default function MovieCarousel({movies}) {
    const [translateX, setTranslateX] = useState(0);
    const [renderMovies, setRenderMovies] = useState(true)
    const [numMovies, setNumMovies] = useState(0)
    const [displayIdxs, setDisplayIdxs] = useState([0, 1, 2])
    const keys = [0,1,2]

    const [data, setData] = useState(null)
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
      setNumMovies(data.length)
      setLoading(false)
      console.log("data changed")
    } else {
      setLoading(true)
    }
  }, [data])

    //rotate carousel to the left
    const rotateLeft = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=> (((idx - 1 ) % (numMovies ) ) + numMovies) % numMovies))       
        setTranslateX("100%")
    }

    //rotate carousel to the right
    const rotateRight = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=>(idx + 1) % (numMovies)))
        setTranslateX("-100%")
    }


    useEffect(()=>{
        setRenderMovies(true)
        console.log(displayIdxs)
    }, [displayIdxs])


    return (
    <div className="movieCarousel">

      {loading && <div className="loading">Loading...</div>}
      
      {!loading && !data && <div>No data...</div>}
      
      {error && <div className="error">An error occured, unfortunately we couldnt fetch any movies.</div>}
      
      
      
      { data && <div className="movieContainer" style={{'transform' : `translateX${translateX}`}}>
        {renderMovies && displayIdxs.map((idx, index) => (
          <MovieCard 
            data={data[idx]} 
            idx={displayIdxs[idx]} 
            rotationIndex={keys[index]} 
            rotate={index == 0 ? rotateLeft : (index == 2 ? rotateRight : null)}
            lastMovie={index === displayIdxs.length - 1}
            key={idx} />)
        )}
      </div>}
    
      <div className="carouselNavigation">
        {renderMovies && <>
          <button onClick={rotateLeft}><BiSolidChevronLeft/></button>
          <button onClick={rotateRight}><BiSolidChevronRight/></button>
        </>}
        
      </div>
    </div>
  )
}
