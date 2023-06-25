import React from 'react'
import UserNavbar from './UserNavbar'

export default function Favs({currentPath}) {
  return (
    <div>
      Favs
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
