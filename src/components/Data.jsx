import React from 'react'
import { useState } from "react"
import "../styles/Data.scss"
import { BiChevronRight } from "react-icons/bi"

export default function Data() {
    const [movies, setDataType] = useState(true)
    const selectDataType = ()=>{
        setDataType((prev)=>!prev)
    }
  return (
    <div className="data">
      <div className="tabHeader">
          <button value="movies" onClick={selectDataType} className={`loginHeader ${movies ? 'selected' : 'deselected'}`}>Movies</button>
          <button  value="series" onClick={selectDataType} className={`signUpHeader ${movies ? 'deselected' : 'selected'}`}>TV Series</button>
        </div>
        <div className="navigation">
            <button className="popular">Popular</button>
            <button className="seeAll">See all <BiChevronRight/></button>
        </div>

    </div>
  )
}
