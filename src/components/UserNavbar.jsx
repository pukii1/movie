
import React from 'react'
import { BiMoviePlay, BiSolidMoviePlay, BiSolidSearch, BiSearch, BiHeart, BiSolidHeart } from "react-icons/bi";
import { PiUserFocus, PiUserFocusFill } from "react-icons/pi"
import { tbLetterF } from 'react-icons/tb'
import NavbarButton from './NavbarButton';
import "../styles/UserNavbar.scss"

export default function UserNavbar() {
  return (
    <div className="userNavbar">
      <NavbarButton icon={<BiMoviePlay/>} hoverIcon={<BiSolidMoviePlay/>}/>
      <NavbarButton icon={<BiSearch/>} hoverIcon={<BiSolidSearch/>}/>
      <NavbarButton icon={<tbLetterF/>} hoverIcon={<tbLetterF/>}/>
      <NavbarButton icon={<BiHeart/>} hoverIcon={<BiSolidHeart/>}/>
      <NavbarButton icon={<PiUserFocus/>} hoverIcon={<PiUserFocusFill/>}/>
    </div>
  )
}
