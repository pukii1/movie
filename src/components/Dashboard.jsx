import React from 'react'
import { getAuth } from "firebase/auth"
import SignOut from "./SignOut.jsx"
import UserNavbar from './UserNavbar.jsx';

export default function Dashboard() {
    const auth = getAuth();
    const user = auth.currentUser;

    return (
    <div className='dashboard'>
      <SignOut/>
      <p>User: {user?.uid} is authenticated</p>
      <UserNavbar/>
    </div>
  )
}
