import React from 'react'
import UserNavbar from './UserNavbar'
import Header from './Header'

export default function Search({currentPath}) {
  return (
    <div>
        <Header title={"Search"}/>
        
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
