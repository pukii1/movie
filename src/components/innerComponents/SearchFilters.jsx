import React from 'react'
import "../../styles/SearchFilters.scss"
import { useState } from "react"

export default function SearchFilters({setFilters}) {
  const [movies, setMovies] = useState(true)
  
  const toggleMediaType = (e)=>{
    e.preventDefault();
    setMovies(e.target.value == 'movies')
  }
  
  return (
    <div className="filters">
      <div className="mediaType">
        <button 
          value="movies"
          onClick={toggleMediaType}
          className={`mediaButton ${movies ? 'selected' : ''}`}>
            movies
        </button>
        <button 
          value="shows"
          onClick={toggleMediaType} 
          className={`mediaButton ${movies ? '' : 'selected'}`}>
            shows
        </button>
      </div>
    </div>
  )
}
