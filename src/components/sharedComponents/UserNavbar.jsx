
import React from 'react'
import { BiMoviePlay, BiSolidMoviePlay, BiSolidSearch, BiSearch, BiHeart, BiSolidHeart } from "react-icons/bi";
import { PiUserFocus, PiUserFocusFill } from "react-icons/pi"
import { TbCircleLetterF } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom';
import NavbarButton from '../innerComponents/NavbarButton';
import "../../styles/UserNavbar.scss"

export default function UserNavbar({currentPath}) {
  const history = useNavigate();
    
  return (
    <div className="userNavbar">
      <NavbarButton currentPath={currentPath} history={history} path="/" icon={<BiMoviePlay/>} hoverIcon={<BiSolidMoviePlay/>}/>
      <NavbarButton currentPath={currentPath} history={history} path="/search" icon={<BiSearch/>} hoverIcon={<BiSolidSearch/>}/>
      <NavbarButton icon={<TbCircleLetterF/>} history={history} path="/" hoverIcon={<TbCircleLetterF/>}/>
      <NavbarButton currentPath={currentPath} history={history} path="/favs" icon={<BiHeart/>} hoverIcon={<BiSolidHeart/>}/>
      <NavbarButton currentPath={currentPath} history={history} path="/user" icon={<PiUserFocus/>} hoverIcon={<PiUserFocusFill/>}/>
    </div>
  )
}
