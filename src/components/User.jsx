import React from 'react'
import UserNavbar from "./UserNavbar.jsx"
import Header from './Header'

export default function User({currentPath}) {

    return (
    <div>
        <Header title={"Profile"}/>
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
