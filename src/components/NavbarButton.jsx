import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState } from 'react';

export default function NavbarButton({hoverIcon, icon}) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = (e)=>{
        setIsHovered(true)
    }
    const handleMouseLeave = (e)=>{
        setIsHovered(false)
    }
    return (
    <button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="navButton">
        {isHovered ? hoverIcon : icon}
    </button>
  )
}
