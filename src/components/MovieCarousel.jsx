import React from 'react'
import { useState, useEffect } from 'react'
import "../styles/MovieCarousel.scss"
import MovieCard from './innerComponents/MovieCard'
import { BiSolidChevronLeft } from 'react-icons/bi'
import { BiSolidChevronRight } from 'react-icons/bi'

export default function MovieCarousel({data}) {
    const [translateX, setTranslateX] = useState(0);
    const [renderMovies, setRenderMovies] = useState(true)
    const numMovies = data?.length; 
    //[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    const [displayIdxs, setDisplayIdxs] = useState([0, 1, 2])
    const keys = [0,1,2]
    const rotateLeft = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=> (((idx - 1 ) % (numMovies ) ) + numMovies) % numMovies))       
        setTranslateX("100%")
    }

    const rotateRight = ()=>{
        setRenderMovies(false)
        setDisplayIdxs((displayIdxs)=> displayIdxs.map((idx)=>(idx + 1) % (numMovies)))
        setTranslateX("-100%")
    }

    useEffect(()=>{
        setRenderMovies(true)
        console.log(displayIdxs)
    }, [displayIdxs])
    if(!data){
        return <div>No data...</div>
    }
    return (
    <div className="movieCarousel">
      <div className="movieContainer" style={{'transform' : `translateX${translateX}`}}>
        {renderMovies && displayIdxs.map((idx, index) => (
          <MovieCard 
            data={data[idx]} 
            idx={displayIdxs[idx]} 
            rotationIndex={keys[index]} 
            rotate={index == 0 ? rotateLeft : (index == 2 ? rotateRight : null)}
            lastMovie={index === displayIdxs.length - 1}
            key={idx} />)
        )}
      </div>
    
      <div className="carouselNavigation">
        {renderMovies && <>
          <button onClick={rotateLeft}><BiSolidChevronLeft/></button>
          <button onClick={rotateRight}><BiSolidChevronRight/></button>
        </>}
        
      </div>
    </div>
  )
}
