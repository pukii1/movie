import React from 'react'
import UserNavbar from './sharedComponents/UserNavbar'
import Header from './sharedComponents/Header'

export default function Search({currentPath}) {
  return (
    <div>
        <Header title={"Search"}/>
        
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
