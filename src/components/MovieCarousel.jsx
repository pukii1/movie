import React from 'react'
import { useState, useEffect } from 'react'
import "../styles/MovieCarousel.scss"
import Movie from './Movie'
import { BiSolidChevronLeft } from 'react-icons/bi'
import { BiSolidChevronRight } from 'react-icons/bi'

export default function MovieCarousel({data}) {
    console.log(data)
    const [renderMovies, setRenderMovies] = useState(true)
    const numMovies = data?.length - 1; 
    const [displayIdxs, setDisplayIdxs] = useState([0, 1, 2])
    const keys = [0,1,2]
    const rotateLeft = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=>(idx - 1 + numMovies) % (numMovies + 1)))       
    }

    const rotateRight = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=>(idx + 1 + numMovies) % numMovies  + 1))
    }

    useEffect(()=>{
        setRenderMovies(true)
    }, [displayIdxs])
    if(!data){
        return <div>No data...</div>
    }
    return (
    <div className="movieCarousel">
      {renderMovies && displayIdxs.map((idx, index) => (
        <Movie 
          data={data[idx]} 
          idx={displayIdxs[idx]} 
          rotationIndex={keys[index]} 
          key={idx} />)
      )}
      <div className="carouselNavigation">
        {renderMovies && <>
          <button onClick={rotateLeft}><BiSolidChevronLeft/></button>
          <button onClick={rotateRight}><BiSolidChevronRight/></button>
        </>}
        
      </div>
    </div>
  )
}
