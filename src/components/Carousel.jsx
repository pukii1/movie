import React from 'react'
import { useState, useEffect } from 'react'
import "../styles/MovieCarousel.scss"
import MovieCard from './innerComponents/MovieCard'
import { BiSolidChevronLeft } from 'react-icons/bi'
import { BiSolidChevronRight } from 'react-icons/bi'
import {TbReload} from "react-icons/tb"

/**
 * Basic movie carousel component
 * just renders a selection of movies in a carousel view
 * that can b manually rotated
 * @param {*} param0 moviesData selection of movies to b rendered in the carousel
 * @returns 
 */
export default function Carousel({moviesData}) {
    const [renderMovies, setRenderMovies] = useState(true)
    const [numMovies, setNumMovies] = useState(0)
    const [displayIdxs, setDisplayIdxs] = useState([0, 1, 2])
    const keys = [0,1,2]
    const [loading, setLoading] = useState(true);


    useEffect(()=>{
        if(moviesData){
          setNumMovies(moviesData.length)
          setLoading(false)
        } else {
          setLoading(true)
        }
        
      }, [moviesData])
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


    useEffect(()=>{
        setRenderMovies(true)
    }, [displayIdxs])

    return (
        <div className="movieCarousel">

        {loading && <div className="loading">Loading...</div>}
        
        { !loading && !moviesData && <div>No movies...</div>}
        
        
        <div className="movieContainer" >
        
        {renderMovies && displayIdxs.map((displayIdx, index) => (
        ( moviesData !== null && moviesData[displayIdx]) ? (
            <MovieCard 
            data = {moviesData[displayIdx]}
            rotationIndex={keys[index]}
            rotate={index === 0 ? rotateLeft : (index === 2 ? rotateRight : null)}
            lastMovie={index === displayIdxs.length - 1}
            key={displayIdx}
            />
        ) : null
        ))}
        
        </div>
      
        <div className="carouselNavigation">
          {renderMovies && <>
            <button onClick={rotateLeft}><BiSolidChevronLeft/></button>
            <button onClick={rotateRight}><BiSolidChevronRight/></button>
          </>}
          
        </div>
        <div className="reload"><button onClick={()=>{console.log("clicked reload")}} className="buttonReload"><TbReload/></button></div> 
  
      </div>
  )
}
