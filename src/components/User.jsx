import React from 'react'
import SignOut from "./SignOut.jsx"
import { getAuth } from "firebase/auth"
import UserNavbar from "./UserNavbar.jsx"
import Header from './Header'

export default function User({currentPath}) {

    const auth = getAuth();
    const user = auth.currentUser;
    return (
    <div>
        <Header title={"Profile"}/>
      <SignOut/>
      <p>User: {user?.uid} is authenticated</p>
      <UserNavbar currentPath={currentPath}/>
    </div>
  )
}
