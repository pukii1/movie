import React from 'react'
import "../styles/Header.scss"

export default function Header({title}) {
  return (
    <div className='header'>
      <h2>{title}</h2>
    </div>
  )
}
