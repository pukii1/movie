import React from 'react'
import { useState, useEffect } from 'react'
import "../styles/MovieCarousel.scss"
import Movie from './Movie'

export default function MovieCarousel({data}) {
    const [renderMovies, setRenderMovies] = useState(true)
    const numMovies = data?.length - 1; 
    console.log(numMovies)   
    const [displayIdxs, setDisplayIdxs] = useState([0, 1, 2])
    
    const rotateLeft = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=>(idx - 1 + numMovies) % (numMovies + 1)))       
    }

    const rotateRight = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=>(idx + 1 + numMovies + 1) % numMovies))
    }

    useEffect(()=>{
        setRenderMovies(true)
    }, [displayIdxs])
    if(!data){
        return <div>No data...</div>
    }
    return (
    <div className="movieCarousel">
      {renderMovies && displayIdxs.map((idx) => (<Movie data={data[idx]} idx={displayIdxs[idx]} key={idx} />))}
      <div className="carouselNavigation">
        {renderMovies && <>
          <button onClick={rotateLeft}>left</button>
          <button onClick={rotateRight}>right</button>
        </>}
        
      </div>
    </div>
  )
}
