import React from 'react'
import { getAuth, signOut } from "firebase/auth"
import { useNavigate } from 'react-router-dom';
import { BiSolidChevronsLeft } from 'react-icons/bi'

export default function SignOut() {
    const auth = getAuth();
    const navigate = useNavigate();

    const handleSignOut = ()=>{
        signOut(auth).then(() => {
        navigate("/")
      }).catch((error) => {
        // An error happened.
      });
    }

    return (
    <div className="signOut">
        <button onClick={handleSignOut} className="signOut"><BiSolidChevronsLeft className="signOutIcon"/>Sign Out</button>
    </div>
  )
}
