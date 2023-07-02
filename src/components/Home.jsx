import React, { useEffect } from 'react'
import { useState } from "react"
import "../styles/Home.scss"
import { BiChevronRight } from "react-icons/bi"
import MovieCarousel from './MovieCarousel'
import MovieSelection from './MovieSelection'
import { BsArrowLeftCircleFill } from 'react-icons/bs'
import { BsArrowLeftCircle } from 'react-icons/bs'
import Header from './sharedComponents/Header'
import UserNavbar from './sharedComponents/UserNavbar.jsx';

export default function Home({currentPath}) {
    const [movies, setDataType] = useState(true)
    const [showPopular, setShowPopular] = useState(false)
    const [seeAll, setSeeAll] = useState(false)
    const [ highlightReturn, setHighlightReturn] = useState(false)
    const [showSelection, setShowSelection] = useState(false)
    const [title, setTitle] = useState("Home")
    const selectDataType = (e)=>{
        setDataType(()=> e.target.value == "movies" )
    }
    
  useEffect(()=>{
    if(showPopular){
      setTitle(`Popular ${movies ? 'Movies' : 'TV Series'}`)
    }
    if(seeAll){
      setTitle(`All ${movies ? 'Movies' : 'TV Series'}`)
    }
  }, [movies])

  const toggleShowPopular = () => { 
    setTitle(`Popular ${movies ? 'Movies' : 'TV Series'}`)
    setSeeAll(false); 
    setShowSelection(true); 
    setShowPopular(true)
  }
  const toggleSeeAll = () => {
    setTitle(`All ${movies ? 'Movies' : 'TV Series'}`)
    setSeeAll(true); 
    setShowSelection(true); 
    setShowPopular(false)
  }

  const returnToCarousel = ()=>{
    setTitle("Home")
    console.log("return to carousel")
    setShowSelection(false)
    setShowPopular(false)
    setSeeAll(false)
  }

  const doHighlightReturn = ()=>{
    setHighlightReturn(true)
  }
  const dontHightlightReturn = ()=>{
    setHighlightReturn(false)
  }

  return (
    <div className="data">
      
      <Header title={title}/>
      <div className="tabHeader">
          <button value="movies" onClick={(e)=>{selectDataType(e)}} className={`moviesHeader ${movies ? 'selected' : 'deselected'}`}>Movies</button>
          <button  value="series" onClick={(e)=>{selectDataType(e)}} className={`seriesHeader ${movies ? 'deselected' : 'selected'}`}>TV Series</button>
        </div>
        <div className="navigation">
            { showSelection && 
              <button 
                className="returnToCarousel" 
                onMouseEnter={doHighlightReturn} 
                onMouseLeave={dontHightlightReturn} 
                onClick={returnToCarousel}>
                  { highlightReturn ? <BsArrowLeftCircleFill/> : <BsArrowLeftCircle/> }
              </button>}
            { !showSelection && 
              <>
                <button onClick={toggleShowPopular} className={`popular ${showPopular ? 'selected': ''}`}>Popular</button>
                <button onClick={toggleSeeAll} className={`seeAll ${seeAll ? 'selected' : ''}`}>See all <BiChevronRight/></button>
              </>
            }
        </div>
              { !showSelection && <MovieCarousel movies={movies}/>}
              { showSelection && <MovieSelection mediaType={movies} popular={showPopular}/>}
         
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
