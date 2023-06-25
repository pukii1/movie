import React from 'react'
import { Route, Routes } from 'react-router-dom';
import Favs from './Favs';
import { BrowserRouter as Router } from 'react-router-dom';
import Dashboard from './Dashboard.jsx';
import User from './User.jsx';
import Search from "./Search.jsx"

export default function Dev() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<Dashboard currentPath={"/"}/>}/>
        <Route path="/favs" element={<Favs currentPath={"/favs"}/>}/>
        <Route path="/user" element={<User currentPath={"/user"}/>}/>
        <Route path="/search" element={<Search currentPath={"/search"}/>}/>
      </Routes>
    </Router>

  )
}
