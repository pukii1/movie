import React from 'react'
import "../styles/Movie.scss"

export default function Movie({data, idx}) {
  return (
    <div className="movie">
      <img className="movieImg" src={data.primaryImage.url} alt={data.primaryImage.caption.plainText}/>
      <p>{data.originalTitleText.text}</p>
      <div className="bottomTab">
        <p>release yr</p>
        <p>ratings</p>
      </div>
    </div>
  )
}
