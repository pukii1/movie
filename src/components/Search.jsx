import React from 'react'
import UserNavbar from './sharedComponents/UserNavbar'
import Header from './sharedComponents/Header'
import { PiMagnifyingGlassBold } from "react-icons/pi"
import { BsFilterSquareFill } from "react-icons/bs"
import "../styles/Search.scss"
import { useState, useEffect } from 'react'
import SearchFilters from './innerComponents/SearchFilters'
/**
 * Search component
 * includes search feature
 * @param {*} param0 
 * @returns 
 */
export default function Search({currentPath}) {
  const {searchValue, setSearchValue} = useState("")
  const [searchResults, setSearchResults] = useState(null)
  const [searchError, setSearchError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState(null)
  const [highlightFitlerIcon, setHighlightFilterIcon ] = useState(false)
  //API related consts
  const APIKey = 'f9e45181a3msh422b41bfbdd3bdbp127d70jsndf222028a016'
  const host = 'moviesdatabase.p.rapidapi.com'
  const url = 'https://moviesdatabase.p.rapidapi.com/titles/search/title/someMovieTitle?exact=false&titleType=movie';
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': APIKey,
      'X-RapidAPI-Host': host
    }
  };
  
  



  const searchMedia = async ()=>{
    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      setSearchResults(result)
    } catch (error) {
      setSearchError(error.message)
      console.error(error);
    }
    console.log("searching for " + searchValue)
  }

  const updateSearchValue = (e)=>{
    setSearchValue(e.target.value)
  }
  

  const toggleFilters = ()=>{
    setShowFilters(prev => !prev)
  }

  useEffect(()=>{
    console.log("new filters:")
    console.log(filters)
  }, {setFilters})
  useEffect(()=>{
    setHighlightFilterIcon(showFilters)
  }, [showFilters])
  return (
    <div className="search">
        <Header title={"Search"}/>
        <div className="searchContainer">
          <h1>Find what ur looking for</h1>
          <div className="searchbar">
            <input 
              value={searchValue}
              onChange={updateSearchValue}
              type="text"
            />
            <div className="searchSelectors">
              <PiMagnifyingGlassBold 
                onClick={searchMedia} 
                className="mag"
              />

              <BsFilterSquareFill
                className={`filter ${highlightFitlerIcon ? 'highlight' : ''}`}
                onClick={toggleFilters}
              />
            </div>
            
          </div>

          {showFilters && <SearchFilters setFilters={setFilters}/>}
        </div>


        {searchResults && searchResults.map((result, i)=> <MovieCard/>)}
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
