import React from 'react'
import UserNavbar from './UserNavbar'
import Header from './Header'

export default function Favs({currentPath}) {
  return (
    <div>
      <Header title={"Favs"}/>
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
