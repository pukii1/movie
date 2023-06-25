import React from 'react'
import { getAuth } from "firebase/auth"
import UserNavbar from './UserNavbar.jsx';
import Data from './Data.jsx';

export default function Dashboard({currentPath}) {
    const auth = getAuth();
    const user = auth.currentUser;

    return (
    <div className='dashboard'>
      <Data/>
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
