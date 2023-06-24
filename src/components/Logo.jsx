import React from 'react'
import "../styles/Logo.scss"


export default function Logo() {
  return (
    <div className="logo">
        <img src={process.env.PUBLIC_URL + "/assets/Logo.png"} alt="app logo" />

    </div>
  )
}
