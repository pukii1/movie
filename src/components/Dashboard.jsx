import React from 'react'
import { getAuth } from "firebase/auth"
import UserNavbar from './sharedComponents/UserNavbar.jsx';
import Data from './Data.jsx';
import Header from "./sharedComponents/Header.jsx"

export default function Dashboard({currentPath}) {
    const auth = getAuth();
    const user = auth.currentUser;

    return (
    <div className='dashboard'>
      <Header title={"Home"}/>
      <Data/>
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
