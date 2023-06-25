import React from 'react'
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

export default function NavbarButton({currentPath, history, path, hoverIcon, icon}) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = ()=>{
        setIsHovered(true)
    }
    const handleMouseLeave = ()=>{
        setIsHovered(false)
    }
    const handleClick = (e)=>{
        e.preventDefault();
       history(path)
    }
    return (
    <button onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="navButton">
        {isHovered || (currentPath == path) ? hoverIcon : icon}
    </button>
  )
}
